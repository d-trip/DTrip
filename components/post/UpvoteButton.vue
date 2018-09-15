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
      tpv: 0,
      loading: false,

      votes: []
    }
  },

  computed: {
    ...mapState({
      wif: state => state.auth.wif,
      name: state => state.auth.account.name,
    }),

    isVoted() {
      return !!this.votes.filter(v => v.voter == this.name).length
    }
  },

  mounted() {
    this.getVotes()
  },

  methods: {
    async getVotes() {
      let r = await steem.api.getContentAsync(this.post.author, this.post.permlink)

      this.votes = r.active_votes

      this.tpv = parseFloat(r.total_payout_value.replace(' STEEM', ''))
               + parseFloat(r.total_pending_payout_value.replace(' STEEM', ''))
    },

    vote() {
        if (!this.$store.getters['auth/isAuth']) {
      	  return this.$notify({title: 'Vote error', message: 'Авторизируйтесь!', type: 'warning'})
        }

			  this.loading = true
        golos.config.set('websocket', 'wss://ws18.golos.io')
        golos.broadcast.vote(
          this.wif, this.name, this.post.author.name,
          this.post.permlink, 10000, (err, res) => {
            err
              ? this.$notify({title: 'Vote error', message: err.message, type: 'warning'})
              : this.$notify({title: 'Voted', type: 'success'});
                this.getVotes()


            this.loading = false

            if (err) {
              Raven.captureMessage(err)
              console.log(err)
            }
        })
      

			//try {


      //	this.post.isVoted = true
      //	this.$notify({title: 'Voted', type: 'success'})
			//} catch (e) {
      //	this.$notify({title: 'Vote error', message: e.message, type: 'error'})
			//} finally {
			//	this.loading = false
			//}
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
