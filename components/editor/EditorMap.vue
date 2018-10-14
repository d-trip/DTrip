<template lang="pug">
no-ssr
  .vue-map-container
    gmap-autocomplete(@place_changed="setCenter"
                      :value="marker.name"
                      :selectFirstOnEnter="true"
                      placeholder="Loaction search").vue-map-search.form-control#search

    gmap-map(
      :zoom="zoom",
      :options="options",
      :center="marker",
      ref="mmm",
      @click="moveMarker",
      map-type-id="terrain")

      gmap-marker(
        :position="marker",
        :draggable="true",
        @dragend="dragend"
      )

      //gmap-polygon(:paths="paths" :editable="true" @paths_changed="updateEdited($event)")

</template>

<script>
export default {
  props: {
    marker: {
      type: Object,
      default: () => ({ name: '', lat: 40, lng: -70})
    }
  },

  data() {
    return {
      zoom: 4,

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
					this.$emit('locationUpdated', {
							properties: {
                // TODO Add country code
								name: r.formatted_address,
							},

							geometry: {
								type: 'Point',
								coordinates: [
									marker.latLng.lng(),
									marker.latLng.lat(),
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

      this.$emit('locationUpdated', {
          properties: {
            // TODO Add country code
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
