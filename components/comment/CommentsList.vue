<template lang="pug">
  div
    //div.show_more_comments_button(v-if="hasPostMoreComments", @click="fetchAllComments()")
      | {{ $t('show_comments') }}

    comment-item(v-for="comment of rootComments"
                  :comment="comment"
                  :comments="comments"
                  :key="comment.id"
                  @reply="reply"
                  @newComment="pushComment")

    no-ssr
      reply(:parentAuthor="post.author.name"
            :parentPermlink="post.permlink"
            @newComment="pushComment"
            ).mt-2

</template>

<script>
import Reply from '~/components/comment/Reply.vue'
import CommentItem from '~/components/comment/CommentItem.vue'

export default {
  props: ['post'],

  data() {
    return {
      comments: []
    }
  },

  created() {
    // HACK Для того что бы на лету подставлять новые комменты в список
    this.comments = JSON.parse(JSON.stringify(this.post.comments))
  },

  computed: {
    rootComments() {
      return this.comments.filter(c => c.parentPermlink == this.post.permlink)
    },
  },

  methods: {
    reply (comment) {
      this.$emit('reply', comment)
    },

    new_comment(comment) {
      console.log('newComment')
      
      this.pushComment(comment)
    },

    pushComment(comment) {
      // патчим под наш формат комментариев от golos-ql
      comment.created = new Date().toISOString()
      comment.parentPermlink = comment.parent_permlink
      comment.parentAuthor = comment.parent_author
      comment.author = {
        name: comment.author,
        meta: {
          profile: {
            profileImage: this.$store.state.auth.account.meta.profile.profileImage
          }
        }
      }

      this.comments.push(comment)
    }
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
