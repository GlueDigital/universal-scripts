/**
 * Generates HTML for a given Helmet head, body, and extra head components.
 */
export default (head, styles) => (
  '<!DOCTYPE html>' +
  '<html ' + head.htmlAttributes.toString() + '>' +
  '<head>' +
  head.title.toString() +
  head.meta.toString() +
  head.base.toString() +
  head.link.toString() +
  head.script.toString() +
  head.style.toString() +
  (styles ? styles.join('') : '') +
  '</head>' +
  '<body>' +
  '<div id="root">'
)
