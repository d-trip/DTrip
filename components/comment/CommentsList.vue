<template lang="pug">
  div
    //div.show_more_comments_button(v-if="hasPostMoreComments", @click="fetchAllComments()")
      | {{ $t('show_comments') }}
    no-ssr
      reply(:parentAuthor="post.author"
            :parentPermlink="post.permlink"
            :root="true"
            @newComment="new_comment"
            ).mt-3

    comment-item(v-for="comment of comments"
                  :comment="comment"
                  :key="comment.id"
                  @reply="reply"
                  @newComment="new_comment")

</template>

<script>
import Reply from '~/components/comment/Reply.vue'
import CommentItem from '~/components/comment/CommentItem.vue'
import steem from 'steem'

export default {
  props: ['post'],

  data() {
    return {
      comments: []
    }
  },

  async created() {
    this.comments = await steem.api.getContentRepliesAsync(this.post.author, this.post.permlink)
  },

  methods: {
    reply (comment) {
      this.$emit('reply', comment)
    },

    new_comment(comment) {
      comment.created = new Date().toISOString()
      this.comments.push(comment)
    },
  },

  components: {
    CommentItem,
    Reply
  }
}
</script>

<style lang="stylus" scoped>
  .show_more_comments_button
    display: block
    width: 100%
    text-decoration: none
    text-align: center
    font: 700 14px/40px 'PT Sans'
    letter-spacing: -0.3px
    color: #5d7394
    border-radius: 6px
    background-color: #e3e8ef
    margin-bottom: 20px
    cursor: pointer
    user-select: none
</style>
