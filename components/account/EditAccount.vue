<template lang="pug">
div
  .row
    .col
      el-checkbox(v-model="profile.accepting_guests") Accepting Guests
  .row
    .col
      label Loaction:
      gmap-autocomplete(:value="user.meta.profile.location"
                        @place_changed="setLocation"
                        :selectFirstOnEnter="true").el-input__inner

  .row.mt-2
    .col
      el-button(@click="update" size="small").w-100 Update
</template>


<script>
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      profile: {}
    }
  },

  created() {
    this.profile = this.user.meta.profile
  },

  watch: {
    profile: {
      handler(lol, b, c) {
        console.log(lol, b, c)
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters('auth', ['user']),
  },

  methods: {
    ...mapActions({
      'setLocation': 'auth/setLocation'
    }),

    changeAcceptGuests(accepting_guests) {
      this.user.meta.profile.accepting_guests = accepting_guests
    },

    update() {
      console.log(Object.entries(this.user.meta.profile).map(([key, val]) => `${key}=${val}`).join('&'))
      //axios.get('https://steemconnect.com/sign/profile-update', {params: this.user.meta.profile})

      this.$emit('editingStop')
    }
  }
}
</script>
