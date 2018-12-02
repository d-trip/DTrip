<template lang="pug">
  //el-card(:body-style="{ padding: '0px' }").mb-4
    img.image(:src="account.name | avatar('large')", alt="Card image cap").w-100

    div(style='padding: 14px;')
      p.name {{ account.name }}

      ////.bottom.clearfix
        time.time sdf
        el-button.button(type='text') Operating button

  .card.mb-4
    img.card-img-top(:src="account.name | avatar('large')", alt="Card image cap")
    .card-body
      .top.d-flex.align-items-baseline.justify-content-between
        nuxt-link(tag="h2" :to="{name: 'account', params: {account: account.name}}").card-title.name.pointer {{ account.name }}

        .location(v-if="account.profile.location").mb-1
          | {{ account.profile.location }}

      hr
      p.card-text
        about(:profile="account.profile")
      a(:href="'https://steemit.com/@' + account.name" target="_blank")
        el-button(size="small" native-type="a") steemit
    .card-footer.text-muted
      | Last publication: {{ account.last_post | formatDate }}
      
</template>

<script>
import About from '~/components/account/About'

export default {
  props: ['account'],

  components: {
    About
  }
}
</script>

<style>
.name {
  font: PT Sans;
}
</style>
