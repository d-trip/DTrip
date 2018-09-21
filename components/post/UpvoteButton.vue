<template lang="pug">
  el-button(size="small" v-if="!isVoted", @click="vote", type="info" :loading="loading" icon="el-icon-arrow-up")
    //round.mr-2
    //span.mr-2 Голосовать
    span {{ tpv }}$

  el-button.upvote-btn(v-else, size="small" type="primary" icon="el-icon-check").voted
    //round.mr-2
    //span.ml-2 Проголосовано
    // TODO тут сделать фильтрацию по разрым валютам в зависимости от настроек
    span.text-light.ml-2 {{ tpv }}$
</template>

<script>
import steem from 'steem'
import Raven from 'raven-js'
import { mapState } from 'vuex'

import Round from '~/components/elements/svg/round.vue'

export default {
  props: ['post'],

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState({
      wif: state => state.auth.wif,
      name: state => state.auth.account.name,
    }),

    isVoted() {
      return !!this.post.active_votes.filter(v => v.voter == this.name).length
    },

    tpv() {
      return parseFloat(this.post.total_payout_value.replace(' SBD', ''))
             + parseFloat(this.post.pending_payout_value.replace(' SBD', ''))
    }
  },

  methods: {
    vote() {
        if (!this.$store.getters['auth/isAuth']) {
      	  return this.$notify({title: 'Vote error', message: 'Authorization is required!', type: 'warning'})
        }

			  this.loading = true
        steem.broadcast.vote(
          this.wif, this.name, this.post.author,
          this.post.permlink, 10000, (err, res) => {
            err
              ? this.$notify({title: 'Vote error', message: err.message, type: 'warning'})
              : this.$notify({title: 'Voted', type: 'success'}); this.post.active_votes.push(res.operations[0][1])


            this.loading = false

            if (err) {
              Raven.captureMessage(err)
              console.log(err)
            }
        })
    }
  },

  components: {
    Round
  }
}

</script>

<style>
.voted {
  cursor: default;
}
</style>
