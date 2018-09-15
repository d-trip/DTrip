// FIXME Не использутеся
export default function () {
  this.nuxt.hook('generate:extendRoutes', async routes => {
    const whiteList = ['/index', '/feed', 'map']
    const routesToGenerate = routes.filter(page => whiteList.includes(page.route))
    routes.splice(0, routes.length, ...routesToGenerate)
  })
}
