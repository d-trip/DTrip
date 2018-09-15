export const strict = false


export const state = () => ({
  showTop: true
})

export const actions = {
  showTopToggle({ commit, state }) {
    commit('showTop', !state.showTop)
  }
}

export const mutations = {
  showTop: (state, showTop) => {
    state.showTop = showTop
  }
}
