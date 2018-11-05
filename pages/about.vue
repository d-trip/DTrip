<template lang="pug">
  .container
    h1.text-center.mt-3.display-1 About DTrip

    .text-center
      | DTrip is an app which helps travelers to share their impressions, favorite places, reviews and get rewarded for it.
      hr
      | This is a decentralized application running on the STEEM blockchain and the IPFS file storage.
      hr
      | User publications can be rewarded in STEEM cryptocurrency.


      h1.mt-3.display-4 Tehnologies
      .row.mt-2
        .col
          img(src="/logos/steem-logo.png" height="100")

          p 
            b STEEM 
            | for receiving rewards for publications and economics inside the app.
        .col
          img(src="/logos/AskSteem_Logo_v3.png" height="100")

          p
            b AskSteem 
            | for quick search of publications.
        .col
          img(src="/logos/ipfs.png" height="100")

          p
            b IPFS 
            |  for servering dapp and store media files.
        .col
          img(src="/logos/steemconnect.png" height="100")

          p
            b SteemConnect 
            | for authorization STEEM accounts.
</template>

<script>
export default {
  layout: 'full-width',
}
</script>
