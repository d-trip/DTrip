import marked from 'marked'
import slug from 'slug'
import Raven from 'raven-js'

import steem from 'steem'
import config from '~/config'
import { comment, createUniqPermlink } from '~/utils/steem'


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
      coordinates: []
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
    let url = `https://steem.mapala.net/@${rootState.auth.account.name}/${permlink}`
    let body = state[state.format]

    if (!body.includes('https://steem.mapala.net/from-mapala.png')) {
      if (state.format == 'markdown') {
        body += `
          \n\n[![From Mapala](https://steem.mapala.net/from-mapala.png)](${url})
        `
      } else {
        body += `
          \n\n
          <a href="${url}">
            <img src="https://steem.mapala.net/from-mapala.png" alt="From Mapala">
          </a>
        `
      }
    }

    // TODO https://github.com/steemit/hivemind/blob/master/docs/communities.md
    // TODO https://github.com/steemit/condenser/pull/2995
    try {
      let res = await comment(
        rootState.auth.wif,
        '',
        config.tag_for_post,
        rootState.auth.account.name,
        permlink,
        state.title,
        body,
        {tags: state.tags,
         location: state.location,
         format: state.format}
      )
        
      commit('clear')
      return res
    } catch (e) {
      Raven.captureMessage(e)
      console.log(e)
      throw e.message
    }
  }
}
