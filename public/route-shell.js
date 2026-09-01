const skipLink = document.querySelector('.skip-link');
const routeFocusKey = 'wrapline:route-focus';

let announcer = document.querySelector('#route-announcer');
if (!announcer) {
  announcer = document.createElement('div');
  announcer.id = 'route-announcer';
  announcer.className = 'visually-hidden';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  document.body.append(announcer);
}

function focusRouteHeading() {
  const heading = document.querySelector('h1');
  if (!(heading instanceof HTMLElement)) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = heading.textContent?.trim() ?? document.title; });
}

skipLink?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector('#main');
  if (!(main instanceof HTMLElement)) return;
  history.pushState(null, '', '#main');
  main.focus({ preventScroll: true });
  main.scrollIntoView({ behavior: 'auto', block: 'start' });
});

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && destination.href !== location.href) {
    sessionStorage.setItem(routeFocusKey, '1');
  }
});

window.addEventListener('pageshow', (event) => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const shouldFocus = sessionStorage.getItem(routeFocusKey) === '1' || event.persisted || navigation?.type === 'back_forward';
  if (!shouldFocus) return;
  sessionStorage.removeItem(routeFocusKey);
  setTimeout(focusRouteHeading, 50);
});

window.addEventListener('popstate', () => requestAnimationFrame(focusRouteHeading));
