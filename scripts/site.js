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

    init: function init() {
      window.JasmineDocs.initSearch();
      window.addEventListener('load', window.JasmineDocs.scrollTargetLink);
      anchors.add('.article h1:not(.no_toc),.article h2:not(.no_toc),.article h3:not(.no_toc),.article h4:not(.no_toc)');
    }
  };
})();
