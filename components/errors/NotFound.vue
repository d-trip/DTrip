<template lang="pug">
.page-wrap.d-flex.flex-row.align-items-center
  .container
    .row.justify-content-center
      .col-md-12.text-center
        span.display-1.d-block 404
        .mb-4.lead Страница которую вы ищите не найдена :(
        nuxt-link.btn.btn-link(:to="{name: 'index'}") На главную
</template>
