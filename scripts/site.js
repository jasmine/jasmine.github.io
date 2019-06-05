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

    scrollTargetLink: function scrollTargetLink() {
      // If there is a :target (hash tag pointing to a specific section of this
      // article), scroll the page slightly so that the target header is not
      // covered by the floating navbar.
      //
      // There are various tricks for doing this using CSS ::before selectors,
      // but as of June 2019, none of them work in Chrome.
      var html = document.getElementsByTagName('html')[0];
      var target = document.querySelector(':target');
      if (target) {
        html.scrollTo(0, target.offsetTop - 64);
      }
    },

    init: function init() {
      window.JasmineDocs.initHeader();
      window.JasmineDocs.initSearch();
      window.addEventListener('load', window.JasmineDocs.scrollTargetLink);
      window.addEventListener('hashchange', window.JasmineDocs.scrollTargetLink);
    }
  };
})();
