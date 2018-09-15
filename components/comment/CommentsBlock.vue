<template lang="pug">
  div.comments_block
    comments-list(:post="post", @reply="reply")
    //write-comment-block(:post="post", :replied-comment="repliedComment")

</template>

<script>
import CommentsList from '~/components/comment/CommentsList.vue'
//import WriteCommentBlock from './__parts__/block-write-comment'

export default {
  props: ['post'],

  data () {
    return {
      repliedComment: ''
    }
  },

  components: {
    //WriteCommentBlock,
    CommentsList
  },

  methods: {
    reply (comment) {
      this.repliedComment = comment
    }
  }
}
</script>

<style lang="stylus">
  .comments_block
    background-color: #fafafa
    padding: 20px 15px 26px

  .comments_block .rep_comments
    border-left: solid 2px #e3e8ef
    box-sizing: border-box
    margin: 13px 0 0 66px
    padding: 7px 0 0 10px

  .comments_block .rep_comments .comment:last-of-type
    margin-bottom: 0

  .comments_block .rep_comments .user_av
    width: 26px
    height: 26px

  .comments_block p
    margin-top: 0
    margin-bottom: 0
</style>
