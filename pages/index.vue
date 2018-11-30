<template lang="pug">
.row
  .col-md-4
    no-ssr
      div
        create-post-button(v-if="this.$store.getters['auth/user']")

        search(v-if="$route.name == 'index-accounts' || by =='search'"
               placeholder="Where you going?" prefix-icon="el-icon-search" @enter="setSearch")

        .d-flex.tabs.mt-2
          nuxt-link(tag="button" :to="{name: 'index'}").el-radio-button__inner posts
          nuxt-link(tag="button" :to="{name: 'index-accounts'}").el-radio-button__inner users

        .mt-2(v-if="$route.name == 'index'")
          el-radio-group(v-model='by' size="mini" @change="changeBy" )
            el-radio-button(label="created")
            el-radio-button(label="trending")
            el-radio-button(label="hot")
            el-radio-button(label="search")
          feed(:infiniteId="infiniteId")

        nuxt-child(v-else :search="search")


  .col.right-fixed-container(v-if="$device.isDesktop")
    no-ssr
      trip-map#map
</template>

<script>
import Feed from '~/components/post/Feed'
import CreatePostButton from '~/components/post/CreatePostButton'
import Search from '~/components/elements/Search'
import TripMap from '~/components/TripMap'
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
    TripMap,
    Search
  },

  methods: {
    ...mapMutations('posts', ['set_search']),

    setSearch(search) {
      this.search = search
      this.infiniteReset()
    },

    infiniteReset() {
      this.$store.commit('posts/clear')
      this.infiniteId += 1
    },

    changeBy(by) {
      if (by == 'search') {
				this.$store.commit('posts/set_posts', [])
			} else {
        this.search = ''
				this.infiniteReset()
			}

      this.$store.dispatch('posts/set_by', this.by)
    }
  },
}

</script>

<style>
.tabs button {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none!important;
  box-shadow: none!important;
}

.tabs button:first-child {
  border-right: 0px;
  border-left: 1px solid #dcdfe6;
}

.tabs button:last-child {
  border-radius: 0 4px 4px 0;
}

.tabs .active.nuxt-link-exact-active {
  color: #fff;
  background-color: #409EFF;
  border-color: #409EFF;
  -webkit-box-shadow: -1px 0 0 0 #409EFF;
  box-shadow: -1px 0 0 0 #409EFF;
}

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
