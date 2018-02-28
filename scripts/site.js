(function() {
  window.JasmineDocs = {
    initHeader: function initHeader() {
      var header = document.querySelector('.header');
      if (typeof header.classList === 'undefined') { return; }

      document.addEventListener('scroll', function() {
        header.classList.remove('shrinking');
        header.classList.remove('small');

        var height = Math.max(50, 300 - window.scrollY);
        header.style.height = height + 'px';
        if (height <= 150) {
          header.classList.add('shrinking');
        }

        if (height === 50) {
          header.classList.add('small');
        }
      });
    },

    init: function init() {
      window.JasmineDocs.initHeader();
    }
  };
})();
