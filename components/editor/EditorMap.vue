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
    // TODO Refactoring is important
    moveMarker(location) {
      this.dragend(location)
    },

    dragend(marker) {
			let geocoder = new google.maps.Geocoder()
      geocoder.geocode({
        'latLng': marker.latLng
      }, r => {
        if (!(r && r[0])) return
        let location = r[0]

        location.geometry.location.lng = () => marker.latLng.lng()
        location.geometry.location.lat = () => marker.latLng.lat()

        this.setCenter(location)
      })
    },

    setCenter(location) {
      if(!location.geometry) return
      this.zoom = 15

      var filtered_array = location.address_components.filter(address_component => {
          return address_component.types.includes("country")
      })

      var country = filtered_array.length ? filtered_array[0].short_name: ""

      this.$emit('locationUpdated', {
          properties: {
            name: location.formatted_address,
            country: country,
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
</style>
