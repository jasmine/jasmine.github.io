(function() {
  window.JasmineDocs = {
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
      var target = document.querySelector(':target');
      if (target) {
        document.querySelector('body').scrollTo(0, target.offsetTop - 64);
        document.querySelector('html').scrollTo(0, target.offsetTop - 64);
      }
    },

    init: function init() {
      window.JasmineDocs.initSearch();
      window.addEventListener('load', window.JasmineDocs.scrollTargetLink);
      window.addEventListener('hashchange', window.JasmineDocs.scrollTargetLink);
      anchors.add('.article h1:not(.no_toc),.article h2:not(.no_toc),.article h3:not(.no_toc),.article h4:not(.no_toc)');
    }
  };
})();
