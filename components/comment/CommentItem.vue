<template lang="pug">
  .comment.mt-3
    nuxt-link(:to="{name: 'account', params: {account: comment.author}}").avatar-inside
      img(:src="comment.author | avatar('medium')")

    div.comment_body
      div.name_bl
        nuxt-link.user_page(:to="{name: 'account', params: {account: comment.author}}")
          | {{ comment.author }}

        span.pr(v-show="comment.parentAuthor")
          | Ответил {{ comment.parentAuthor }}

        div.date
          | {{ comment.created | formatDate }}

      div(v-html="mdBody")

      no-ssr
        span(v-if="$store.getters['auth/user']" @click="reply_toggle").mt-2.reply Reply
      no-ssr
        reply(v-if="show_reply"
              :parentAuthor="comment.author"
              :parentPermlink="comment.permlink"
              @newComment="newComment"
              @cancel="show_reply = false"
              ).mt-2

      comment-item(v-for="child in comments"
                   :comment="child"
                   :key="child.id"
                   @newComment="newComment")
</template>

<script>
import { mapState } from 'vuex'
import Reply from '~/components/comment/Reply.vue'
import marked from 'marked'
import { preparePost } from '~/utils/'
import steem from 'steem'


export default {
  name: 'comment-item',
  props: ['comment'],

  components: {
    Reply
  },

  data () {
    return {
      comments: [],
      show_reply: false
    }
  },

  async created() {
    this.comments = await steem.api.getContentRepliesAsync(this.comment.author, this.comment.permlink)
  },

  computed: {
    mdBody() {
      return preparePost(this.comment).content
    },
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
      comment.created = new Date().toISOString()
      this.comments.push(comment)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .comments_block .comment{
    display: flex;
    flex-wrap: wrap;
  }

  .comments_block .comment .comment_body {
    width: calc(100% - 55px);
  }

  .comments_block .comment .comment_body iframe {
    max-width: 80%;
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
