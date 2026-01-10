import Link from 'next/link'
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6'
import { SiProducthunt, SiYcombinator, SiPeerlist } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className='border-t border-[#E4E4E7] bg-[#F4F4F5] py-12'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {/* Column 1: Links */}
          <div>
            <h3
              className='mb-4 text-sm font-semibold uppercase'
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/pricing'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/docs'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href='/changelog'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href='/demo'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link
                  href='/support'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h3
              className='mb-4 text-sm font-semibold uppercase'
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Legal
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/terms'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Terms of services
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href='/licenses'
                  className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured On */}
          <div>
            <h3
              className='mb-4 text-sm font-semibold uppercase'
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Featured On
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='https://www.producthunt.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <SiProducthunt className='h-4 w-4' />
                  Product Hunt
                </Link>
              </li>
              <li>
                <Link
                  href='https://news.ycombinator.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <SiYcombinator className='h-4 w-4' />
                  Hacker News
                </Link>
              </li>
              <li>
                <Link
                  href='https://peerlist.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <SiPeerlist className='h-4 w-4' />
                  Peerlist
                </Link>
              </li>
              <li>
                <Link
                  href='https://github.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <FaGithub className='h-4 w-4' />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h3
              className='mb-4 text-sm font-semibold uppercase'
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Community
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='https://github.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <FaGithub className='h-4 w-4' />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href='https://discord.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <FaDiscord className='h-4 w-4' />
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
                >
                  <FaXTwitter className='h-4 w-4' />X
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-[#E4E4E7]'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <img src='/image.png' alt='ShipFree Logo' className='h-6 w-6 object-contain' />
              <span
                className='text-base font-semibold text-foreground'
                style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
              >
                ShipFree
              </span>
            </div>
            <p className='text-sm text-muted-foreground'>Turn ideas into products, fast</p>
            <p className='text-sm text-muted-foreground'>
              Copyright © {new Date().getFullYear()} -{' '}
              <Link href='https://revoks.dev'>The Revoks Company</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
