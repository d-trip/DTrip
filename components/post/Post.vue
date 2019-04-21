<template lang="pug">
.post-content
  .top_block
    .img_wrap
      nuxt-link(:to="{name: 'post', params: {author: post.author, permlink: post.permlink}}").avatar-inside
        img(:src="post.author | avatar")

    div.name_block
      nuxt-link.name(:to="{name: 'account', params: {account: post.author}}") @{{ post.author }}
      div.date
        | {{ post.created | formatDate }}

    .location(v-if="post.meta.location && post.meta.location.properties").ml-auto {{ post.meta.location.properties.name }}

    no-ssr
      nuxt-link(v-if="user && user.name == post.author"
              :to="{name: 'editor-permlink', params: {permlink: post.permlink}}")
        el-button(size="medium" icon="el-icon-edit").ml-4 Edit

  .content
    h1.c_header {{ post.title }}
    post-content(:body="post.content", :format="post.meta.format")
  
  .row
    .col
      adsbygoogle
      post-bottom(:post="post").mt-3
      comments-block(:post="post")

</template>

<script>
import { mapGetters } from 'vuex'
import PostContent from '~/components/post/PostContent.vue'
import CommentsBlock from '~/components/comment/CommentsBlock.vue'
import PostBottom from '~/components/post/PostBottom.vue'


export default {
  props: ['post'],

  components: {
    PostContent,
    CommentsBlock,
    PostBottom
  },

  computed: {
    ...mapGetters('auth', ['user'])
  },

	head () {
    let desc = this.$options.filters.html_preview(this.post)
    let title = `DTrip: ${this.post.title}`

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
  /* TODO Create nex/prev post arrows
  .prev_post {
    width: 70px;
    height: 70px;
    position: fixed;
    top: 48%;
    left: calc((100% - 866px)/2 - 130px);
    z-index: 102;
    background: url('~/assets/icon-prev.svg') no-repeat;
    cursor: pointer;
  }

  .next_post {
    background: url('~/assets/icon-prev.svg') no-repeat;
    cursor: pointer;
    height: 70px;
    position: fixed;
    right: calc((100% - 866px)/2 - 130px);
    top: 48%;
    transform: rotateZ(180deg);
    width: 70px;
    z-index: 102;
  }
  */

  .post-content .c_header {
    font: 700 40px 'PT Sans';
    letter-spacing: -0.8px;
    color: #20252d;
  }

  .post-content .top_block {
    display: flex;
    padding: 20px 0px;
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
    font-size: 16px;
    line-height: 18px;
    letter-spacing: -0.5px;
    color: #7e8793;
    padding: 6px 0px 0px 23px;
    position: relative;
    background: url('~/assets/icons/icon-location.svg') no-repeat left 3px;
  }

@media (max-width: 992px) {
   .post-content {
     margin: 0px;
   }
}
</style>
