<template lang="pug">
div.pf
  div.head_img
    img(v-if="account.meta.profile" :src="account.meta.profile.cover_image")
    i.back

  div.user
    div.round_av
      img(v-if="account.meta.profile" :src="account.name | avatar('large')")
    div.name.verified
       | {{ account.name }}

  no-ssr
    .user-data
      .location(v-if="profile.meta.profile.location").mb-1
        | {{ profile.meta.profile.location }}

      about(:profile="profile.meta.profile")

      div
        el-button(v-if="user && user.name == account.name"
                  size="small" @click="showEditAccount = !showEditAccount").edit-button Edit

        // TODO Accept guests!

        edit-account(v-if="showEditAccount" @editingStop="showEditAccount = false").mt-3

//  div.bottom_bl
    nuxt-link
      | Задания

    nuxt-link.but.ic.set(:to="{name: 'index'}")
      | Посты

    //i.divd

</template>

<script>
import { mapGetters } from 'vuex'
import EditAccount from '~/components/account/EditAccount.vue'
import About from '~/components/account/About'

export default {
  props: ['account'],

  computed: {
    ...mapGetters('auth', ['user']),

    profile() {
      if (this.user && this.user.name == this.account.name) {
        return this.$store.state.auth.user
      } else {
        return this.account
      }
    }
  },

  data() {
    return {
      showEditAccount: false
    }
  },

  components: {
    EditAccount,
    About
  },

	head () {
    // TODO There dynamic user data
    let desc = `DTrip user: @${this.account.name}`
    let title = `DTrip: @${this.account.name}`

		return {
			title: title,

			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{ property: 'og:title', content: title },
				{ property: 'og:type', content: 'profile' },
				{ property: 'og:profile:username', content: this.account.name },
				{ property: 'og:image', content: this.account.meta.profile.profileImage },
				{ property: 'og:description', content: desc },

			],
			bodyAttrs: {
				class: 'overflowHidden'
			}
		}
  }
}

</script>

<style>
.user-data {
  padding: 25px;
}

.edit-button {
  margin-top: 10px;
  width: 100%;
}


  .pf {
    border-radius: 6px;
    background-color: #fafafa;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px rgba(72, 84, 101, 0.2);
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 20px;
  }

  .pf .head_img img{
    width: 100%;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .pf .head_img{
    width: 100%;
    min-width: 100%;
    background-position: 50% 50%;

    background-color: #6d9ee1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    min-height: 160px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    /*
    position: relative;
    */
  }
  .pf .user{
    position: relative;
    z-index: 5;
    margin: -60px auto 0px;
    text-align: center;
  }
  .pf .round_av{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    display: block;
    position: relative;
    overflow: hidden;
  }
  .pf .round_av img{
    display: block;
    height: 100%;
  }
  .pf .user .name{
    font-size: 26px;
    font-weight: 700;
    color: #485465;
    text-align: center;
    position: relative;
    display: inline-block;
  }

  .pf .user .name.verified:before{
    position: absolute;
    content: '';
    width: 21px;
    height: 21px;
    background: url(~/assets/icons/account/icon-blue-check.svg) no-repeat;
    top: -9px;
    right: -24px;
  }

  .pf .bottom_bl{
    border-top: solid 1px rgba(72, 84, 101, 0.2);
    height: 60px;
    display: flex;
    align-items: center;
  }

  .pf .bottom_bl .but{
    font: 700 18px/60px 'PT Sans';
    text-align: center;
    color: #485465;
    display: block;
    text-decoration: none;
    width: 50%;
  }

  .pf .bottom_bl .wal{
    background: url(~/assets/icons/account/icon-wallet.svg) no-repeat 16% center;
  }

  .pf .bottom_bl .set{
    background: url(~/assets/icons/account/icon-settings.svg) no-repeat 22% center;
  }

  .pf .bottom_bl .divd{
    width: 1px;
    background: rgba(72, 84, 101, 0.2);
    height: 48px;
  }

  .no_post{
    border-radius: 6px;
    background-color: #fafafa;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px rgba(72, 84, 101, 0.2);
    max-width: 494px;
    width: 100%;
    box-sizing: border-box;
    padding: 36px 45px 26px;
    text-align: center;
    margin-bottom: 20px;
  }

  .no_post p{
    font: 700 18px 'PT Sans';
    margin: 0 0 23px;
  }

  .no_post .blue_btn{
    letter-spacing: -0.5px;
    font: 700 14px/34px 'PT Sans';
    color: #fff;
    padding: 0 27px;
    border-radius: 3px;
    background-color: #6d9ee1;
    text-decoration: none;
    display: inline-block;
  }
</style>
