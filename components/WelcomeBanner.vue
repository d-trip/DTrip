<template lang="pug">
div

  no-ssr
    .welcome-banner(v-if="$store.state.showWelcome && !this.$store.getters['auth/isAuth']")
      a.close-button(aria-label="Close" @click="$store.commit('showWelcome', false)")
        span(aria-hidden="true") &times;

      .welcome
        .welcome-text
          //img(src="logo_white.png" height="50")
          h1 Share travel experience, meet up, get rewards.
          span.lead DTrip - a decentralized travel application based on the STEEM blockchain.

</template>

<style>
.close-button {
  z-index: 1;
  cursor: pointer;
  font-size: 2.5rem;
  position:absolute;
  top:0;
  bottom:0;
  right:20px;
}

.welcome-banner {
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 60px;
}

@media only screen and (max-width: 670px) {
  .welcome-banner {
    display: none;
  }
}

.welcome-banner {
  top: 42px;
  background: url(~/assets/img/welcomBanner.jpeg) no-repeat;
  background-size: contain;
  background-repeat: no-repeat;
  position:relative;
  width: 100%;
  height: 0;
  padding-top: 24.87%;
  color: #fff;
}

.welcome {
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  display: flex;
  align-items: center;
}

.welcome-text {
  color: #fff;
  margin-left: 20%;
}
</style>
