<template lang="pug">
no-ssr
  .vue-map-container
    gmap-autocomplete(@place_changed="setCenter"
                      :value="locationName"
                      :selectFirstOnEnter="true"
                      placeholder="Поиск локации").vue-map-search.form-control#search

    gmap-map(
      :zoom="zoom",
      :options="options",
      :center="center",
      ref="mmm",
      @click="moveMarker",
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
      locationName: '',

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
    moveMarker(location) {
      this.dragend(location)
    },

    dragend(marker) {
			let geocoder = new google.maps.Geocoder()
      geocoder.geocode({
        'latLng': marker.latLng
      }, r => {
        if (!(r && r[0])) return
        r = r[0]

        this.locationName = r.formatted_address

        if (r) {
          this.center = {
            lat: marker.latLng.lat(),
            lng: marker.latLng.lng()
          }

          this.marker = this.center

					this.$emit('locationUpdated', {
							properties: {
								name: r.formatted_address,
							},

							geometry: {
								type: 'Point',
								coordinates: [
									this.center.lng,
									this.center.lat
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
              location.geometry.location.lng(),
              location.geometry.location.lat()
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
