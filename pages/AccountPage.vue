<template lang="pug">
.row
  .col-lg-4.col-sm-6
    account(:account="account")
    feed
  .col.right-fixed-container(v-if="$device.isDesktop")
    no-ssr
      trip-map#map(:account="account.name" :gridSize="5")

</template>

<script>
import Feed from '~/components/post/Feed'
import Account from '~/components/account/Account.vue'
import TripMap from '@/components/TripMap'
import { getAccount } from '~/utils/steem'

export default {
  components: {
    Feed,
    Account,
    TripMap
  },

  async fetch ({ app, store, commit, route }) {
    store.dispatch('posts/set_author', route.params.account)
    store.commit('posts/set_by', 'blog')

    //if (process.server) {
    //  await store.dispatch('posts/fetch_posts')
    //}
  },

  async asyncData({ app, route, error }) {
    let account = await getAccount(route.params.account)

    if (!account) return error({ statusCode: 404, message: 'Account not found' })

    return { account }
  }
}


</script>

<style>
.card.hovercard {
    position: relative;
    padding-top: 0;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 1);
}
.card.hovercard .card-background {
    height: 130px;
}
.card-background img {
    min-width: 100%;
    background-position: 50% 50%;
}
.card.hovercard .useravatar {
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
}
.card.hovercard .useravatar img {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
}
.card.hovercard .card-info .card-title {
    padding:0 5px;
    font-size: 20px;
    line-height: 1;
    color: #262626;
    border-radius: 4px;
}
</style>
