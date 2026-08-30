const skipLink = document.querySelector('.skip-link');

skipLink?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector('#main');
  if (!(main instanceof HTMLElement)) return;
  history.pushState(null, '', '#main');
  main.focus({ preventScroll: true });
  main.scrollIntoView({ behavior: 'auto', block: 'start' });
});
