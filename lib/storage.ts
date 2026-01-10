import { AwsClient } from 'aws4fetch'
import { env } from '@/config/env'

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number }
) => {
  const { timeout = 8000, ...rest } = init || {}
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(input, {
      ...rest,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(id)
  }
}

interface imageOptions {
  contentType?: string
  width?: number
  height?: number
  headers?: Record<string, string>
}

type BucketType = 'public' | 'private'

class StorageClient {
  private client: AwsClient

  constructor() {
    this.client = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: env.R2_SECRET_ACCESS_KEY || '',
      service: 's3',
      region: 'auto',
    })
  }

  async upload({
    key,
    body,
    opts,
    bucket = 'public',
  }: {
    key: string
    body: Blob | Buffer | string
    opts?: imageOptions
    bucket?: BucketType
  }) {
    let uploadBody
    if (typeof body === 'string') {
      if (this.isBase64(body)) {
        uploadBody = this.base64ToArrayBuffer(body, opts)
      } else if (this.isUrl(body)) {
        uploadBody = await this.urlToBlob(body, opts)
      } else {
        throw new Error('Invalid input: Not a base64 string or a valid URL')
      }
    } else {
      uploadBody = body
    }

    // Get content length and convert Buffer to compatible type
    let contentLength: number
    let fetchBody: BodyInit

    if (uploadBody instanceof Blob) {
      contentLength = uploadBody.size
      fetchBody = uploadBody
    } else if (Buffer.isBuffer(uploadBody)) {
      contentLength = uploadBody.length
      // Convert Buffer to Uint8Array for fetch compatibility
      fetchBody = new Uint8Array(uploadBody)
    } else {
      // This should never happen, but TypeScript needs it
      throw new Error('Invalid upload body type')
    }

    const headers: Record<string, string> = {
      'Content-Length': contentLength.toString(),
      ...opts?.headers,
    }

    if (opts?.contentType) {
      headers['Content-Type'] = opts.contentType
    }

    try {
      const response = await this.client.fetch(
        `${this._getEndpoint()}/${this._getBucketName(bucket)}/${key}`,
        {
          method: 'PUT',
          headers,
          body: fetchBody,
        }
      )

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return {
        url: `${env.R2_BUCKET_URL}/${key}`,
      }
    } catch (error) {
      console.error('storage.upload failed', error)
      throw new Error('Failed to upload file. Please try again later.')
    }
  }

  async delete({ key, bucket = 'public' }: { key: string; bucket?: BucketType }) {
    try {
      const response = await this.client.fetch(
        `${this._getEndpoint()}/${this._getBucketName(bucket)}/${key}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.error('storage.delete failed', error)
      throw new Error('Failed to delete file. Please try again later.')
    }
  }

  async getSignedUrl({
    key,
    method,
    expiresIn,
    bucket,
  }: {
    key: string
    method: 'PUT' | 'GET'
    bucket: BucketType
    expiresIn: number
  }) {
    const url = new URL(`${this._getEndpoint()}/${this._getBucketName(bucket)}/${key}`)

    url.searchParams.set('X-Amz-Expires', String(expiresIn))

    try {
      const response = await this.client.sign(url, {
        method,
        aws: {
          signQuery: true,
          allHeaders: true,
        },
      })

      return response.url
    } catch (error) {
      console.error('storage.getSignedUrl failed', error)
      throw new Error('Failed to generate signed url. Please try again later.')
    }
  }

  async getSignedUploadUrl(opts: { key: string; bucket?: BucketType; expiresIn?: number }) {
    return await this.getSignedUrl({
      key: opts.key,
      method: 'PUT',
      bucket: opts.bucket || 'public',
      expiresIn: opts.expiresIn || 600,
    })
  }

  async getSignedDownloadUrl(opts: { key: string; bucket?: BucketType; expiresIn?: number }) {
    return await this.getSignedUrl({
      key: opts.key,
      method: 'GET',
      bucket: opts.bucket || 'private',
      expiresIn: opts.expiresIn || 600,
    })
  }

  private base64ToArrayBuffer(base64: string, opts?: imageOptions) {
    const base64Data = base64.replace(/^data:.+;base64,/, '')
    const paddedBase64Data = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      '='
    )

    const binaryString = atob(paddedBase64Data)
    const byteArray = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blobProps: any = {}
    if (opts?.contentType) blobProps.type = opts.contentType
    return new Blob([byteArray], blobProps)
  }

  private isBase64(str: string) {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    const dataImageRegex =
      /^data:image\/[a-zA-Z0-9.+-]+;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(str) || dataImageRegex.test(str)
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str)
      return true
    } catch (_) {
      return false
    }
  }

  private async urlToBlob(url: string, opts?: imageOptions): Promise<Blob> {
    let response: Response
    if (opts?.height || opts?.width) {
      try {
        const proxyUrl = new URL('https://wsrv.nl')
        proxyUrl.searchParams.set('url', url)
        if (opts.width) proxyUrl.searchParams.set('w', opts.width.toString())
        if (opts.height) proxyUrl.searchParams.set('h', opts.height.toString())
        proxyUrl.searchParams.set('fit', 'cover')
        response = await fetchWithTimeout(proxyUrl.toString())
      } catch (error) {
        response = await fetch(url)
      }
    } else {
      response = await fetch(url)
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }
    const blob = await response.blob()
    if (opts?.contentType) {
      return new Blob([blob], { type: opts.contentType })
    }
    return blob
  }

  private _getEndpoint() {
    if (!env.CLOUDFLARE_ACCOUNT_ID) {
      throw new Error('CLOUDFLARE_ACCOUNT_ID is not set')
    }
    return `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
  }

  private _getBucketName(bucket: BucketType) {
    if (bucket === 'public') {
      const bucketName = env.R2_PUBLIC_BUCKET || env.R2_BUCKET_URL?.split('/').pop() // Fallback if simple setup

      if (!bucketName) {
        throw new Error('R2_PUBLIC_BUCKET is not set')
      }

      return bucketName
    }

    if (bucket === 'private') {
      const bucketName = env.R2_PRIVATE_BUCKET

      if (!bucketName) {
        throw new Error('R2_PRIVATE_BUCKET is not set')
      }

      return bucketName
    }

    throw new Error(`Invalid bucket type: ${bucket}`)
  }
}

export const storage = new StorageClient()

export const isStored = (url: string) => {
  return (env.R2_BUCKET_URL && url.startsWith(env.R2_BUCKET_URL)) || false
}

export const isNotHostedImage = (imageString: string) => {
  return !imageString.startsWith('https://')
}
