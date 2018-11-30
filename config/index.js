// TODO move to env
//const app_tags = process.env.PROD ? ['dtrip'] : ['dtrip-test']
const app_tags = ['dtrip']

let BASE_URL = process.env.BASE_URL

if (process.env.isSPA) {
  BASE_URL = location.href.split('/#/')[0] + "/#/"
}


export default {
  BASE_URL,

  app: 'dtrip/0.1',
  app_tags: app_tags, // Posting to first tag
  tag_for_post: app_tags[0],
  limit: 50,

  img_proxy_prefix: 'https://steemitimages.com/',
  AUTH_CALLBACK: BASE_URL + 'auth',
}

export const map_options = {
  minZoom: 4,
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControlOptions: {
    position: null
  },
  streetViewControlOptions: {
    position: null
  },
  gestureHandling: 'greedy',

  styles: [
    {
      'stylers': [
        {
          'hue': '#007fff'
        },
        {
          'saturation': 89
        }
      ]
    },
    {
      'featureType': 'water',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'administrative.country',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    }
  ]
}

