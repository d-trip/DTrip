<template lang="pug">
  .container
    h1.text-center.mt-3.display-1 FAQ

    h1 How to authorize?
    p
      | Just click to 
      b login 
      | button on top of site. And Follow the steemconnect  instructions.

    h1 Where can I get an account?
    //img(src="/logos/steem-logo.png" height="100")
    p
      | If you do not have a STEAM account, you can register new one on  
      a(href="https://steemhunt.com/sign-up" target="_blank") SteemHunt 
      | or 
      a(href="https://signup.steemit.com/" target="_blank") Steemit


    h1 How to write publication
    p Log in, after that go to main page and click 
      b Create a publication 
      | button.
</template>

<script>
export default {
  layout: 'full-width',
}
</script>
