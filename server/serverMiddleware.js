import compose from 'koa-compose'
import config from '#js.conf.d'

export default compose(config.serverMiddleware)
