<template lang="pug">
div
  .row
    .col(v-if="profile.accepting_guests == 'yes'")
      i.el-icon-success.name  Accepting Guests
    .col(v-if="profile.wants_meet_up == 'yes'")
      i.el-icon-info.name  Wants to meet up

  .row.mt-1
    .col
      .lead(v-if="profile.about").mb-1
        | {{ profile.about }}
</template>

<script>
export default {
  props: ['profile']
}
</script>
