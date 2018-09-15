<template lang="pug">
.container.mt-5
  no-ssr
    .row.justify-content-center(v-if="$store.getters['auth/isAuth']")
      form.col-md-6.text-center
        img(src="@/assets/img/mapala-logo.png", width="100", height="100").mb-3
        h1.h3 Авторизация
        p.text-muted.lead Вы авторизоавнны

    .row.justify-content-center(v-else)
      form.col-md-6.text-center
        img(src="@/assets/img/mapala-logo.png", width="100", height="100").mb-3
        h1.h2 Авторизация
        p.text-muted.lead Mapala работает на блокчейне 
          a(href="https://golos.io", target="_blank")
            img(src="https://golos.io/favicon.ico", height="15")
            | Golos
        hr
        .mb-2
          | Для авторизации вам необходимо иметь аккаунт в блокчейне GOLOS
          br
          | Авторизируйтесь с помощью POSTING ключа
        //hr
        .input-group.mb-2
          .input-group-prepend
            span.input-group-text
              i.fa.fa-user-o
          // TODO При вводе аккаунта показывать кнопку для быстрого перехода к ключам
          input.form-control(placeholder="Golos.io account name", v-model="account")
        .input-group.mb-3
          .input-group-prepend
            span.input-group-text
              i.fa.fa-shield
          input.form-control(placeholder="Golos.io POSTING key", v-model="wif")
        
        el-button(type="info" :loading="loading" @click="auth").w-100 Авторизоваться

        hr
        //p.lead Помощь
        ul.list-unstyled.text-small.text-left
          // TODO Здесь написать гайды на сайте самом
          li
            a(href="https://golos.io/create_account", target="_blank") Где зарегистрироваться?
            |  Обязательно сохраните пароль!

          div.mt-2
            img(src='https://imgp.golos.io/0x0/https://i.imgsafe.org/d1b8f9e4d2.jpg' style="width: 100%;")
            strong Чтобы получить свой приватный постинг ключ для Голос (он же Posting WiF)
            p Зайдите в свой блог на Голосе. Нажмите кнопку "Кошелек" - затем кнопку "Разрешения" - затем кнопку справа от первого абзаца (где Постинг ключ) "Показать приватный ключ".
            p




</template>

<script>
import { mapActions } from 'vuex'
import loadingButton from '@/components/elements/loading-button.vue'
import PostModal from '~/components/post/PostModal.vue'


export default {
  layout: 'full-width',

  data() {
    return {
      account: '',
      wif: '',
      loading: false
    }
  },
  components: {
    loadingButton
  },

  open_modal(marker) {
    this.$modal.show(PostModal, {author: marker.author, permlink: marker.permlink}, {
      height: 'auto',
      width: '60%',
      scrollable: true,
      classes: ['v--modal', 'post-modal']
    })
  },

  //created() {
  //  if(this.$store.getters['auth/isAuth']) {
  //    this.$router.back()
  //  }
  //},

  methods: {
    ...mapActions({
      'authorization': 'auth/authorization'
    }),

    async auth() {
      this.loading = true

      try {
        await this.authorization({ wif: this.wif, account: this.account })
        this.$router.push({name: 'index'})
      } catch (e) {
        this.$notify.warning({ title: 'Error', message: e.message })
      } finally {
        this.loading = false
      }
    }
  }
}

</script>
