<template lang="pug">
div
  #mySidenav
    gh-btns-star(slug="d-trip/dtrip" show-count)
    .sidenav
      a.closebtn(href="#", @click="close") ×
      nuxt-link(to="about") About
      nuxt-link(to="faq") FAQ
      a(href="https://cloudflare-ipfs.com/ipns/dtrip.app" target="_blank") IPFS Version

      .bottom
        a(href='https://github.com/d-trip/dtrip' target="_blank") GitHub
  .open(@click="open" v-on-clickaway="close")
    i.fa.fa-bars
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [clickaway],

  watch: {
    $route() {
      this.close()
    }
  },

  methods: {
    open() {
      document.getElementById("mySidenav").style.width = "230px";
    },

    close() {
      document.getElementById("mySidenav").style.width = "0";
    }
  }
}
</script>

<style>
/* The side navigation menu */
#mySidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0px;
    background-color: #fff;
    overflow-x: hidden;
    padding-top: 15px;
    transition: 0.2s;
    background: url(~/assets/img/sidebar.png);
    background-repeat: no-repeat;
    background-size: cover;
}

/* The navigation menu links */
.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #fff;
    display: block;
    transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
    color: #b9aeae;
}

/* Position and style the close button (top right corner) */
.sidenav .closebtn {
    position: absolute;
    top: -5px;
    right: 10px;
    font-size: 25px;
    margin-left: 50px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
    .sidenav a {font-size: 18px;}
}

.bottom {
  bottom: 0;
  position: absolute;
}

.open {
  cursor: pointer;
  width: 100%;
  height: 100;
}

.gh-button-container {
  float: none;
  margin: none;
  padding: 8px 8px 8px 25px;
}
</style>
