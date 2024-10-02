import { ClientInit } from 'lib/redux/types'
import ReactDOM from 'react-dom/client'

let rendered

const clientRender: ClientInit = async (ctx) => {
  const rootNode = document.getElementById('root')
  const children = await ctx.triggerHook('reactRoot')(ctx, false)
  if (rendered) {
    rendered.render(children)
    return
  }
  if (__SSR__) {
    rendered = ReactDOM.hydrateRoot(rootNode, children)
  } else {
    const root = ReactDOM.createRoot(rootNode)
    root.render(children)
    rendered = root
  }
}

export const clientInit = clientRender
