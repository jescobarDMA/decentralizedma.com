/* GA4: send a generate_lead event when someone clicks a "Book a call" link.
   Works for every <a href*="calendar.app.google">. Location comes from the
   link's data-cta-location, or from the nearest section/nav/footer.
   Does not stop the click, so target=_blank still opens the booking page. */
(function () {
  function locationFor(a) {
    if (a.dataset && a.dataset.ctaLocation) return a.dataset.ctaLocation;
    var box = a.closest('[data-cta-location], section[id], nav, footer');
    if (!box) return 'unknown';
    if (box.dataset && box.dataset.ctaLocation) return box.dataset.ctaLocation;
    return box.id || box.tagName.toLowerCase();
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="calendar.app.google"]');
    if (!a || typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      method: 'book_call_click',
      link_location: locationFor(a),
      link_url: a.href,
      transport_type: 'beacon'
    });
  }, true);
})();
