<template lang="pug">
div
  .filters
    el-checkbox(label="Accepting guests", v-model="acceptingGuests")
    el-checkbox(label="Wants to Meet Up", v-model="wantsTomeetUp")

  .row
    .col
      p(v-if="total").lead Total: {{ total }}

  account-item(v-for="account in accounts" :account="account" :key="account.name")

  no-ssr
    infinite-loading(ref="infiniteload" @infinite="handleLoading" :forceUseInfiniteWrapper="true")

</template>


<script>
import axios from 'axios'
import AccountItem from '~/components/account/AccountItem'

export default {
  props: ['search'],

  data() {
    return {
      total: 0,
      accounts: [],

      acceptingGuests: false,
      wantsTomeetUp: false,

      page: 1,
    }
  },

  watch: {
    search(query) {
      this.reset()
    }
  },

  methods: {
    reset() {
      this.accounts = []
      this.page = 1
      this.$refs.infiniteload.stateChanger.reset()
    },

    async fetch_accounts() {
      let {data: { _items, _meta }} = await axios.get(`${process.env.API_URL}/accounts`, {
        params: {
          where: {
            $text: this.search ? { $search: this.search } : undefined
          },

          page: this.page,
          // sort: "-sp",
        }
      })

      this.accounts = [...this.accounts, ..._items]
      this.page++
      this.total = _meta.total
    },

    async handleLoading($state) {
      let prev_count = this.accounts.length

      this.fetch_accounts().then(() => {
        if (prev_count == this.accounts.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }).catch(e => {
        console.log('Request error', e)

        setTimeout(() => $state.loaded(), 2000)
      })
    }
  },

  components: {
    AccountItem
  }
}
</script>

<style>
.filters {
  padding: 5px 0px;
  display: flex;
  justify-content: center;
}
</style>


