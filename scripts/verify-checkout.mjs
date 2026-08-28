const slug = 'audio-wrapper-batch';
const billingBase = process.env.VITE_BILLING_BASE ?? 'https://api.sociobot.in';
const catalogUrl = `${billingBase}/api/v1/products`;
const checkoutUrl = `${catalogUrl}/${slug}/checkout`;

let response;
try {
  response = await fetch(catalogUrl, { headers: { Accept: 'application/json' } });
} catch (error) {
  throw new Error(`Studio product catalog could not be reached at ${catalogUrl}: ${error instanceof Error ? error.message : String(error)}`);
}

if (!response.ok) throw new Error(`Studio product catalog is not release-ready: ${catalogUrl} returned ${response.status}.`);
const catalog = await response.json();
const product = catalog?.data?.find((item) => item?.slug === slug);
if (product?.name !== 'Wrapline Studio' || product?.price_minor !== 2900 || product?.currency !== 'USD' || product?.checkout_url !== checkoutUrl) {
  throw new Error(`Studio product registration is incomplete or does not match the release contract at ${catalogUrl}.`);
}

console.log(`Verified Studio product registration for ${slug}: USD ${product.price_minor / 100}.`);
