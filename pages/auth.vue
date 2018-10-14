<template lang="pug">
  div(v-loading.fullscreen.lock="true")
</template>
<script>
export default {
  layout: 'full-width',

  created() {
    if (process.server) return

    this.$store.commit('auth/set_access_token', this.$route.query.access_token)
    this.$router.push('/')
  }
}
</script>
