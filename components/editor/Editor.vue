<template lang="pug">
// TODO IMPORTANT!! Format rewards 50/50, 100%
no-ssr
  div.mb-5
    .row
      .col-8
        .input-group
          .input-group-prepend
            .input-group-text Titile
          input(v-model="editor.title", placeholder="title").form-control

      .col-4.d-flex.flex-row-reverse
        button.btn.btn-info(@click="clear").ml-auto Clear

    .row.mt-3
      .col
        textarea.form-control

    .row.mt-2
      .col.d-flex
        el-checkbox(v-model="withLocation")
          span
            | Include location
            | (Integrated with 
            img(:src="'steemitworldmap' | avatar" height="15")
            a(href="https://steemitworldmap.com" target="_blank") SteemitWorldMap
            | )

          // Image uploader
        el-button(:loading="image_loading"
                  @click="imageUploadHandler"
                  size="small"
                  icon="el-icon-upload").ml-auto Upload image
    .row.mt-2
      .col
        EditorMap(v-show="withLocation" @locationUpdated="locationUpdated", :marker="marker").editor-map


    .row.mt-3
      .col
        .d-flex
          el-tag(:key="index"
                  v-for="(tag, index) in editor.tags"
                  :closable="true"
                  :disable-transitions="false"
                  @close="handleClose(tag)") {{ tag }}

          el-input(class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm")

          // TODO Implement situation when dtrip tag is already added
          el-button(v-else-if="editor.tags.length < 4"
                    class="button-new-tag" size="small" @click="showInput") + Add tag

          el-tooltip(v-if="!typeSelected && editor.tags.length > 0 && editor.tags.length < 5"
                     class="item" effect="dark" content="Publication type" placement="top")
            el-select(v-model="editor.tags[editor.tags.length]" placeholder="Publication type" size="small").ml-2
              el-option(v-for="item in POST_TYPES" :key="item.value" :label="item.label" :value="item.value")


        .row.mt-3
          .col
            el-button(type="primary" @click="_submit", :loading="loading") Publish
      
        // Cкрытый инпут для аплоада картинки
        input(ref="inputImage", @change="uploadImage", hidden, type="file")

</template>

<script>
// FIXME Где то баг може быть в clear прервыается после печатания первой буквы
import { mapState, mapActions, mapMutations } from 'vuex'
import { uploadImage } from '~/utils/steem'
import EditorMap from '~/components/editor/EditorMap.vue'
import { POST_TYPES } from '~/constants'
import geohash from 'geo-hash'

export default {
  layout: 'full-width',

  components: {
    EditorMap
  },

  data() {
    return {
      loading: false,
      image_loading: false,
      codemirror: null,
      withLocation: false, // FIXME Depends on exist location or no,

      POST_TYPES: POST_TYPES,

      inputVisible: false,
      inputValue: '',
      simplemde: null,
    }
  },

  computed: {
    ...mapState({
      editor: state => state.editor,
      user: state => state.auth.user
    }),

    typeSelected() {
      return this.editor.tags.some(r => this.POST_TYPES.map(t => t.value).includes(r))
    },

    marker() {
      if (this.editor && this.editor.location && this.editor.location.geometry.coordinates[0]) {
        return {
          lng: this.editor.location.geometry.coordinates[0],
          lat: this.editor.location.geometry.coordinates[1],
          name: this.editor.location.properties.name
        }
      }
    },
  },

  async created() {
    if (!this.$store.getters['auth/user']) return this.$router.push({name: 'index'})

    await this.$store.dispatch('editor/setPost')

    this.withLocation = !!(this.editor && this.editor.location && this.editor.location.geometry.coordinates[0])
    console.log(this.withLocation)

    let SimpleMDE = await import('simplemde')
    var simplemde = new SimpleMDE({
      forceSync: true,
      autofocus: true,
      spellChecker: false,
      promptURLs: true,
      initialValue: this.editor.body,

      // TODO Insert imge in cursor position
      hideIcons: ['image'],

      // TODO previewRender: 
	    //autosave: {
		  //  enabled: true,
      //  uniqueId: this.$route.params.permlink || 'default'
      //}
    })
    this.simplemde = simplemde

    simplemde.codemirror.on("change", () => {
      this.editor.body = simplemde.value()
    })

    this.codemirror = simplemde.codemirror

		const oldEditorSetOption = simplemde.codemirror.setOption

		simplemde.codemirror.setOption = function(option, value) {
      oldEditorSetOption.apply(this, arguments);

      if (option === 'fullScreen') {
        this.$store.dispatch('showTopToggle')
      }
		}
  },

  methods: {
    async uploadImage (e) {
      this.image_loading = true
      e.preventDefault()

      const formData = new FormData()
      formData.append('file', this.$refs.inputImage.files[0])

      try {
        const imgUrl = await uploadImage(this.$refs.inputImage.files[0], this.$store.state.auth)
        let pos = this.simplemde.codemirror.getCursor()
        this.simplemde.codemirror.setSelection(pos, pos)
        this.simplemde.codemirror.replaceSelection(`\n![${this.editor.title}](${imgUrl})`)
      } catch (e) {
        this.$notify({ message: e.message, type: 'warning' })
      } finally {
        this.image_loading = false
      }
    },

    imageUploadHandler () {
      this.$refs.inputImage.click()
    },

    ...mapMutations({
      clear: 'editor/clear',
      set_title: 'editor/set_title',
    }),

    ...mapActions({
      submit: 'editor/submit',
      toggle_editor: 'editor/toggle',
    }),

    handleClose(tag) {
      this.editor.tags.splice(this.editor.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.editor.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    locationUpdated(location) {
      let [lon, lat] = location.geometry.coordinates

      this.editor.geohash = geohash.encode(lat, lon)
      this.editor.location = location

      // TODO Description
      //theDescription = $("#blogCodeDescription").val();
      let stemit_wm_tag = `\n\n [//]:# (!steemitworldmap ${lat.toFixed(6)} lat ${lon.toFixed(6)} long ${''} d3scr)`

      // SteemitWorldMap integration
      if (this.editor.body.includes('[//]:# (!steemitworldmap ')) {
        this.editor.body = this.editor.body.replace(/.*\[\/\/\]:# \(!steemitworldmap.*?\)/gmi, stemit_wm_tag)
      } else {
        this.editor.body += stemit_wm_tag
      }

      this.codemirror.getDoc().setValue(this.editor.body)
    },

    async _submit() {
      if (!this.editor.title) return this.$message.warning('Title is empty')
      if (!this.editor[this.editor.format]) return this.$message.warning('Body is empty')
      if (this.withLocation && !this.editor.location) return this.$message.warning('Location is empty')
      // if (!this.editor.tags[1]) return this.$message.warning('Select publication type tag!')

      if (!this.withLocation) {
        this.editor.location = undefined
      }

      this.loading = true

      try {
        await this.submit()

        this.$router.push({ name: 'account', params: {account: this.user.name}})
        this.$notify.success('Published')
      } catch (e) {
        console.log(e)
        this.$notify.error({
          title: 'Error',
          message: e
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
  @import '~/node_modules/simplemde/dist/simplemde.min.css';

  .editor-preview img {
    width: 100%;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

.editor-map {
  height: 400px;
}
</style>
