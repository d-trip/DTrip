<template lang="pug">
.container.mt-4
  no-ssr
    editor
    //el-tabs(type="border-card")
      el-tab-pane(label="Markdown")
        editor

      el-tab-pane(label="Предпросмотр")
        preview

</template>

<script>
import { getContent } from '~/utils/steem'
import Editor from '~/components/editor/Editor.vue'
import Preview from '~/components/editor/Preview.vue'

export default {
  scrollTop: true,
  layout: 'full-width',

  components: {
    Editor,
    Preview
  },

  async fetch({ app, store, route, redirect }) {
    if(process.server) {
      return
    }

    let editor = store.state.editor
    let permlink = route.params.permlink

    if (permlink) {
      // IF it is editing post
      let post = await getContent(store.state.auth.user.name, permlink)

      editor.format = post.meta.format || 'html'
      store.commit('editor/clear')

      editor.permlink = permlink

      editor.title = post.title
      editor[editor.format] = post.body
      editor.tags = post.meta.tags
      editor.location = post.meta.location

      if (post.meta.geohash) editor.geohash = post.meta.geohash


      store.commit('editor/update_body')
    } else {
      // Создание нового поста
      store.commit('editor/clear')
      editor.permlink = null
    }
  },
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
