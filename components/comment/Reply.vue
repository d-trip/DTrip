<template lang="pug">
  div(v-if="user" v-loading="loading")
    .row
      .col
        el-input(type="textarea", placeholder='Please input' v-model='body')

    .row.mt-2
      .col
        el-button(type="primary" @click="addComment" size="small") Send
        el-button(@click="$emit('cancel')" size="small" v-if="!root") Cancel
</template>

<script>
import steem from 'steem'

import { mapGetters } from 'vuex'
import { comment } from '~/utils/steem'

export default {
  props: ['parentAuthor', 'parentPermlink', 'root'],

  data () {
    return {
      body: '',

      loading: false
    }
  },

  computed: {
    ...mapGetters('auth', ['user'])
  },

  methods: {
    async addComment () {
      if (!this.body) return this.$message.warning('Comment body is empty')

      this.loading = true

      try {
        let r = await comment(
          this.parentAuthor,
          this.parentPermlink,
          this.user.name,
          steem.formatter.commentPermlink(this.parentAuthor, this.parentPermlink),
          '',
          this.body,
          {}
        )

        this.$emit('newComment', r.operations[0][1])
        this.$emit('cancel')
        this.$notify.success('Comment created!')
        this.body = ''
      } catch(e) {
        this.$notify.error(e.error_description)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
