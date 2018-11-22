<template lang="pug">
  accounts-list(v-else :search="search")
</template>

<script>
import AccountsList from '~/components/account/AccountsList'

export default {
  props: ['search'],

  components: {
    AccountsList
  },
}
</script>
