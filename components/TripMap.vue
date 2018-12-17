<template lang="pug">
div(v-loading="loading")
  gmap-autocomplete(@place_changed="setCenter"
                    :selectFirstOnEnter="true"
                    placeholder="Loaction search").vue-map-search.form-control#search
  gmap-map(
    :options="options",
    :center="center",
    :zoom="4",
    ref="mmm",
    @idle="updateMarkers",
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
        :options="marker.options"
        @click="open_modal(...marker.options.meta.split('/'))"
        @mouseover="openInfoWindow(marker)",
        @mouseout="infoWindow.opened = false",
        )

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
      .info-window(v-loading="clusterLoading")
        div(v-for="(post, index) in clusterWindow.posts")
          nuxt-link.name(:to="{name: 'account', params: {account: post.author}}") @{{ post.author }}  
          a(href="#" @click="open_modal(post.author, post.permlink)") {{ post.title }}
          hr(v-if="index != clusterWindow.posts.length - 1")

    gmap-info-window(
      :options="infoWindow.options",
      :opened="infoWindow.opened",
      :position="infoWindow.position",
      @closeclick="infoWindow.opened=false"
    )
      p.leader {{ infoWindow.marker.title }}

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
    },

    search: {
      type: String,
      default: ''
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
            height: -45
          }
        },
        position: {
          lat: 0.0,
          lng: 0.0
        },
        opened: false,
        marker: {}
      },

      options: map_options,

      post_markers: [],
      swm_markers: [], // SteemitWorldMap
			account_markers: [],

      loading: true,
      clusterLoading: true,
    }
  },

  // async created() {
  //   this.loading = true

  //   try {
  //     await this.swmFetch()
  //   } finally {
  //     this.loading = false
  //   }
  // },

  computed: {
    ...mapState({
      'markers': state => state.map.markers
    })
  },

  watch: {
    search(search) {
			this.loading = true

      axios.get(`${process.env.API_URL}/posts/`, {
        params: {
          where: {
            "geo.geometry.coordinates": {"$ne": null},

            $text: this.search ? { $search: search } : undefined,
          },

          max_results: 1000,
          // sort: "-sp",
        }
      }).then(r => this.swm_markers = this.itemsToMarkers(r.data._items))
				.finally(() => this.loading = false)
    }
  },

  methods: {
    ...mapActions({
      'fetch_markers': 'map/fetch_markers'
    }),

		itemsToMarkers(items) {
			return items.map(i => {
        return {
          title: i.title,
          options: {meta: `${i.author}/${i.permlink}`},
          position: {
            lat: i.geo.geometry.coordinates[1],
            lng: i.geo.geometry.coordinates[0],
          },
        }
      })
		},

    async updateMarkers() {
      let bounds = this.$refs.mmm.$mapObject.getBounds()
      await this.swmFetch(bounds)
      this.loading = false
    },

    async swmFetch(bounds = false) {
      let lb = bounds.getSouthWest()
      let ur = bounds.getNorthEast()

      let {data: { _items, _meta }} = await axios.get(`${process.env.API_URL}/posts`, {
        params: {
          where: {
            "author": this.account ? this.account : undefined,
            "geo.geometry.coordinates": !this.account && bounds ? {
              "$geoWithin": {
                "$box": [
                    [lb.lng(), lb.lat()],
                    [ur.lng(), ur.lat()]
                ]
              }
            } : {"$ne": null},

            $text: this.search ? { $search: this.search } : undefined,
          },

          max_results: 1000,
        }
      })

      this.swm_markers = this.itemsToMarkers(_items)
    },

    async clusterClick(cluster) {
      this.clusterWindow.posts = []
      this.clusterLoading = true
      this.clusterWindow.opened = true
      this.clusterWindow.position = cluster.center_

      let markers = cluster.getMarkers()

      this.clusterWindow.posts = await Promise.all(markers.map(m => getContent(...m.meta.split('/'))))
      this.clusterLoading = false
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

    openInfoWindow (marker) {
      this.infoWindow.opened = true
      this.infoWindow.marker = marker

      this.infoWindow.position = marker.position
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
  },

  components: {
    GmapCluster
  }
}

</script>

<style scoped>
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
    font: 700 16px/20px PT Sans !important;
    letter-spacing: -.5px !important;
    color: #6d9ee1 !important;
}

.info-window {
	padding: 20px;
  overflow: scroll !important;
  min-height: 120px !important;
  min-width: 400px !important;
  max-height: 200px !important;
  z-index: 300;
}

</style>
