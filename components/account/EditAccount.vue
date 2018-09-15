<template lang="pug">
  .edit-account
    //el-input(placeholder="Please input" v-model="input")
    gmap-autocomplete(:value="account.meta.mapalaProfile.location.properties.name", @place_changed="setLocation").form-control
    //el-input(placeholder="Местонахождение" suffix-icon="el-icon-location")
    // TODO Сделать локацию для юзера
</template>


<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  computed: mapState({ account: state => state.auth.account }),

  methods: {
    ...mapActions({
      'setLocation': 'auth/setLocation'
    })
  }
}
</script>
