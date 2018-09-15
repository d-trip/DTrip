<template lang="pug">
div
  .post-content
    .top_block
      .t_col
        .img_wrap
          nuxt-link(:to="{name: 'post', params: {author: post.author.name, permlink: post.permlink}}").user_av
            img.user_av(v-if="post.author.meta.profile.profileImage" :src="post.author.meta.profile.profileImage | golos_proxy('64x64')")

        div.name_block
          nuxt-link.name(:to="{name: 'account', params: {account: post.author.name}}") @{{ post.author.name }}
          div.date
            | {{ post.created | formatDate }}

          // Новый стандарт
          .location(v-if="post.meta.location.properties") {{ post.meta.location.properties.name }}

          // Старый стандарт
          .location(v-else) {{ post.meta.location.name }}

      nuxt-link(v-show="$store.state.auth.account.name == post.author.name"
                :to="{name: 'editor-permlink', params: {permlink: post.permlink}}").edit
      
        span Редактировать


    .content
      h1.c_header {{ post.title }}
      post-content(:body="post.body", :format="post.meta.format")
    
    .col
      post-bottom(:post="post")
    comments-block(:post="post")

</template>

<script>
import PostContent from '~/components/post/PostContent.vue'
import CommentsBlock from '~/components/comment/CommentsBlock.vue'
import PostBottom from '~/components/post/PostBottom.vue'
import { mapState, mapActions } from 'vuex'
import marked from 'marked'
import xmldom from 'xmldom'
import prepare_html from '~/utils/prepare_html'


export default {
  props: ['post'],

  components: {
    PostContent,
    CommentsBlock,
    PostBottom
  },

  computed: {
    body() {
      if (this.post.meta.format == 'markdown') {
        return this.$options.filters.markdown(this.post.body)
      } else {
        return this.$options.filters.golos_html(this.post.body)
      }
    }
  },

	head () {
    let desc = this.$options.filters.html_preview(this.post.body)
    let title = `${this.post.title} | Mapala`

		return {
			title: title,

			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{ property: 'og:title', content: title },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:image', content: this.post.thumb },
				{ property: 'og:description', content: desc },


			],
			bodyAttrs: {
				class: 'overflowHidden'
			}
		}
	},
}


</script>

<style>
  .ql-video {
    width: 100%;
    height: 400px;
  }
  .prev_post {
    width: 70px;
    height: 70px;
    position: fixed;
    top: 48%;
    left: calc((100% - 866px)/2 - 130px);
    z-index: 102;
    /* background: url('~/assets/icon-prev.svg') no-repeat; */
    cursor: pointer;
  }

  .next_post {
    /* background: url('~/assets/icon-prev.svg') no-repeat; */
    transform: rotateZ(180deg);
    width: 70px;
    height: 70px;
    position: fixed;
    cursor: pointer;
    z-index: 102;
    top: 48%;
    right: calc((100% - 866px)/2 - 130px);
  }
  .post-content .edit {
    font: 700 14px/36px 'PT Sans';
    box-sizing: border-box;
    padding: 0 16px;
    cursor: pointer;
    user-select: none;
    margin-right: 50px;
    margin-left: 20px;
    width: 123px;
    height: 40px;
    border-radius: 23px;
    border: solid 2px #000000;
    font-family: PTSans;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    color: #000000;
    text-decoration: none;
  }

  .post-content .c_header {
    font: 700 40px 'PT Sans';
    letter-spacing: -0.8px;
    color: #20252d;
    margin: 0 30px 20px;
  }

  .post-content .top_block {
    display: flex;
    margin: 40px 30px 35px;
    justify-content: space-between;
  }

  .post-content .t_col {
    display: flex;
  }

  .post-content .top_block .img_wrap {
    border-radius: 50%;
    margin-right: 8px;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .post-content img {
    display: block;
  }

  .post-content .name_block {
    margin-right: 8px;
    margin-top: 1px;
  }

  .post-content .name {
    font: 700 16px/20px 'PT Sans';
    letter-spacing: -0.5px;
    color: #6d9ee1;
    text-decoration: none;
  }

  .post-content .date {
    font-size: 12px;
    letter-spacing: -0.5px;
    color: rgba(72, 84, 101, 0.7);
    line-height: 16px;
  }

  .post-content .top_block .location {
    margin-top: 4px;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: -0.5px;
    color: #7e8793;
    padding-left: 12px;
    position: relative;
    /* background: url('~/assets/icon-location-small.svg') no-repeat left 3px; */
  }

  .post-content .content {
    overflow: hidden;
    -ms-word-wrap: break-word;
    word-wrap: break-word;
  }

  .post-content .c_text img {
    /*max-height: 492px;*/
    max-width: 100%;
    text-align: center;
    margin: 24px auto;
    width: auto;
  }
</style>
