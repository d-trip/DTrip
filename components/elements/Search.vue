<template lang="pug">
  el-input(:placeholder="placeholder"
           type="text"
           prefix-icon="el-icon-search"
           v-model="search"
          @keyup.enter.native="enter")
</template>


<script>
export default {
  props: ['placeholder'],

  data() {
    return {
      search: ''
    }
  },

  watch: {
    search(val) {
      if (val == '') {
        this.$emit('enter', val)
      }
    }
  },

  methods: {
    enter() {
      this.$emit('enter', this.search)
    }
  }
}
</script>
