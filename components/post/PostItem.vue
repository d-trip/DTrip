<template lang="pug">
.row
  .col
    .post-item.mb-3(:class="post.thumb ? 'w_i': ''")
      div(v-if="post.thumb")
        a(v-if="$device.isDesktop" @click="open_modal")
          .post-image
            img(:src="post.thumb | steem_proxy('480x320')", :alt="post.title", :title="post.title")

        nuxt-link(v-else :to="{name: 'post', params: {author: post.author, permlink: post.permlink}}")
          .post-image
            img(:src="post.thumb | steem_proxy('480x320')", :alt="post.title", :title="post.title")

      .short
        .top-block
          .img-wrap
            nuxt-link.card-link(:to="{name: 'account', params: {account: post.author}}").avatar-inside
              img(:src="post.author | avatar"
                  :alt="'@' + post.author"
                  :title="'@' + post.author")

          .name-block.mr-2
            nuxt-link.name(:to="{name: 'account', params: {account: post.author}}") @{{ post.author }}
            .date {{ post.created | formatDate }}

          // Новый стандарт
          div(v-if="post.meta.location && post.meta.location.properties")
            .location(v-if="post.meta.location.properties") {{ post.meta.location.properties.name }}

            // Старый стандарт
            .location(v-else) {{ post.meta.location.name }}

          nuxt-link(v-show="user && user.name == post.author"
                    :to="{name: 'editor-permlink', params: {permlink: post.permlink}}").icon.ml-auto
            i.fa.fa-edit

        a(v-if="$device.isDesktop" @click="open_modal")
          h2.write-header  {{ post.title }}
          p.write-text {{ post.content | html_preview }}
        nuxt-link(v-else :to="{name: 'post', params: {author: post.author, permlink: post.permlink}}")
          h2.write-header  {{ post.title }}
          p.write-text {{ post.content | html_preview }}

        post-bottom(:post="post")
            
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import PostModal from '~/components/post/PostModal.vue'
import PostBottom from '~/components/post/PostBottom.vue'


export default {
  props: ['post'],

	data() {
		return {
			loading: false,
		}
	},

  computed: {
    ...mapGetters('auth', ['user']),

    ...mapState({
      editor: state => state.editor
    })
  },

  methods: {
    ...mapActions({
      gols_vote: 'golos/vote',
    }),

    open_modal() {
      this.$modal.show(PostModal, { author: this.post.author, permlink: this.post.permlink }, {
        height: 'auto',
        width: '60%',
        scrollable: true,
        classes: ['v--modal', 'post-modal']
      })
    },
  },

  components: {
    PostModal,
    PostBottom,
  }
}
</script>

<style>
.post-item .name {
  font: 700 16px/20px PT Sans;
  letter-spacing: -.5px;
  color: #6d9ee1;
}

.write-text {
  margin: 0 12px 20px;
  font-size: 18px;
  letter-spacing: -.3px;
  color: #20262d;
  word-wrap: break-word;
}

.write-header {
  margin: 0 12px 13px;
  font: 700 26px PT Sans;
  letter-spacing: -.5px;
  color: #20262d;
}

.post-item .date {
  font-size: 12px;
  letter-spacing: -.5px;
  color: rgba(72,84,101,.7);
  line-height: 16px;
}

.img-wrap {
  margin-right: 8px;
  width: 40px;
  height: 40px;
  overflow: hidden;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.top-block {
  display: flex;
  padding: 12px 12px 10px;
}

.short a {
  text-decoration: none;
}

.post-item {
  width: 100%;
  border-radius: 6px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  border: 1px solid rgba(72,84,101,.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.post-item a {
  cursor: pointer;
}

.post-image {
  overflow: hidden;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.post-image img {
  display: block;
  width: 100%;
}

.post-item .short {
  word-wrap: break-word;
}

.post-item.w_i .short{
  margin: -80px 12px 25px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 1;
  padding-bottom: 10px;
}

.post-modal {
  margin-bottom: 50px !important;
  top: 70px !important;
}
</style>
