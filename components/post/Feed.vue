<template lang="pug">
div
  post-item(v-for="post in posts", :post="post", :key="post.id")

  no-ssr
    // FIXME When going to account page, triggers multiple times
    infinite-loading(:identifier="infiniteId" @infinite="handleLoading", :distance="200", force-use-infinite-wrapper="true")
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import PostItem from '@/components/post/PostItem'


export default {
  props: ['infiniteId'],

  data() { 
    return {
      showFilters: false,
    }
  },

  computed: {
    ...mapState({
      posts: state => state.posts.list,
    })
  },
  methods: {
    ...mapActions({
      fetch_posts: 'posts/fetch_posts'
    }),

    handleLoading($state) {
      const posts_count = this.posts.length

      this.fetch_posts().then(() => {
        if (posts_count == this.posts.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }).catch(e => {
        console.log('Request error', e)

        setTimeout(() => $state.loaded(), 1000)
      })
    }
  },

  components: {
    PostItem
  }
}

</script>
