<template lang="pug">
div
  .filters.mt-2
    .row
      .col
        el-checkbox(label="Accepting guests", v-model="accepting_guests" @change="reset")
      .col
        el-checkbox(label="Wants to Meet Up", v-model="wants_meet_up" @change="reset")
      //.col TODO
        //el-tooltip(placement="right" content="User create publications for SteemitWorldMap")
        el-checkbox(false-label="no" true-label="yes" v-model="postingToSWM" @change="reset")
          img(src="~/assets/icons/swm.png")
          |  Active on SteemitWorldMap

  .filters
    el-select(v-model="lastPost" placeholder="Last publication" size="small" @change="reset")
      el-option-group(label="Last publication")
        el-option(label="Week" value="week")
        el-option(label="Month" value="month")
        el-option(label="All" value="all")

  </el-select>
  .row
    .col
      p(v-if="total").lead Total: {{ total }}

  account-item(v-for="account in accounts" :account="account" :key="account.name")

  no-ssr
    .row
      .col
        infinite-loading(:identifier="loadId" @infinite="handleLoading")
    // infinite-loading(ref="infiniteload" @infinite="handleLoading" :forceUseInfiniteWrapper="true")

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

      lastPost: 'all',
      accepting_guests: false,
      wants_meet_up: false,
      postingToSWM: false,

      page: 1,

      loadId: +new Date(),
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
      this.loadId += 1
    },

    async fetch_accounts() {
      // FIXME In Safary reload only when select true
      let date = new Date()
      if (this.lastPost == 'month') {
        date.setMonth(date.getMonth() - 1)
      } else if (this.lastPost == 'week') {
        date.setDate(date.getDate() - 7)
      }

      // TODO Account have steemitworldmap posts
      //db.getCollection('account_object').aggregate([
      //{
      //    $lookup: {
      //        "from":"post_object",
      //        "localField":"name",
      //        "foreignField":"author",
      //        "as":"Aposts"
      //    },
      //}, {
      //    $unwind: "$Aposts"}, {
      //        
      //    "$match":{"Aposts": {$exists: true}}
      //}])

      let {data: { _items, _meta }} = await axios.get(`${process.env.API_URL}/accounts`, {
        params: {
          where: {
            'last_post': this.lastPost != 'all' ? { '$gt': date.toISOString() } : undefined,
            'profile.accepting_guests': this.accepting_guests ? 'yes' : undefined,
            'profile.wants_meet_up': this.wants_meet_up ? 'yes' : undefined,

            $text: this.search ? { $search: this.search } : undefined,
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
      console.log('load..')
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
