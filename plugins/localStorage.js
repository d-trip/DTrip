import config from '~/config'
import createPersistedState from 'vuex-persistedstate'

const VERSION = config.app

export default ({store}) => {
  if (localStorage.getItem(VERSION) == null) localStorage.clear()

  let paths = ['editor', 'showWelcome']

  // Do not use localStorage for SPA/IPFS version
  if (!process.env.isSPA) {
    paths.push('auth')
  }

  createPersistedState({
      key: VERSION,
      paths
  })(store)
}
