import marked from 'marked'
import slug from 'slug'
import Raven from 'raven-js'

import steem from 'steem'
import config from '~/config'
import { prepare_json_metadata, createUniqPermlink } from '~/utils/steem'


export const state = () => ({
  // TODO тип выплат
  // TODO Переработать баннер

  format: 'markdown',
  markdown: '',
  html: '',
  title: '',
  permlink: null,
  body: '',
  tags: [config.tag_for_post],
  location: {
    properties: {
      name: '',
    },
    geometry: {
      type: 'Point',
      coordinates: ['', '']
    },
  }
})

export const mutations = {
  set_title: (state, title) => state.title = title,
  set_tag: (state, tag) => state.tags.push(tag),
  set_format: (state, format) => state.format = format,

  update_body (state) {
    state.body = state[state.format]
  },

  clear(state) {
    state.title = ''
    state.body = ''
    state[state.format] = ''
    state.tags = [config.tag_for_post]
    state.permlink = null

    // GeoJOSON standart
    state.location = {
      properties: {
        name: '',
      },
      geometry: {
        type: 'Point',
        coordinates: ['', '']
      },
    }
  },
}

export const actions = {
  toggle({ state, commit }) {
    commit('set_format', state.format == 'markdown' ? 'html' : 'markdown')
    commit('update_body')
  },

  async submit({ state, commit, dispatch, rootState }) {
    if (!rootState.auth.wif && !rootState.auth.account.name) {
      throw new Error('Добавьте постинг ключ или имя пользователя')
    }

    let permlink = state.permlink || await createUniqPermlink(rootState.auth.account.name, state.title)
    let url = `https://golos.mapala.net/@${rootState.auth.account.name}/${permlink}`
    let body = state[state.format]

    if (!body.includes('https://golos.mapala.net/from-mapala.png')) {
      if (state.format == 'markdown') {
        body += `
          \n\n[![From Mapala](https://golos.mapala.net/from-mapala.png)](${url})
        `
      } else {
        body += `
          \n\n
          <a href="${url}">
            <img src="https://golos.mapala.net/from-mapala.png" alt="From Mapala">
          </a>
        `
      }
    }

    return new Promise((resolve, reject) => {
      golos.broadcast.comment(
        rootState.auth.wif,
        '',
        config.tag_for_post,
        rootState.auth.account.name,
        permlink,
        state.title,
        body,
        prepare_json_metadata({
          tags: state.tags,
          location: state.location,
          format: state.format
        }), (err, res) => {
          if (err) {
            Raven.captureMessage(err)
            console.log(err)
            reject(err.message)
          } else {
            commit('clear')
            resolve(res)
          }
        }
      )
    })
  }
}
