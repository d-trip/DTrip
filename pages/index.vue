<template lang="pug">
.row
  .col-md-4
    no-ssr
      create-post-button(v-if="this.$store.getters['auth/user']")

    no-ssr
      el-input(placeholder="Type something"
               prefix-icon="el-icon-search"
               v-model="search"
               v-show="by == 'search'"
               @keyup.enter.native="infiniteReset"
               ).mb-2

    no-ssr
      el-radio-group(v-model='by' size="small" @change="changeBy")
        el-radio-button(label="created")
        el-radio-button(label="trending")
        el-radio-button(label="hot")
        el-radio-button(label="search")

    feed(:infiniteId="infiniteId")
  .col.right-fixed-container(v-if="$device.isDesktop")
    no-ssr
      trip-map#map
</template>

<script>
import Feed from '@/components/post/Feed'
import CreatePostButton from '@/components/post/CreatePostButton'
import TripMap from '@/components/TripMap'
import { mapMutations } from 'vuex'


export default {
  data() {
    return {
      search: '',

      by: 'created',
      infiniteId: +new Date(),
    }
  },

  watch: {
    search(s) {
      this.set_search(s)
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
    ...mapMutations('posts', ['set_search']),

    infiniteReset() {
      this.$store.dispatch('posts/set_by', this.by)
      this.infiniteId += 1
    },

    changeBy(by) {
      if (by == 'search') {
				this.$store.commit('posts/set_posts', [])
			} else {
				this.infiniteReset()
			}
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
