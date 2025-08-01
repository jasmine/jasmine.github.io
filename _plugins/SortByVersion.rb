module Jekyll
  module SortByVersion
    def sort_by_version(pages)
        pages.sort { |a, b|
            a = version(a)
            b = version(b)

            if a == 'edge' && b == 'edge'
                0
            elsif a == 'edge'
                1
            elsif b == 'edge'
                -1
            else
                Gem::Version.new(a) <=> Gem::Version.new(b)
            end
        }
    end

    private

    def version(page)
        page.url
            .sub(/^\/api\/npm\//, '')
            .sub(/^\/api\/browser-runner\//, '')
            .sub(/^\/api\//, '')
            .split('/')[0]
    end
  end
end

Liquid::Template.register_filter(Jekyll::SortByVersion)