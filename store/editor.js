import marked from 'marked'
import Raven from 'raven-js'

import steem from 'steem'
import config from '~/config'
import { getContent, comment, createUniqPermlink } from '~/utils/steem'
import { POST_TYPES } from '~/constants'


export const state = () => ({
  // TODO тип выплат
  // TODO Переработать баннер

  title: '',
  permlink: null,
  body: '',
  tags: [],
  geohash: '',
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

  clear(state) {
    state.title = ''
    state.body = ''
    state.tags = []
    state.permlink = null
    state.geohash = ''

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
  async setPost({ rootState, state, commit, dispatch }) {
    commit('clear')

    let { permlink } = rootState.route.params

    if (permlink) {
      // IF it is editing post
      let post = await getContent(rootState.auth.user.name, permlink)

      // TODO Create mutatin for this
      state.permlink = permlink
      state.title = post.title
      state.body = post.body
      state.tags = post.meta.tags || []
      state.location = post.meta.location
    }
  },

  async submit({ state, commit, dispatch, rootState }) {
    if (!rootState.auth.user) {
      throw new Error('Pleace login!')
    }

    let tags = state.tags.includes(config.tag_for_post) ? state.tags : state.tags.concat([config.tag_for_post])

    let permlink = state.permlink || await createUniqPermlink(rootState.auth.user.name, state.title)
    let url = `${config.BASE_URL}@${rootState.auth.user.name}/${permlink}`
    let body = state.body

    if (!body.includes('div class="dtrip-banner"')) {
      body += `\n\n<div class="dtrip-banner">Published by <a href="${url}">DTrip</a> travel app.</div>`
    }

    // TODO https://github.com/steemit/hivemind/blob/master/docs/communities.md
    // TODO https://github.com/steemit/condenser/pull/2995
    try {
      let res = await comment(
        '',
        state.tags[0],
        rootState.auth.user.name,
        permlink,
        state.title,
        body,
        {tags: tags,
         geohash: state.geohash,
         location: state.location,
         format: 'markdown'}
      )
        
      commit('clear')
      return res
    } catch (e) {
      Raven.captureMessage(e)
      console.log(e)
      throw e.error_description
    }
  }
}
