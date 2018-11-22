import axios from 'axios'
import steem from 'steem'

import Vue from 'vue'
import { getAccount } from '~/utils/steem'

export const state = () => ({
  user: null,
  access_token: null
})

export const mutations = {
  set_user: (state, user) => state.user = user,
  set_access_token: (state, access_token) => state.access_token = access_token
}

export const actions = {
  init({ commit, state, dispatch }) {
    if (state.access_token) {
      Vue.SteemConnect().setAccessToken(state.access_token)
      dispatch('fetch_user')
    }
  },

  logout({ commit }) {
    commit('set_user', null)
    commit('set_access_token', null)
  },

  async setLocation({ commit, state, dispatch }, place) {
    state.user.meta.profile.location = place.formatted_address
    window.open(`https://steemconnect.com/sign/profile-update?location=${place.formatted_address}`)
  },

  async fetch_user ({ commit, dispatch, state }) {
    let { name } = await Vue.SteemConnect().me()
    let user = await getAccount(name || state.user.name)

    if (!user) {
      commit('set_user', null)
    }

    commit('set_user', user)
  }
}

export const getters = {
  user (state) {
    return state.user
  },
}
