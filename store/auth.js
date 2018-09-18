import steem from 'steem'
import { getAccount } from '~/utils/steem'


export const state = () => ({
  account: {
    name: '',
    meta: {
      'profile': {}
    },
  },

  // TODO сделать пароль для разблокировки
  wif: false,
  isAuth: false
})

export const mutations = {
  set_wif: (state, wif) => state.wif = wif,

  set_account: (state, account) => {
    state.account = account
  },
}

export const actions = {
  init({ commit, state, dispatch }) {

    if (state.wif && state.account.name) {
      state.isAuth = true
      dispatch('fetch_account')
    }
  },

  async setLocation({ commit, state }, place) {
    // TODO Вынести в функцию getGeoJSON
    // TODO Вынести в функцию для мержа стейта аккаунта
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
        mapalaProfile: {
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

  async authorization ({ app, rootState, commit, state, dispatch }, { wif, account }) {
    if (!steem.auth.isWif(wif)) {
      throw new Error('This is not a WIF key')
    }

    account = await getAccount(account)

    if (!account) {
      throw new Error('Account not found')
    }

    let user_pub = steem.auth.wifToPublic(wif)
    let account_pub = account.posting.key_auths[0][0]
    
    if (user_pub !== account_pub) {
      throw new Error('This WIF is not for that account')
    }

    commit('set_wif', wif)
    dispatch('fetch_account', account.name)
  },

  async logout ({ commit }) {
    commit('set_wif', false)
    commit('set_account', {
      name: '',
      meta: {
        'profile': {}
      },
    })
  },

  async fetch_account ({ commit, dispatch, state }, account_name) {
    let account = await getAccount(account_name || state.account.name)

    if (!account) {
      dispatch('logout')
    }

    commit('set_account', account)
  }
}

export const getters = {
  isAuth: state => state.wif && state.account.name
}
