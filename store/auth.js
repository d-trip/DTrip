import steem from 'steem'
import { get_account } from '~/utils/steem.js'
//import camelizeObject from 'camelcase-keys'


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
  }
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
      console.log(state.account.meta)
    })

    //navigator.geolocation.getCurrentPosition((location) => {
    //  console.log(location.coords.latitude)
    //  console.log(location.coords.longitude)
    //  console.log(location.coords.accuracy)
    //})
  },

  async authorization ({ app, rootState, commit, state, dispatch }, { wif, account }) {
    if (!golos.auth.isWif(wif)) {
      throw new Error('Это не приватный ключ')
    }

    account = await get_account(account)

    if (!account) {
      throw new Error('В GOLOS.IO нет такого пользователя')
    }

    let user_pub = golos.auth.wifToPublic(wif)
    let account_pub = account.posting.key_auths[0][0]
    
    if (user_pub !== account_pub) {
      throw new Error('Ключ пользователя, не подходит к аккаунту')
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

  async fetch_account ({ commit, state }, account_name) {
    // TODO Подгрузка инфы о пользователе
    let client = this.app.apolloProvider.defaultClient

    let { data: { account } } = await client.query({query: ACCOUNT_QUERY, variables: {
      name: account_name || state.account.name
    }})

    // TODO Создать mapalaProfile по дефолту если его нет

    commit('set_account', JSON.parse(JSON.stringify(account)))
  }
}

export const getters = {
  isAuth: state => state.wif && state.account.name
}
