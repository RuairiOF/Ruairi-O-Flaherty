import SmartImage from '../SmartImage'
import LogoLoop from '../reactbits/LogoLoop'

const CARRIERS = [
  { key: 'an-post', name: 'An Post', src: '/images/projects/eirpost/carriers/An_Post_Logo.webp' },
  { key: 'dpd', name: 'DPD', src: '/images/projects/eirpost/carriers/DPD_Logo.webp' },
  { key: 'gls', name: 'GLS', src: '/images/projects/eirpost/carriers/GLS_Logo.webp' },
  { key: 'ups', name: 'UPS', src: '/images/projects/eirpost/carriers/UPS_Logo.webp' },
  { key: 'shopify', name: 'Shopify', src: '/images/projects/eirpost/carriers/Shopify_Logo.webp' },
  { key: 'etsy', name: 'Etsy', src: '/images/projects/eirpost/carriers/Etsy_Logo.webp' },
  {
    key: 'woocommerce',
    name: 'WooCommerce',
    src: '/images/projects/eirpost/carriers/WooCommerce_Logo.webp',
  },
]

/** Carrier + storefront marquee for the EirPost case study. */
export default function CarrierStrip() {
  return (
    <div className="glass-panel rounded-2xl px-4 py-6 sm:px-6">
      <p className="eyebrow text-center">Integrates with</p>
      <LogoLoop
        className="mt-5"
        speed={30}
        items={CARRIERS.map((carrier) => ({
          key: carrier.key,
          node: (
            <SmartImage
              src={carrier.src}
              alt={`${carrier.name} logo`}
              sizes="160px"
              className="h-8 w-auto max-w-[9rem] object-contain opacity-70 grayscale transition duration-base ease-out-expo hover:opacity-100 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0"
            />
          ),
        }))}
      />
    </div>
  )
}
