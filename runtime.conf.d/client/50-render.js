import ReactDOM from 'react-dom'

const clientRender = async (ctx) => {
  const rootNode = document.getElementById('root')
  const children = await ctx.triggerHook('reactRoot')(ctx, false)
  ReactDOM.hydrate(children, rootNode)
}

export const clientInit = clientRender
