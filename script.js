(function () {
  const worksPage = document.querySelector('.works-page');
  const rail = document.querySelector('.works-rail');
  if (!rail || !worksPage) return;

  worksPage.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
})();
