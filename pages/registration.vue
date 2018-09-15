<template lang="pug">
no-ssr
  .container.mt-5
    //iframe(src="https://golos.io/create_account")
    //.row.justify-content-center(v-if="$store.getters['auth/isAuth']")
      form.col-md-6.text-center
        img(src="@/assets/img/mapala-logo.png", width="100", height="100").mb-3
        h1.h3 Регистрация
        p.text-muted.lead Вы авторизоавнны

    //.row.justify-content-center(v-else)
      form.col-md-6.text-center
        img(src="@/assets/img/mapala-logo.png", width="100", height="100").mb-3
        h1.h2 Регистрация
        p.text-muted.lead Mapala работает на блокчейне 
          a(href="https://golos.io", target="_blank")
            img(src="https://golos.io/favicon.ico", height="15")
            | Golos
        //.mb-2
          | Для авторизации вам необходимо иметь аккаунт в блокчейне GOLOS
          br
          | Авторизируйтесь с помощью POSTING ключа

    .row.justify-content-center
      .col-8.registration
        .row
          .col
            el-steps(:active='1' align-center)
              el-step(title='Шаг 1', description='Подтвердите номер телефона')
              el-step(title='Шаг 2', description='Придумайте пароль логин')
              el-step(title='Шаг 3', description='Сохраните данные от аккаунта')

        .row.justify-content-center.mt-4
          //.col-10(v-if="active == 1").justify-content-center
          .col-10.justify-content-center
            el-col
              vue-tel-input(v-model="phone"
                            @onInput="phoneInput"
                            :preferredCountries="['ru', 'by', 'ua']")



          //.col-10(v-if="active == 2").justify-content-center
            .callout
              .CreateAccount__send-sms-block
                | Пожалуйста, 
                b отправьте SMS с кодом 1297 на номер +79169306359
              div
                | Golos.io заинтересован в регистрации настоящих людей, а не роботов. Именно поэтому мы просим отправить нам SMS на указанный номер. Это система двойной проверки.
              .CreateAccount__hint-block
                span.CreateAccount__hint Сколько это будет стоить?
              p
                small
                  | Если вы ошиблись во время ввода своего номера телефона, вы можете ввести его заново. 
                  a Указать другой номер
                  | .
              div
                label.CreateAccount__check-section
                  input(type='checkbox')
                  | Я отправил СМС



</template>

<script>
//import InvisibleRecaptcha from 'vue-invisible-recaptcha'
import axios from 'axios'

const CSRF_URL = 'https://golos.io/create_account'
const SEND_CODE = 'https://golos.io/api/v1/send_code'
const CHECK_CODE = 'https://golos.io/api/v1/check_code'
const ACCOUNTS = 'https://golos.io/api/v1/accounts'


export default {
  data() {
    return {
      csrf: '',
      phone: '',
      country: 0,
      active: 0,
      code: 0,
    }
  },

  methods: {
    success(code) {
      this.recaptcha = code
      this.show_recaptcha = false
    },

    async sendCode() {
      let { data } = await axios.post('/api/v1/send_code', {
        'country': this.country,
        'phone': this.phone,
        'csrf': this.csrf
      })

      if (data.status == 'already_used') {
        return this.$notify.error({message: 'Номер телефона уже использовался', duration: 0})
      }

      this.code = data.code
      this.active = 2
    },

    async phoneInput({ number, isValid, country }) {
      if (isValid) {
        this.country = parseInt(country.dialCode)


        // TODO Тут сделать вызов по кнопке
        this.sendCode()
      } else {
        this.active = 0
      }
    }
  },

  components: {
    //InvisibleRecaptcha
  },

  async created() {
    let r = await axios.post('/create_account')
    this.csrf = r.data.match(/"csrf":"(.*)","new_visit"/)[1]
  },

  head() {
    return {
      script: [
        { src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit'}
      ]
    }
  }, }

</script>

<style>
.registration {
    background-color: whitesmoke;
    padding: 40px 0px;
}
</style>
