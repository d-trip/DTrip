<template lang="pug">
div
  .row
    .col
      el-checkbox(false-label="no" true-label="yes" v-model="profile.accepting_guests") Accepting Guests
      el-checkbox(false-label="no" true-label="yes" label="Wants to Meet Up", v-model="profile.wants_meet_up")
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

  computed: {
    ...mapGetters('auth', ['user']),
  },

  methods: {
    ...mapActions('auth', ['profileUpdate']),

    setLocation(location) {
      this.user.meta.profile.location = location.formatted_address
    },

    changeAcceptGuests(accepting_guests) {
      this.user.meta.profile.accepting_guests = accepting_guests
    },

    update() {
      this.profileUpdate()
      this.$emit('editingStop')
    }
  }
}
</script>
