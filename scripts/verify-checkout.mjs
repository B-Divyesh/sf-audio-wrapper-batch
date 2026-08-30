const slug = 'audio-wrapper-batch';
const billingBase = process.env.VITE_BILLING_BASE ?? 'https://api.sociobot.in';
const checkoutUrl = `${billingBase}/api/v1/products/${slug}/checkout`;

let response;
try {
  response = await fetch(checkoutUrl, { method: 'HEAD', redirect: 'manual' });
} catch (error) {
  throw new Error(`Studio checkout could not be reached at ${checkoutUrl}: ${error instanceof Error ? error.message : String(error)}`);
}

if (![301, 302, 303, 307, 308].includes(response.status)) {
  throw new Error(`Studio checkout is not release-ready: ${checkoutUrl} returned ${response.status}.`);
}
const location = response.headers.get('location');
if (!location || new URL(location, checkoutUrl).protocol !== 'https:') throw new Error('Studio checkout did not return a secure hosted-checkout redirect.');

console.log(`Verified registered hosted checkout redirect for ${slug}.`);
