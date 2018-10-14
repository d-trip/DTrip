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
import { mapGetters } from 'vuex'

import Round from '~/components/elements/svg/round.vue'

export default {
  props: ['post'],

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapGetters('auth', ['user']),

    isVoted() {
      return this.user ? !!this.post.active_votes.filter(v => v.voter == this.user.name).length : false
    },

    tpv() {
      return parseFloat(this.post.total_payout_value.replace(' SBD', ''))
             + parseFloat(this.post.pending_payout_value.replace(' SBD', ''))
    }
  },

  methods: {
    async vote() {
      if (!this.$store.getters['auth/user']) {
        return this.$notify({title: 'Vote error', message: 'Authorization is required!', type: 'warning'})
      }

      this.loading = true
      
      try {
        let err, res = await this.$steemconnect.vote(this.user.name, this.post.author, this.post.permlink, 10000)

        err
          ? this.$notify({title: 'Vote error', message: err.message, type: 'warning'})
          : this.$notify({title: 'Voted', type: 'success'}); this.post.active_votes.push(res.result.operations[0][1])
      } catch (e) {
        this.$notify({title: 'Vote error', message: e.error_description, type: 'warning'})
        Raven.captureMessage(e)
      } finally {
        this.loading = false
      }
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
