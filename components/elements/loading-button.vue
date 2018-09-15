<template lang="pug">
  button(@click="$emit('click')", :disabled="loading")
    i.fa.fa-spinner.fa-spin(v-show="loading")
    slot
</template>

<script>
export default {
  props: ['loading']
}

</script>
