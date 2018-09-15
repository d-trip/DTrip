// TODO В переменные окружения выносить это
//const app_tags = process.env.PROD ? ['mapala', 'ru--mapala'] : ['mapala-dev']
const app_tags = ['mapala']

 // TODO Может быть что то перенести в пользовательские настройки
export default {
  app: 'mapala/1.1',
  app_tags: app_tags, // Posting to first tag
  tag_for_post: app_tags[0],
  pagination: 10,

  img_proxy_prefix: 'https://imgp.golos.io/',
  API_QL_URL: process.env.API_QL_URL || 'http://127.0.0.1:5000/graphql',

  baseURI: 'https://golos.mapala.net/',
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

