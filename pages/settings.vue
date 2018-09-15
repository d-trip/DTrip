<template lang="pug">
.container.mt-5

  p wif: {{ wif }}
  p name: {{ name }}

  .input-group
    input(v-model="name_", placeholder="name").form-control
    input(v-model="wif_", placeholder="WIF").form-control
    span.input-group-btn
      button.btn.btn-secondary(@click="test") Добавить


</template>

<script>
import { required, minLength, between } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'

import steem from 'steem'


export default {
  computed: {
    ...mapState({
      wif: state => state.account.wif,
      name: state => state.account.name,
    })
  },

  data() {
    return {
      wif_: '',
      name_: ''
    }
  },

  methods: {
    test() {
      try {
        this.$store.commit('account/SET_WIF', this.wif_)
        this.$store.commit('account/set_name', this.name_)
      } catch (e) {
        alert(e)
      }
    },
    
    lol() {
      //this.$store.commit('account/set_test', 'loll')
      //golos.broadcast.accountUpdate(this.$store.state.account.wif, //'5KLvM8HRHN9XsQNMBsbUmj9g2SBxJKdUSBuWNdqxhCphk8ceSNz',
      //  this.$store.state.account.name, undefined, undefined, undefined,
      //  'GLS7h8cV4zebGyxLkEYYPUCSnAVTi4FNARR1ckdtaaoXwbUEqF2zX', {test: 'лол тест', nerd: {gh: 94}}, function(err, result) {
      //  console.log(err, result);
      //})
      golos.broadcast.customJson(this.$store.state.account.wif, //'5KLvM8HRHN9XsQNMBsbUmj9g2SBxJKdUSBuWNdqxhCphk8ceSNz',
        [], [this.$store.state.account.name], 'test',

        JSON.stringify({test: 'лол тест', nerd: {gh: 94}}), function(err, result) {
      })
    }
  }
}

</script>

<style>
</style>
