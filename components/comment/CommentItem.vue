<template lang="pug">
  div.comment.mt-2
    nuxt-link(:to="{name: 'account', params: {account: comment.author}}").user_av
      //img(v-if="comment.author.meta.profile.profileImage" :src="comment.author.meta.profile.profileImage | steem_proxy('64x64')")

    div.comment_body
      div.name_bl
        nuxt-link.user_page(:to="{name: 'account', params: {account: comment.author}}")
          | {{ comment.author }}

        span.pr(v-show="comment.parentAuthor")
          | Ответил {{ comment.parentAuthor }}

        div.date
          | {{ comment.created | formatDate }}

      div(v-html="mdBody")

      div
        span(@click="reply_toggle").mt-2.reply Ответить
        no-ssr
          reply(v-if="show_reply"
                :parentAuthor="comment.author.name"
                :parentPermlink="comment.permlink"
                @newComment="newComment"
                ).mt-2

      comment-item(v-for="child in childComments"
                   :comment="child"
                   :comments="comments"
                   :key="comment.id"
                   @newComment="newComment")
</template>

<script>
import { mapState } from 'vuex'
import Reply from '~/components/comment/Reply.vue'
import marked from 'marked'


export default {
  name: 'comment-item',
  props: ['comment', 'comments'],

  components: {
    Reply
  },

  data () {
    return {
      show_reply: false
    }
  },

  computed: {
    mdBody() {
      return marked(this.comment.body)
    },

    childComments() {
      return this.comments.filter(c => {
        return c.parentPermlink == this.comment.permlink && c.parentAuthor == this.comment.author.name
      })
    }
  },

  methods: {
    reply (comment) {
      this.$emit('reply', comment)
    },

    reply_toggle () {
      this.show_reply = !this.show_reply
    },

    newComment(comment) {
      this.reply_toggle()
      this.$emit('newComment', comment)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .comments_block .comment{
    display: flex;
    flex-wrap: wrap;
  }

  .comments_block .comment .user_av{
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    display: inline-block;
    margin-right: 15px;
  }

  .comments_block .comment .user_av img{
    display: block;
    width: 100%;
  }

  .comments_block .comment .comment_body{
    width: calc(100% - 55px);
    font: 16px 'PT Sans';
    letter-spacing: -1px;
    color: #20262d;
    margin-bottom: 1px;
    word-break: break-word;
  }


  .comments_block .comment .comment_body iframe {
    max-width: 80%;
  }

  .comments_block .comment .comment_body img {
    max-width:100%;
  }

  .comments_block .comment .user_page{
    text-decoration: none;
    color: #6d9ee1;
    font-weight: 700;
    margin-right: 3px;
  }

  .comments_block .comment .pr{
    font: 16px 'PT Sans';
    letter-spacing: -0.5px;
    color: #a2a2a2;
    cursor: pointer;
  }

  .comments_block .comment .reply{
    font: 700 14px 'PT Sans';
    letter-spacing: -0.4px;
    color: #5d7394;
    cursor: pointer;
  }
</style>
