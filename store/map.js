import axios from 'axios'
import { POST_MARKERS_QUERY } from '~/constants/queries.js'


export const state = () => ({
  markers: []
})

export const actions = {
  async fetch_markers({ commit, dispatch, state, rootState }, bbox) {
    let client = this.app.apolloProvider.defaultClient

    let { data: { geoObjects } } = await client.query({query: POST_MARKERS_QUERY, variables: {
      bbox: bbox,
    }})

    let all_markers = [...geoObjects, ...state.markers].filter((elem, index, self) => self.findIndex(
    (t) => {return (t.permlink === elem.permlink)}) === index)

    commit('set_markers', all_markers)
  },
}

export const mutations = {
  set_markers: (state, markers) => {
    state.markers = markers
  }
}
