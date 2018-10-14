import config from '~/config'
import steem from 'steem'
import { POSTS_QUERY } from '~/constants/queries.js'
import { getContent } from '~/utils/steem'


export const state = () => ({
  list: [],
  author: undefined,

  after: undefined,
  type: 'all'
})

export const actions = {
  update_type ({ state, commit }, type = 'all') {
    commit('set_posts', [])
    commit('set_type', type)
  },

  async fetch_posts({ rootState, state, commit }) {
    let client = this.app.apolloProvider.defaultClient

    let { data } = await client.query({query: POSTS_QUERY, variables: {
      first: config.pagination,
      author: state.author,
      after: state.after,
      type: state.type == 'all' ? undefined : state.type
    }})

    // Load from node untill GraphqQL ready
    let posts = await Promise.all(
      data.posts.edges.map(p => getContent(p.node.author, p.node.permlink))
    )

    commit('set_posts', [...state.list, ...posts])

    if (posts.length > 0) {
      commit('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
    }
  },

  set_author({ state, commit }, author) {
    if (author !== state.author) commit('clear')
    commit('set_author', author)
  }
}

export const mutations = {
  set_type: (state, type) => state.type = type,
  set_posts: (state, posts) => state.list = posts,
  set_after: (state, after) => state.after = after,
  set_author: (state, author) => state.author = author,

  clear: (state) => {
    state.list = []
    state.after = undefined
    state.author = undefined
  },
}
