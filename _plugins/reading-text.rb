# Plain reading/search text, including author-controlled local HTML artifacts.
# No network requests. Embedded files outside assets/embeds are never read.
require 'cgi'
require 'uri'

module ReadingText
  def reading_text(input)
    html = input.to_s
    site = @context.registers[:site]
    embedded = html.scan(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i).flatten.uniq.filter_map do |src|
      artifact_text(site, src)
    end
    ([plain_reading_text(html)] + embedded).join(' ').gsub(/\s+/, ' ').strip
  end

  private

  def plain_reading_text(html)
    text = html.gsub(/<!--.*?-->/m, ' ')
    text = text.gsub(/<(script|style|head)\b[^>]*>.*?<\/\1\s*>/im, ' ')
    text = text.gsub(/<[^>]*>/m, ' ')
    CGI.unescapeHTML(text).gsub(/\s+/, ' ').strip
  end

  def artifact_text(site, src)
    return unless site
    uri = URI.parse(CGI.unescapeHTML(src))
    return if uri.scheme || uri.host
    path = URI::DEFAULT_PARSER.unescape(uri.path.to_s)
    base = site.config['baseurl'].to_s.sub(%r{/$}, '')
    path = path.delete_prefix(base) unless base.empty?
    return unless path.start_with?('/assets/embeds/') && path.end_with?('.html')
    root = File.realpath(File.join(site.source, 'assets/embeds'))
    file = File.realpath(File.join(site.source, path.delete_prefix('/')))
    return unless file.start_with?(root + File::SEPARATOR) && File.file?(file)
    return if File.size(file) > 2 * 1024 * 1024
    plain_reading_text(File.read(file, encoding: 'UTF-8'))
  rescue URI::InvalidURIError, SystemCallError, ArgumentError
    nil
  end
end

Liquid::Template.register_filter(ReadingText)
