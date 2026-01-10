import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'ShipFree Purchase was successful',
})

export default function SuccessPage() {
  return (
    <div>
      <h1>Success</h1>
      <p>Your purchase has been successful.</p>
    </div>
  )
}
