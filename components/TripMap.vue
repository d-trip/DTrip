<template lang="pug">
div(v-loading="loading")
  gmap-autocomplete(@place_changed="setCenter"
                    :selectFirstOnEnter="true"
                    placeholder="Loaction search").vue-map-search.form-control#search
  gmap-map(
    :options="options",
    :center="center",
    :zoom="4",
    @idle="updateMarkers",
    ref="mmm",
    map-type-id="terrain")

    gmap-marker(
      v-for="marker in post_markers",
      :key="marker.permlink",
      :position="{lat: marker.meta.location.geometry.coordinates[1], lng: marker.meta.location.geometry.coordinates[0] }",
      :clickable="true",
      :draggable="false",
      @click="open_modal(marker.author, marker.permlink)"
      @mouseover="openInfoWindow(marker, 'post')",
      @mouseout="infoWindow.opened = false",
      )

    gmap-cluster(@click="clusterClick" :zoomOnClick="false" :gridSize="gridSize")
      gmap-marker(
        v-for="marker in swm_markers",
        :key="marker.permlink",
        :title="marker.title"
        :position="marker.position",
        :clickable="true",
        :draggable="false",
        @click="open_modal(...marker.title.split('/'))"
        )

    //
      @mouseover="openInfoWindow(marker, 'post')",
      @mouseout="infoWindow.opened = false",


    gmap-marker(
      v-for="marker in account_markers",
      :key="marker.name",
      :position="marker.coords",
      :clickable="true",
      :draggable="false",
      :icon="marker.icon"
      @click="$router.push({name: 'account', params: { account: marker.name }})"
      @mouseover="openInfoWindow(marker, 'account')",
      @mouseout="infoWindow.opened = false",
      )

    // For cluster View
    gmap-info-window(
      :options="clusterWindow.options",
      :opened="clusterWindow.opened",
      :position="clusterWindow.position",
      @closeclick="clusterWindow.opened = false")
      div(v-for="(post, index) in clusterWindow.posts")
        a(href="#" @click="open_modal(post.author, post.permlink)") {{ post.title }}
        hr(v-if="index != clusterWindow.posts.length - 1")

    gmap-info-window(
      :options="infoWindow.options",
      :opened="infoWindow.opened",
      :position="infoWindow.position",
      @closeclick="infoWindow.opened=false"
      )
      div(v-html="infoWindow.content")


</template>

<script>
import axios from 'axios'
import xml from 'xml-js'

import { map_options } from '@/config'
import { mapActions, mapState } from 'vuex'
import PostModal from '~/components/post/PostModal.vue'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import { getContent } from '~/utils/steem'


export default {
  props: {
    account: {
      type: String,
      default: ''
    },

    gridSize: {
      type: Number,
      default: undefined
    }
  },

  data() {
    return {
      zoom: 4,
      center: {
        lat: 48,
        lng: 30
      },

      clusterWindow: {
        posts: [],

        options: {
          maxWidth: 400,
          maxHeight: 100,
        },
        position: {
          lat: 0.0,
          lng: 0.0
        },
        opened: false,
      },

      infoWindow: {
        options: {
          maxWidth: 250,
          pixelOffset: {
            width: 0,
            height: -52
          }
        },
        position: {
          lat: 0.0,
          lng: 0.0
        },
        opened: false,
        content: ''
      },

      options: map_options,

      post_markers: [],
      swm_markers: [], // SteemitWorldMap
			account_markers: [],

      loading: false
    }
  },

  async created() {
    // Now SteemitWorldMap only for account page
    this.loading = true
    if (this.account) {
      await this.swmFetch()
    } else {
      await this.fetch_posts()
    }
    this.loading = false
  },

  computed: {
    ...mapState({
      'markers': state => state.map.markers
    })
  },

  methods: {
    ...mapActions({
      'fetch_markers': 'map/fetch_markers'
    }),

    async swmFetch() {
      let q = `https://www.steemitworldmap.com/PHP/search.php?author=${this.account}`
      let r = await axios.get(q)

      var parser = new DOMParser();
      var doc = parser.parseFromString(r.data, "application/xml");
      this.swm_markers = [...doc.getElementsByTagName('marker')].map(m => {
        return {
          title: m.getAttribute('postLink').split('@')[1],
          position: {
            lat: parseFloat(m.getAttribute('lattitude')),
            lng: parseFloat(m.getAttribute('longitude'))
          },
        }
      })
    },

    async clusterClick(cluster) {
      this.clusterWindow.opened = true
      //this.clusterWindow.position = {lat: cluster.center.lat(), lng: cluster.center.lng()}
      this.clusterWindow.position = cluster.center_
      let markers = cluster.getMarkers()

      this.clusterWindow.posts = await Promise.all(markers.map(m => getContent(...m.title.split('/'))))
    },

    async fetch_posts() {
      // TODO Fetching by bbox with geohashes
      let q = 'https://api.asksteem.com/search?q=meta.app:dtrip AND meta.location.geometry.type:Point&include=meta'

      let requests = []
      for (let i = 1; i < 11; i++) {
        requests.push(axios.get(q + `&pg=${i}`))
      }

      requests = await Promise.all(requests)
      this.post_markers = [].concat(...requests.map(r => r.data.results))
    },

    setCenter(location) {
      if(!location.geometry) return

      this.zoom = 10
      this.center = {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng(),
      }
    },

    openInfoWindow (marker, type) {
      this.infoWindow.opened = true

      if (type == 'post') {
        console.log(12)
        this.infoWindow.content = `<h6>${marker.title}</h6>`

        this.infoWindow.position = {
          lat: marker.meta.location.geometry.coordinates[1],
          lng: marker.meta.location.geometry.coordinates[0]
        }
      } else {
        this.infoWindow.content = `Здесь сейчас находится <span class="name">@${marker.name}</span>`

        this.infoWindow.position = marker.coords
      }

      this.infoWindow.options.maxWidth = 180
    },

    async open_modal(author, permlink) {
      this.$modal.show(PostModal, {author: author, permlink: permlink}, {
        height: 'auto',
        width: '60%',
        scrollable: true,
        classes: ['v--modal', 'post-modal']
      })
    },

    async updateMarkers() {
      // TODO Implement Filre
    }
  },

  components: {
    GmapCluster
  }
}

</script>

<style>
.vue-map-search {
    z-index: 999;
    position: absolute;
    width: 90%;
    margin: auto;
    top: 18px;
    left: 0px;
    right: 0px;
}

.name {
    font: 700 16px/20px PT Sans;
    letter-spacing: -.5px;
    color: #6d9ee1;
}
</style>
