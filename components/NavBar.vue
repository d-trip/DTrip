<template lang="pug">
div
  .top-navbar
    .navbar-link.navbar-link-brand
      nuxt-link(:to="{name: 'index'}").main_logo
        img(src="~/assets/img/mapala-logo.png")
        h2.mb-0
          | MAPALA

    .navbar-link
      el-popover(placement="bottom"
                 title="Payouts"
                 width="300"
                 trigger="hover"
                 content="Total payment to the authors of Mapala in dollars.")
        h4(slot="reference").mb-0.white-text.btn
          | Payouts: {{ totalPayout | convertGBG }}$


    .navbar-items
      nuxt-link(:to="{name: 'about'}").white-text FAQ
      //.navbar-link
        nuxt-link(:to="{name: 'about'}").white-text Блог мапала


    .navbar-link.navbar-link__toggle(@click="mobileMenuToggle = !mobileMenuToggle")
      i.fa.fa-bars
      
    no-ssr
      .navbar-items__right
        el-tooltip(class="item" effect="light" content="Telegram group/support @mapala" placement="bottom-end")
          a(target='_blank', href="https://t.me/mapala").mr-2
            img(src="~/assets/icons/telegram.png").telegram

        nuxt-link(v-if="$store.getters['auth/isAuth']" :to="{name: 'account', params: {account: account.name}}").user-lk
          .user_name.mr-2 @{{ account.name }}

          .user_av
            img(:src="account.name | avatar")

        nuxt-link(v-if="!$store.getters['auth/isAuth']", :to="{name: 'login'}").login
          | Login
        div.right_button(v-else)
          div(@click="toggleMenu", class="open_menu", v-on-clickaway="closeMenu" )
            | Menu 

          div.user_menu(:class="{ active : isMenuOpened }")

            nuxt-link(:to="{name: 'account', params: {account: account.name}}", class="wal")
              i.purce
              span.txt_i
                | Wallet
              span(class="amount") {{ parseFloat(account.balanceValue) }}$

            div.divd
            div.mn
              //nuxt-link(to="/settings" class="m_item") Настройки
              a(href="#" class="m_item", @click.prevent="logout").white-text Logout

  no-ssr
    .mobile-menu(v-if="mobileMenuToggle")
      .navbar-link
        nuxt-link(v-if="$store.getters['auth/isAuth']" :to="{name: 'account', params: {account: account.name}}").user-lk
          .user_name.mr-2 @{{ account.name }}

          .user_av
            img(:src="account.name | avatar")

      .navbar-link
        a(target='_blank', href="https://t.me/mapala").mr-2.white-text Telegram group/support
          img(src="~/assets/icons/telegram.png").telegram

      .navbar-link
        nuxt-link(:to="{name: 'about'}").white-text FAQ
        //.navbar-link
          nuxt-link(:to="{name: 'about'}").white-text Блог мапала

      .navbar-link
        nuxt-link(v-if="!$store.getters['auth/isAuth']", :to="{name: 'login'}").login
          | Login
        div.right_button(v-else)
          div.mn
            //nuxt-link(to="/settings" class="m_item") Настройки
            a(href="#" class="m_item", @click.prevent="logout").white-text Logout

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import { Loading } from 'element-ui'
import steem from 'steem'


export default {
  mixins: [clickaway],

  data () {
    return {
      isMenuOpened: false,
      totalPayout: 0,
      mobileMenuToggle: false
    }
  },

  watch: {
    $route (to, from){
      // Закрываем мобльную менюшку когда уходим куда то
      this.mobileMenuToggle = false
    }
  },

  async created() {
    //let r = await steem.api.getStateAsync('/tranding/mapala')
    //console.log(r)
    // TODO Сумма выплат
    //let client = this.$apolloProvider.defaultClient

    //client.query({query: MAPALA_TOTAL_PAYOUT_QUERY})
      //.then(r => console.log(r.data.stats * 2.60424))
      //.then(r => this.totalPayout = r.data.stats.posts.totalPayout)
  },

  methods: {
    toggle() {
      let navs = document.querySelectorAll('.mobile-menu')
      navs.forEach(nav => nav.classList.toggle('navbar-toggle-show'))
    },

    logout() {
      this.$store.dispatch('auth/logout')
    },

    toggleMenu () {
      this.isMenuOpened = !this.isMenuOpened
    },

    openMenu () {
      this.isMenuOpened = true
    },

    closeMenu () {
      this.isMenuOpened = false
    }
  },

  computed: {
    ...mapState({
      account: state => state.auth.account
    })
  },
}
</script>

<style scoped>
.mobile-menu {
  width: 100%;
  background-image: linear-gradient(180deg,#5d7394,#4b5e7a);
}

.user_av {
  height: 32px;
  width: 32px;
}

.telegram {
  height: 38px;
  width: 38px;
}
.user-lk {
  display: flex;
  align-items: center;
}

.user_name {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
 
.top-navbar {
  height: 42px;
  background-image: linear-gradient(180deg,#5d7394,#4b5e7a);
  display: flex;
  padding: 0px 30px;
  font-family: sans-serif;
}

.navbar-items {
  display: flex;
  align-items: center;
}

.navbar-items__right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.navbar-link {
  justify-content: center;
  align-items: center;
  display: flex;
}

.navbar-items a,
.user-lk a,
.navbar-link a {
  color: #fff;
}

.navbar-link__toggle {
  color: #d0d0d0;
  display: none;
}

.login {
  color: #88ade0;
  font: 700 14px PT Sans;
  display: block;
  align-items: center;
  width: 70px;
  padding-left: 7px;
  height: 102%;
  line-height: 42px;
  box-sizing: border-box;
  background: url('~assets/icons/icon-login.svg') no-repeat 53px center;
  cursor: pointer;
  transition: color .2s ease;
  text-decoration: none;
  margin-left: 10px;
}

.login:hover{
  color: #fff;
}

@media only screen and (max-width: 768px) {
  .top-navbar {
    padding: 0px 15px;
  }

  .navbar-items__right,
  .navbar-items {
    display: none;
  }

  .navbar-link__toggle {
    display: flex;
    cursor: pointer;
    margin-left: auto;
  }

  .navbar-toggle-show {
    display: flex;
  }
}

  /* @media only screen and (max-width: 768px) {
    .navbar-items,
    .top-navbar {
      flex-direction: column;
    }

    .navbar-items {
      display: none;
    }

    .navbar-items__right {
      margin-left: 0px;
    }

  } */


  .main_logo {
    display: flex;
    height: 42px;
    text-decoration: none;
    align-items: center;
  }

  .open_menu {
    color: #88ade0;
    font: 700 14px PT Sans;
    display: flex;
    align-items: center;
    width: 70px;
    padding-left: 0;
    height: 100%;
    position: relative;
    line-height: 42px;
    right: 0;
    top: 0;
    box-sizing: border-box;
    background: url('~/assets/icons/icon-menu.svg') no-repeat 53px center;
    cursor: pointer;
    transition: color .2s ease;
  }
  .open_menu:hover{
    color: #fff;
  }

  .top-menu {
    height: 42px;
    background-color: #435f7b;
    padding-left: 30px;
    padding-right: 30px;
    background-image: linear-gradient(180deg,#5d7394,#4b5e7a);
  }

  .top-menu a {
    color: #fff;
  }

  .main_header{
    width: 100%;
    width: -moz-available;
    width: -webkit-fill-available;
    height: 42px;
    background-image: linear-gradient(180deg,#5d7394,#4b5e7a);
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
  }

  .top_left_block {
    display: flex;
    flex-wrap: wrap;
  }
  .main_logoMobile {
    margin-left: 0!important;
  }
  .main_logo img {
    height: 38px;
    margin-right: 6px;
  }

  .main_header .user{
    right: 0;
    top: 0;
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0;
    line-height: 42px;
  }
  .main_header a {
    color: #fff;
    text-decoration: none;
  }

  .main_header .user_name{
    color: #fff;
    font-size: 14px;
    font-weight: 700;
  }
  .main_header .user_logo{
    margin-left: 12px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
  }

  .main_header .no_avatar{
    margin-left: 12px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .main_header .user_logo img{
    display: block;
    width: 100%;
  }


  .main_header .open_menuMobile{
    width: 69px;
  }

  .main_header .login{
    color: #88ade0;
    font: 700 14px PT Sans;
    display: block;
    align-items: center;
    width: 70px;
    padding-left: 7px;
    height: 102%;
    line-height: 42px;
    box-sizing: border-box;
    background: url('~assets/icons/icon-login.svg') no-repeat 53px center;
    cursor: pointer;
    transition: color .2s ease;
    text-decoration: none;
    margin-left: 10px;
  }

  .main_header .login:hover{
    color: #fff;
  }


  .main_header .divider{
    width: 1px;
    background: #4d5169;
    height: 42px;
    box-shadow: 0 -2px 7px 0 #2a2c3e;
  }

  .right_button {
    padding-left: 20px;
  }

  .user_menu.active{
    display: flex;
  }

  .user_menu {
    background: #5d7394;
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

  .user_menuMobile{
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
    opacity: 0.87;
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

  .change_lang{
    margin: 0 0 0 20px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .change_lang input {
    display: none;
  }

  .change_lang .lab{
    font: 700 18px/58px 'PT Sans';
    color: white;
  }

  .change_lang {
    font: 700 14px/58px PT Sans;
    letter-spacing: .3px;
    color: #fff;
    transition: 1s all;
    margin-left: 0;
    cursor: pointer;
    position: relative;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 15px;
  }

  .change_lang:first-child {
    /*margin-left:;: 15px;*/
  }

  .switch_lang img {
    width: 25px;
    height: 25px;
    border: 1px solid white;
    border-radius: 50%;
    padding: 2px;
    background: #fff;
    margin-right: 10px;
  }

  .switch_lang {
    line-height: 0;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    opacity: .5;
  }

  .radio_wrapper:not(:last-child) {
    margin-right:20px;
  }

  .switch_lang:hover {
    opacity: 1;
  }


  .top-right-block {
    display: flex;
  }
  .top-right-block .username_wrapper {
    padding: 0 20px;
  }

  .radio_wrapper input[type="radio"]:checked + label{
    opacity: 1;
  }

/*
@media screen and (max-width: 600px) {
  .username_wrapper {
    display: none;
  }

  .top_left_block {
    flex: 1;
  }

  .top-right-block {
    justify-content: space-between;
  }

}

*/

@media screen and (max-width: 800px) {
  .main_logo h2 {
    font-size: 13px;
  }
}

.mapala-fest-link {
  display: flex;
  align-items: center;
  background: transparent !important;
  border: none !important;
  font-size: 12px !important;
}

.mapala-fest-link span {
  color: #fff;
  font-style: oblique;
}

@media screen and (max-width: 500px) {
  .mapala-fest-link {
    display: none;
  }
}

@media screen and (max-width: 1024px) {
  .slogan {
    display: none;
  }
}


</style>
