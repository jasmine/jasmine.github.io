(function() {
  window.JasmineDocs = {
    initHeader: function initHeader() {
      var header = document.querySelector('.header');
      if (typeof header.classList === 'undefined') { return; }

      document.addEventListener('scroll', function() {
        if (window.scrollY >= 250) {
          header.classList.add('small');
          header.style.height = null;
        } else {
          header.classList.remove('small');
          header.style.height = (300 - window.scrollY) + 'px';
        }
      });
    },

    init: function init() {
      window.JasmineDocs.initHeader();
    }
  };
})();
