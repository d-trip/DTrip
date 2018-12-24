<template lang="pug">
// TODO https://steemhunt.com/sign-up
div
  .top-navbar.container-fluid
    // a(:href="BASE_URL").d-flex.align-items-center
    nuxt-link(:to="{name: 'index'}").d-flex.align-items-center.logo
      img(src="logo_white.png" height="25")
      //h2.mb-0
        | DTrip

    no-ssr
      .right
        a(href="https://t.me/joinchat/EPzxdVfxrDb9GamQcEeAJg" target="_blank")
          img(src="~/assets/icons/telegram.svg").telegram.mr-3


        .user-lk(v-if="user" @click="toggleMenu" v-on-clickaway="closeMenu").noselect
          .user_name.mr-2 @{{ user.name }}

          .avatar-inside
            img(:src="user.name | avatar('big')")

        el-button(v-else @click="login" size="small" type="text").login Login 
          i.fa.fa-sign-in

        div.user_menu(v-if="user" :class="{ active : isMenuOpened }").noselect
          nuxt-link(:to="{name: 'account', params: {account: user.name}}", class="wal")
            i.purce
            span.txt_i
              | Wallet
            span(class="amount") {{ user.balance }}

          div.divd
          div.mn
            nuxt-link(v-if="user" :to="{name: 'account', params: {account: user.name}}").m_item.white-text Profile
            //nuxt-link(v-if="user" :to="{name: 'settings'}").m_item.white-text Settings
            a(href="#" class="m_item", @click.prevent="logout").white-text Logout

        side-bar.ml-3
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import { Loading } from 'element-ui'
import steem from 'steem'
import config from '~/config'

import SideBar from '~/components/SideBar.vue'

export default {
  mixins: [clickaway],

  components: {
    SideBar
  },

  data () {
    return {
      BASE_URL: config.BASE_URL,
      isMenuOpened: false,
      totalPayout: 0,
    }
  },

  watch: {
    $route (to, from){
      this.isMenuOpened = false
    }
  },

  methods: {
    test() {
      //this.$router.push({name: 'index-accounts'})
      //this.$router.push({name: 'index'})
    },
    toggle() {
      let navs = document.querySelectorAll('.mobile-menu')
      navs.forEach(nav => nav.classList.toggle('navbar-toggle-show'))
    },

    async login() {
      window.location = this.$steemconnect.getLoginURL()
    },

    logout() {
      this.$store.dispatch('auth/logout')
    },

    toggleMenu () {
      this.isMenuOpened = !this.isMenuOpened
    },

    closeMenu () {
      this.isMenuOpened = false
    }
  },

  computed: {
    ...mapGetters('auth', ['user']),
  },
}
</script>

<style scoped>
.logo {
  z-index: 999999;
}

.logo img {
  height: 30px;
  margin-top: 2px;
}

.telegram {
  height: 35px;
}

a {
  color: #fff;
  text-decoration: none;
}

.right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.avatar-inside {
  height: 32px;
  width: 32px;
}

.user-lk {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user_name {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
 
.top-navbar {
  height: 42px;
  /* background-image: linear-gradient(180deg,#5d7394,#4b5e7a); */
  /* background-color: rgb(85, 118, 151); */
  /* background-color: rgb(96, 112, 132); */
  /* background-color: rgb(80, 113, 158); */
  background-image: linear-gradient(to right, #00a8f1, #0f92e5, #3a7bd5);
  color: #eaecee;
  display: flex;
  font-family: sans-serif;
}

.login {
  color: #fff;
  font: 700 14px PT Sans;
  cursor: pointer;
}

.login:hover{
  color: #red !important;
}

.user_menu.active{
  display: flex;
}

.user_menu {
  background-image: linear-gradient(to right, #0f92e5, #3a7bd5);
  width: 350px;
  display: none;
  padding: 35px 0 16px;
  position: absolute;
  right: 30px;
  top: 50px;
  border-radius: 6px;
  color: #fff;
  z-index: 99;
}

.user_menuMobile {
  right: 5px!important;
  width: 300px!important;
}

.user_menu:before{
  content: '';
  position: absolute;
  top: -8px;
  right: 35px;
  width: 0px;
  height: 0px;
  border-top: 18px solid #5d7394;
  border-left: 18px solid transparent;
  transform: rotateZ(-45deg);
  z-index: 100;
}

.user_menu .wal{
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-right: 1px solid #526683;
  padding-top: 27px;
  text-decoration: none;
  color: #ffffff;
}

.user_menu .mn{
  padding-left: 20px;
}

.user_menu .m_item{
  text-decoration: none;
  display: block;
  color: #fff;
  margin-bottom: 23px;
  font: 700 16px 'PT Sans';
  padding: 2px 12px;
  transition: opacity 200ms ease;
}

.user_menu .m_item:hover{
  opacity: 1;
}

.user_menu .purce{
  width: 45px;
  height: 38px;
  display: block;
  background: url('~assets/icons/icon-purce.svg') no-repeat;
  margin-bottom: 10px;
}

.user_menu .txt_i{
  font: 700 16px 'PT Sans';
  opacity: 0.87;
  width: 100%;
  text-align: center;
  margin-bottom: 18px;
}

.user_menu .amount{
  font: 700 24px 'PT Sans';
  text-align: center;
}
</style>
