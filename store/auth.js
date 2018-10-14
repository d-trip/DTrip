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

  async setLocation({ commit, state }, place) {
    // TODO Вынести в функцию getGeoJSON
    // TODO Вынести в функцию для мержа стейта аккаунта
    // FIXME refactor for steemconnect
    // Подумать как грамотно обновлять стейт
    let location = {
      properties: {
        name: place.formatted_address
      },

      geometry: {
        type: 'Point',

        coordinates: [
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ]
      }
    }

    let jsonMetadata = {
      ...state.account.jsonMetadata,
      ...{
        dtripProfile: {
          location: location
        }
      }
    }

    let r = await golos.broadcast.accountMetadata(
      state.wif,
      state.account.name,
      jsonMetadata,
      function(err, result) {
        state.account.meta = camelizeObject(
          {...state.account.meta, ...JSON.parse(result.operations[0][1].json_metadata)},
          {deep: true}
      )
    })

    //navigator.geolocation.getCurrentPosition((location) => {
    //  console.log(location.coords.latitude)
    //  console.log(location.coords.longitude)
    //  console.log(location.coords.accuracy)
    //})
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
