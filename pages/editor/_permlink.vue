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
import { mapState, mapActions, mapMutations } from 'vuex'

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
      // Если это редактирование поста
      let client = app.apolloProvider.defaultClient

      let {data: {post}} = await client.query({query: MINIMAL_POST_QUERY, variables: {
        identifier: `@${store.state.auth.account.name}/${permlink}`,
        authorized: !!store.state.auth.wif
      }})

      editor.format = post.meta.format || 'html'
      store.commit('editor/clear')

      editor.permlink = permlink

      editor.title = post.title
      editor[editor.format] = post.body
      editor.tags = [...new Set([editor.tags[0], ...post.meta.tags])]

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
