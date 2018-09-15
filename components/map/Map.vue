<template lang="pug">
div
  .vue-map-container
    //gmap-autocomplete(@place_changed="setCenter"
                      :selectFirstOnEnter="true"
                      placeholder="Поиск локации").vue-map-search.form-control#search
    gmap-map(
      :zoom="4",
      :center="{lng: 0, lat: 0}",
      ref="mmm",
      map-type-id="terrain")
</template>
