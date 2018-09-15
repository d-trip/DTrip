<template lang="pug">
no-ssr
  .vue-map-container
    gmap-autocomplete(@place_changed="setCenter"
                      :selectFirstOnEnter="true"
                      placeholder="Поиск локации").vue-map-search.form-control#search

    gmap-map(
      :zoom="zoom",
      :options="options",
      :center="center",
      ref="mmm",
      map-type-id="terrain")

      gmap-marker(
        :position="marker",
        :draggable="true",
        @dragend="dragend"
        icon="https://mapala.net/pointer.png"
      )

      //gmap-polygon(:paths="paths" :editable="true" @paths_changed="updateEdited($event)")

</template>

<script>
export default {
  data() {
    return {
      zoom: 4,

      //paths: [
      //  [ {lat: 40.382, lng: -70.802}, {lat: 40.382, lng: -70.808}, {lat: 40.388, lng: -70.808}, {lat: 40.388, lng: -70.802} ],
      //],

      center: {
        lat: 40,
        lng: -70
      },

      marker: {
        lat: 40,
        lng: -70
      },

      options: {
        minZoom: 1,
        //mapTypeControl: false,
        fullscreenControl: false,

        mapTypeControlOptions: {
          position: 11,
          mapTypeIds: [
            'roadmap',
            'satellite'
          ]
        },

        gestureHandling: 'greedy',
      }
    }
  },

  methods: {
    dragend(marker) {
      this.center = {
        lat: marker.latLng.lat(),
        lng: marker.latLng.lng()
      }

			let geocoder = new google.maps.Geocoder()
      geocoder.geocode({
        'latLng': new google.maps.LatLng(this.center.lat, this.center.lng)
      }, r => {
        r = r[0]

        if (r) {
					this.$emit('locationUpdated', {
							properties: {
								name: r.formatted_address,
							},

							geometry: {
								type: 'Point',
								coordinates: [
									r.geometry.location.lat(),
									r.geometry.location.lng()
								]
							}
						}
					)
        }
      })
    },

    setCenter(location) {
      if(!location.geometry) return

      this.zoom = 15
      this.center = {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng(),
      }

      this.marker = this.center

      this.$emit('locationUpdated', {
          properties: {
            name: location.formatted_address,
          },

          geometry: {
            type: 'Point',
            coordinates: [
              location.geometry.location.lat(),
              location.geometry.location.lng()
            ]
          }
        }
      )
    },
  },
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
<style>
