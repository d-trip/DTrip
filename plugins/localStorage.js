import createPersistedState from 'vuex-persistedstate'

const VERSION = 'mapala_0.001'

export default ({store}) => {
  if (localStorage.getItem(VERSION) == null) localStorage.clear()

  createPersistedState({
      key: VERSION,
      paths: ['auth', 'golos', 'editor']
  })(store)
}
