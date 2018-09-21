<template lang="pug">
.container.mt-5
  no-ssr
    .row.justify-content-center(v-if="$store.getters['auth/isAuth']")
      form.col-md-6.text-center
        h1.h3 Login
        p.text-muted.lead You are authorized

    .row.justify-content-center(v-else)
      form.col-lg-8.text-center
        h1.h2 Login
        p.text-muted.lead Mapala works on the blockchain
          a(href="https://steem.io", target="_blank")
            img(src="https://steem.io/favicon.ico?v=2", height="30")
            | Steem
        hr
        .mb-2
          | For authorization, you need to have an account in the STEEM blockchain
          br
          | Log in with the POSTING key
        //hr
        .input-group.mb-2
          .input-group-prepend
            span.input-group-text
              i.fa.fa-user-o
          // TODO При вводе аккаунта показывать кнопку для быстрого перехода к ключам
          input.form-control(placeholder="STEEM account name", v-model="account")
        .input-group.mb-3
          .input-group-prepend
            span.input-group-text
              i.fa.fa-shield
          input.form-control(placeholder="Private Posting key", type="password", v-model="wif")
        
        el-button(type="info" :loading="loading" @click="auth").w-100 Login

        hr
        p.lead Difficulty for login?

        .text-left
          a(href="https://golos.io/create_account", target="_blank") Where to register?
          |  Be sure to save the password!

          div.mt-2
            p What is private posting key? 
              | You can find this key in the permissions section in your profile page on steemit.com.
              img(src="https://about.d.tube/img/profile-permissions.png" style="width: 100%;")
              p Go to your blog on the Steemit. Click the "Wallet" button - then the "Permissions" button - then the button to the right of the first paragraph (where the posting key is) "Show private key"




</template>

<script>
import { mapActions } from 'vuex'
import loadingButton from '@/components/elements/loading-button.vue'
import PostModal from '~/components/post/PostModal.vue'


export default {
  layout: 'full-width',

  data() {
    return {
      account: '',
      wif: '',
      loading: false
    }
  },
  components: {
    loadingButton
  },

  open_modal(marker) {
    this.$modal.show(PostModal, {author: marker.author, permlink: marker.permlink}, {
      height: 'auto',
      width: '60%',
      scrollable: true,
      classes: ['v--modal', 'post-modal']
    })
  },

  //created() {
  //  if(this.$store.getters['auth/isAuth']) {
  //    this.$router.back()
  //  }
  //},

  methods: {
    ...mapActions({
      'authorization': 'auth/authorization'
    }),

    async auth() {
      this.loading = true

      try {
        await this.authorization({ wif: this.wif, account: this.account })
        this.$router.push({name: 'index'})
      } catch (e) {
        this.$notify.warning({ title: 'Error', message: e.message })
      } finally {
        this.loading = false
      }
    }
  }
}

</script>
