<template lang="pug">
no-ssr
  .container.mt-5

</template>

<script>
import Feed from '@/components/post/Feed'
import CreatePostButton from '@/components/post/CreatePostButton'
import MapalaMap from '@/components/MapalaMap'


export default {
  async fetch({ store }) {
    store.dispatch('posts/set_author', undefined)

    if (process.server) {
      await store.dispatch('posts/fetch_posts')
    }
  },

  components: {
    Feed,
    CreatePostButton,
    MapalaMap
  },
}
</script>
