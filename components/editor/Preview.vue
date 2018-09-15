<template lang="pug">
div
  h1 {{ editor.title }}

  post-content(:body="editor.body", :format="editor.format")
</template>

<script>
import PostContent from '~/components/post/PostContent.vue'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    PostContent
  },

  computed: {
    ...mapState({
      editor: state => state.editor,
    })
  },
}


</script>
