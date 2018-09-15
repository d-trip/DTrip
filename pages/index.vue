<template lang="pug">
.row
  .col-md-4
    no-ssr
      create-post-button(v-if="this.$store.getters['auth/isAuth']")

    //el-button-group.mb-3
      el-button(type='primary', icon='el-icon-arrow-left') Previous Page
      el-button(type='primary') Next Page
      i.el-icon-arrow-right.el-icon-right

    //.sort.mb-3
      .button-text Сортировать по
      //.sort-tab Дате создания
      el-radio-group(v-model='radio4', size='medium')
        el-radio-button(label='New York')
        el-radio-button(label='Washington')


    feed
  .col.right-fixed-container(v-if="$device.isDesktop")
    no-ssr
      mapala-map#map
</template>

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

.sort-tab {
}
</style>

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
