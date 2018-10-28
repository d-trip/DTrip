import axios from 'axios'
import config from '~/config'
import { Client } from 'dsteem'
import { preparePost } from '~/utils/'

var client = new Client('https://api.steemit.com')


export const state = () => ({
  list: [],
  author: '',

  last: {
    start_author: undefined,
    start_permlink: undefined
  },

  // DiscussionsBy
  by: 'created'
})


export const actions = {
  async fetch_posts({ rootState, state, commit, dispatch }) {
    let posts

    if (state.by == 'blog') {
      posts = await client.database.getDiscussions(state.by, {tag: state.author, limit: config.limit,  ...state.last})
    } else {
      posts = await client.database.getDiscussions(state.by, {tag: config.tag_for_post, limit: config.limit, ...state.last})
    }

    posts = posts.map(p => preparePost(p))

    // It it is first iteration
    if (state.last.start_permlink) posts.shift()
    if (posts.length > 0) commit('set_after', posts[posts.length - 1])

    if (state.by == 'blog' && posts.length > 0) {
      posts = posts.filter(p => p.meta.tags && p.meta.tags.includes(config.tag_for_post))

      // Search posts recursive
      if (posts.length == 0) return await dispatch('fetch_posts')
    }

    commit('set_posts', [...new Set([...state.list, ...posts])])
  },

  set_author({ state, commit }, author) {
    if (author !== state.author) commit('clear')
    commit('set_author', author)
  },

  set_by({ commit }, by) {
    commit('clear')
    commit('set_by', by)
  }
}

export const mutations = {
  set_type: (state, type) => state.type = type,
  set_posts: (state, posts) => state.list = posts,
  set_author: (state, author) => state.author = author,
  set_by: (state, by) => state.by = by,

  set_after: (state, {author, permlink}) => {
    state.last.start_author = author,
    state.last.start_permlink = permlink
  },

  clear: (state) => {
    state.list = []
    state.last.start_author = undefined
    state.last.start_permlink = undefined
  },
}


export const getters = {
  by: state => state.by,
}
