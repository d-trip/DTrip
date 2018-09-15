<template lang="pug">
.bottom-block
  a(v-if="$device.isDesktop" @click="open_modal").icon.comment {{ post.children }}
  nuxt-link(v-else :to="{name: 'post', params: {author: post.author, permlink: post.permlink}}").icon.comment {{ post.children }}

  a.icon.repost(@click="share()") Поделиться

  nuxt-link(v-if="$device.isDesktop && $route.name != 'post'"
            :to="{name: 'post', params: {author: post.author, permlink: post.permlink}}").icon.widthout-text
    i.fa.fa-eye

  upvote-button(:post="post")

  no-ssr
    textarea(ref="copy_clickboard").copy-clickboard

</template>

<script>
import config from '~/config'
import UpvoteButton from '~/components/post/UpvoteButton.vue'


export default {
  props: ['post'],

  components: {
    UpvoteButton,
  },

  methods: {
    open_modal() {
      this.$modal.show(PostModal, { author: this.post.author, permlink: this.post.permlink }, {
        height: 'auto',
        width: '60%',
        scrollable: true,
        classes: ['v--modal', 'post-modal']
      })
    },

    share() {
      // TODO Вынести домен в конфиг
      this.$copyText(`${config.baseURI}@${this.post.author}/${this.post.permlink}`)
      this.$message('Сылка на публикацию скопированна в буфер обмена')
    }
  }
}
</script>

<style>
.bottom-block {
  justify-content: space-between;
  padding: 0 17px;
  margin-bottom: 10px;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.copy-clickboard {
  position: absolute;
  left: -9999px
}

.bottom-block .icons {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
