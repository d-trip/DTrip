<template lang="pug">
  .user-card.mb-3
    nuxt-link.card-link(:to="{name: 'account', params: {account: account.name}}").d-flex
      img.avatar-image(:src="account.name | avatar('big')").user-image

      .user-info.ml-3
        .name.lead {{ account.name }}

        .text-muted.small
          | last activity: {{ account.last_post | formatDate }}

        .span(v-if="account.profile.accepting_guests == 'yes'")
          i.el-icon-success.name  Accepting Guests
        .span(v-if="account.profile.wants_meet_up == 'yes'")
          i.el-icon-info.name  Wants to meet up

        //span.text
          b 3 
          | References

    .mt-3(v-if="account.profile.about")
      | {{ account.profile.about }}


    .location(v-if="account.profile.location").mb-1.mt-3
      | {{ account.profile.location }}
</template>

<script>
import About from '~/components/account/About'

export default {
  props: ['account'],

  components: {
    About
  }
}
</script>

<style>
.name {
  font: PT Sans;
}

.user-card {
  padding: 20px 20px 15px 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
  border: 1px solid rgba(72, 84, 101, .2);
}

.user-image {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}

.user-info {
  padding: 5px;
}
</style>
