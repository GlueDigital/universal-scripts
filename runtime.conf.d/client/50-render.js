import ReactDOM from 'react-dom/client'

const clientRender = async (ctx) => {
  const rootNode = document.getElementById('root')
  const children = await ctx.triggerHook('reactRoot')(ctx, false)
  if (__SSR__) {
    ReactDOM.hydrateRoot(rootNode, children)
  } else {
    const root = ReactDOM.createRoot(rootNode)
    root.render(children)
  }
}

export const clientInit = clientRender
