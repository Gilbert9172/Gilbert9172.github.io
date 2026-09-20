#!/usr/bin/env ruby
# Run with: bundle exec ruby tools/test-reading-text.rb
require 'jekyll'
require 'tmpdir'
require 'fileutils'
require_relative '../_plugins/reading-text'

def assert(condition, message)
  raise message unless condition
end

Dir.mktmpdir('reading-text-test-') do |root|
  FileUtils.mkdir_p(File.join(root, 'assets/embeds'))
  File.write(File.join(root, 'assets/embeds/demo.html'), '<html><head><title>HiddenTitle</title><style>HiddenStyle</style></head><body><p>FIN_WAIT_1 &amp; CLOSE_WAIT</p><script>HiddenScript</script></body></html>')
  File.write(File.join(root, 'secret.html'), 'PRIVATE_SENTINEL')
  File.symlink(File.join(root, 'secret.html'), File.join(root, 'assets/embeds/link.html'))
  site = Struct.new(:source, :config).new(root, { 'baseurl' => '' })
  render = ->(source) { Liquid::Template.parse('{{ text | reading_text }}').render!({ 'text' => source }, registers: { site: site }) }
  value = render.call('<p>Introduction</p><iframe src="/assets/embeds/demo.html"></iframe>')
  assert(value.include?('Introduction') && value.include?('FIN_WAIT_1 & CLOSE_WAIT'), 'Local artifact text missing')
  assert(!value.match?(/HiddenTitle|HiddenStyle|HiddenScript/), 'Non-reading content was indexed')
  ['https://example.com/assets/embeds/demo.html', '//example.com/assets/embeds/demo.html', '/assets/embeds/../../secret.html', '/assets/embeds/%2e%2e/%2e%2e/secret.html', '/assets/embeds/link.html', '/assets/embeds/missing.html'].each do |src|
    assert(render.call("<iframe src='#{src}'></iframe>") == '', "Unsafe or missing source accepted: #{src}")
  end
  site.config['baseurl'] = '/blog'
  assert(render.call('<iframe src="/blog/assets/embeds/demo.html"></iframe>').include?('FIN_WAIT_1'), 'baseurl unsupported')
  assert(render.call('<p>&lt;T&gt; is text</p>') == '<T> is text', 'Code text was lost')
  assert(render.call('<style>hidden</style><script>hidden</script><p>Readable</p>') == 'Readable', 'Script/style leakage')
  assert(render.call('<iframe src="/blog/assets/embeds/demo.html"></iframe><iframe src="/blog/assets/embeds/demo.html"></iframe>').scan('FIN_WAIT_1').length == 1, 'Duplicate artifact counted twice')
end
puts 'PASS: local artifact indexing, no scripts/styles, baseurl, code entities, duplicate embeds, external/path traversal/symlink/missing-file rejection.'
