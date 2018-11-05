<template lang="pug">
div
  #mySidenav.sidenav
    a.closebtn(href="#", @click="close") ×
    a(href='#') About
    a(href='#') Services
    a(href='#') Clients

    a(href='#').mt-auto Contact

  .open(@click="open")
    i.fa.fa-bars
</template>

<script>
export default {
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
.sidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0px;
    background-color: #fff;
    overflow-x: hidden;
    padding-top: 60px;
    transition: 0.2s;
}

/* The navigation menu links */
.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #696464;
    display: block;
    transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
    color: black;
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
    .sidenav {padding-top: 15px;}
    .sidenav a {font-size: 18px;}
}

.open {
  cursor: pointer;
  width: 100%;
  height: 100;
}
</style>
