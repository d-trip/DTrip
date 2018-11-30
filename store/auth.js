import axios from 'axios'
import steem from 'steem'

import Vue from 'vue'
import { getAccount } from '~/utils/steem'


let profile_copy = {}

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

  async profileUpdate({ commit, state, dispatch }, place) {
    let for_update = {}

    for (let [k, v] of Object.entries(state.user.meta.profile)) {
      if (profile_copy[k] != v) {
        for_update[k] = v
      }
    }

    let url = Object.entries(for_update).map(([key, val]) => `${key}=${val}`).join('&')
    window.open(`https://steemconnect.com/sign/profile-update?${url}`)
    dispatch('fetch_user')
  },

  async fetch_user ({ commit, dispatch, state }) {
    let { name } = await Vue.SteemConnect().me()
    let user = await getAccount(name || state.user.name)

    if (!user) {
      commit('set_user', null)
    } else {
      profile_copy = Object.assign({}, user.meta.profile)
      commit('set_user', user)
    }
  }
}

export const getters = {
  user (state) {
    return state.user
  },
}
