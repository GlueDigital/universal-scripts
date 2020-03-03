import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * Generates HTML for a given Helmet head, body, and extra head components.
 */
export default (head, renderOutput, scripts, styles) => {
  return '<!DOCTYPE html>' + renderToStaticMarkup(
    <html {...head.htmlAttributes.toComponent()}>
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.base.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        {head.style.toComponent()}
        {styles}
      </head>
      <body>
        <div
          key="root" id="root"
          dangerouslySetInnerHTML={{ __html: renderOutput }}
        />
        {scripts}
      </body>
    </html>
  )
}
