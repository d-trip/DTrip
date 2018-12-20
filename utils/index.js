import Remarkable from 'remarkable'
import prepare_html from '@/utils/prepare_html'


const remarkable = new Remarkable({
    html: true, // remarkable renders first then sanitize runs...
    breaks: true,
    linkify: false, // linkify is done locally
    typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
    quotes: '“”‘’',
})

export function preparePost(post) {
  let prepare
  post.meta = jsonParseSafe(post.json_metadata)

  // Hide link to dtrip
  // FIXME Old standart, so delete this after a while
  let r = /\[PUBLISHED BY DTRIP.APP\]\(.*\)/
  post.body = post.body.replace(r, '')

  let text = post.body
  if (!text) text = ''; // text can be empty, still view the link meta data
  let html = false;
  const m = text.match(/^<html>([\S\s]*)<\/html>$/);
  if (m && m.length === 2) {
      html = true;
      text = m[1];
  } else {
      html = /^<p>[\S\s]*<\/p>/.test(text);
  }
  // Strip out HTML comments. "JS-DOS" bug.
  text = text.replace(
      /<!--([\s\S]+?)(-->|$)/g,
      '(html comment removed: $1)'
  );
  let renderedText = html ? text : remarkable.render(text);
  // If content isn't wrapped with an html element at this point, add it.
  if (!renderedText.indexOf('<html>') !== 0) {
      renderedText = '<html>' + renderedText + '</html>';
  }
  //renderedText = prepare_html(renderedText).html;
  let prepared = prepare_html(renderedText);

  post.content = prepared.html
  post.images = [...prepared.images]
  post.thumb = post.images[0]

  return post
}


export function jsonParseSafe(json) {
  try {
    json = JSON.parse(json)
  } catch(e) {
    json = {}
  }

  return json
}

export function slug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
