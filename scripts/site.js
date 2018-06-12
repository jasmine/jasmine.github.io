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

    initSearch: function initSearch() {
      SimpleJekyllSearch({
        searchInput: document.querySelector('input[name="search"]'),
        resultsContainer: document.querySelector('.searchResults'),
        json: window.searchConfig,
        searchResultTemplate: '<li><a href="{url}">{title}</a></li>'
      });
    },

    init: function init() {
      window.JasmineDocs.initHeader();
      window.JasmineDocs.initSearch();
    }
  };
})();
