<template lang="pug">
.row
  .col-md-4
    no-ssr
      create-post-button(v-if="this.$store.getters['auth/user']")

    no-ssr
      el-radio-group(v-model='by' size="small" @change="changeBy")
        el-radio-button(label="created")
        el-radio-button(label="trending")
        el-radio-button(label="hot")

    feed(:infiniteId="infiniteId")
  .col.right-fixed-container(v-if="$device.isDesktop")
    no-ssr
      trip-map#map
</template>

<script>
import Feed from '@/components/post/Feed'
import CreatePostButton from '@/components/post/CreatePostButton'
import TripMap from '@/components/TripMap'


export default {
  data() {
    return {
      by: 'created',
      infiniteId: +new Date()
    }
  },

  async fetch({ store }) {
    store.dispatch('posts/set_by', 'created')
    store.commit('posts/set_author', undefined)

    if (process.server) {
      await store.dispatch('posts/fetch_posts')
    }
  },

  components: {
    Feed,
    CreatePostButton,
    TripMap
  },

  methods: {
    changeBy(by) {
      this.$store.dispatch('posts/set_by', by)
      this.infiniteId += 1
    }
  },
}

</script>

<style>
.sort {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
  border: solid 1px rgba(72, 84, 101, 0.2);
}

.el-radio-group {
  display: flex;
}

.el-radio-button, .el-radio-button__inner {
  width: 100%;
}
</style>
