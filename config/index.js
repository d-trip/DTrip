// TODO move to env
const app_tags = process.env.PROD ? ['dtrip'] : ['dtrip-test']

export default {
  app: 'dtrip/0.1',
  app_tags: app_tags, // Posting to first tag
  tag_for_post: app_tags[0],
  pagination: 10,

  img_proxy_prefix: 'https://steemitimages.com/',
  API_QL_URL: process.env.API_QL_URL || 'http://127.0.0.1:5000/graphql',

  baseURI: 'https://dtrip.app/',
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

