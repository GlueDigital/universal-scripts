import ReactDOM from 'react-dom'

const clientRender = async (ctx) => {
  const rootNode = document.getElementById('root')
  const children = await ctx.triggerHook('reactRoot')(ctx, false)
  if (__SSR__) {
    ReactDOM.hydrate(children, rootNode)
  } else {
    ReactDOM.render(children, rootNode)
  }
}

export const clientInit = clientRender
