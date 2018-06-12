---
layout: null
---
window.searchConfig = [
  {%- for page in site.pages -%}
  {%- if page.title != nil -%}
  {
    "title": "{{ page.title | escape }}",
    "url": "{{ page.url }}",
    "date": "{{ page.date }}",
    "content": {{ page.content | strip_html | jsonify }}
  }{%- endif -%}{%- if page.title != nil -%},{% endif %}
  {%- endfor -%}
  {%- for page in site.tutorials -%}
  {
    "title": "{{ page.title | escape }}",
    "url": "{{ page.url }}",
    "date": "{{ page.date }}",
    "content": {{ page.content | strip_html | jsonify }}
  },
  {%- endfor -%}
  {%- for page in site.api -%}
  {%- if page.url contains "/edge" -%}
  {
    "title": "{{ page.title | escape }}",
    "url": "{{ page.url }}",
    "date": "{{ page.date }}",
    "content": {{ page.content | strip_html | jsonify }}
  }{%- endif -%}{%- if page.url contains "/edge" and forloop.last != true -%},{%- endif -%}
  {%- endfor -%}
];
