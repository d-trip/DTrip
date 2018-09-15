<template lang="pug">
// FIXME При возвращении на ленту, не сохраняется место скрола
// TODO В ленту подгружать не полные посты полный пост только в модалке или странице
// Скорее всего решится proxy в 1.6 vue
div
  post-item(v-for="post in posts", :post="post", :key="post.id")

  no-ssr
    infinite-loading(@infinite="handleLoading", :distance="200", force-use-infinite-wrapper="true")
      p(slot="no-more") Больше нет постов :(
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PostItem from '@/components/post/PostItem'


export default {
  computed: {
    ...mapState({
      posts: state => state.posts.list
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
