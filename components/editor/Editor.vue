<template lang="pug">
no-ssr
  div.mb-5
    .row
      .col-8
        .input-group
          .input-group-prepend
            .input-group-text Titile
          input(v-model="editor.title", placeholder="title").form-control

      .col-4.d-flex.flex-row-reverse
        // FIXME Only markdown for a while
        //div(v-show="editor.format == 'markdown'")
          button.btn.btn-secondary(@click="toggle_editor") HTML Редактор

        div(v-show="editor.format == 'html'")
          button.btn.btn-secondary(@click="toggle_editor") Markdown

        button.btn.btn-info(@click="clear").ml-auto Clear

    .row.mt-3
      .col
        div(v-show="editor.format == 'markdown'")
          textarea.form-control

        div(v-show="editor.format == 'html'")
          .quill-editor(
            v-quill:myQuillEditor="editorOptions",
            v-model="editor.html"
          )


    .row.mt-2
      .col.d-flex
        el-checkbox(v-model="withLocation") Include location

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
                  :closable="manageAppTags(index)"
                  :disable-transitions="false"
                  @close="handleClose(tag)") {{ tag }}

          el-input(class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm")

          el-button(v-else-if="editor.tags.length < 3"
                    class="button-new-tag" size="small" @click="showInput") + Add tag

          el-tooltip(v-if="editor.tags.length == 3" class="item" effect="dark" content="Publication type" placement="top")
            el-select(v-model="editor.tags[3]" placeholder="Publication type" size="small").ml-2
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
      withLocation: true,

      POST_TYPES: POST_TYPES,

      inputVisible: false,
      inputValue: '',

      editorOptions: {
        theme: 'snow',
        placeholder: 'Заголовок',
        bounds: '#write_text',
        modules: {
          toolbar: {
            container: [['bold', 'italic'], [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'align': [] }],
              [{ 'script': 'sub' }, { 'script': 'super' }], ['link'], ['video'],
              ['image'], ['blockquote'], ['clean']],
            handlers: {
              image: this.imageHandler
            }
          },
          clipboard: {
            matchVisual: false
          }
        }
      },
    }
  },

  computed: {
    ...mapState({
      editor: state => state.editor,
      account: state => state.auth.account
    }),

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
    var store = this.$store
    let SimpleMDE = await import('simplemde')
    var simplemde = new SimpleMDE({
      forceSync: true,
      autofocus: true,
      spellChecker: false,
      promptURLs: true,
      initialValue: this.editor.markdown,

      // TODO previewRender: 
	    //autosave: {
		  //  enabled: true,
      //  uniqueId: this.$route.params.permlink || 'default'
      //}
    })

    simplemde.codemirror.on("change", () => {
      this.editor.markdown = simplemde.value()
    })

    this.codemirror = simplemde.codemirror

		const oldEditorSetOption = simplemde.codemirror.setOption

		simplemde.codemirror.setOption = function(option, value) {
      oldEditorSetOption.apply(this, arguments);

      if (option === 'fullScreen') {
        store.dispatch('showTopToggle')
      }
		}
  },

  methods: {
    manageAppTags(index) {
      let tagsCount = this.editor.tags.length

      if (index < 4 && tagsCount <= 3) {
        return true
      } else if (index == 3 && tagsCount == 4) {
        return true
      } else {
        false
      }
    },

    imageHandler () {
      const range = this.myQuillEditor.getSelection()
      const value = prompt('What is the image URL')
      this.myQuillEditor.insertEmbed(range.index, 'image', value)
    },

    async uploadImage (e) {
      this.image_loading = true
      e.preventDefault()

      const formData = new FormData()
      formData.append('file', this.$refs.inputImage.files[0])

      try {
        const imgUrl = await uploadImage(this.$refs.inputImage.files[0], this.$store.state.auth)

        if (this.editor.format == 'markdown') {
          this.codemirror.getDoc().setValue(`${this.editor.markdown}\n![${this.editor.title}](${imgUrl})`)
        } else {
          this.editor.html += `\n<img src="${imgUrl} alt="${this.editor.title}">`
        }

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
    },

    async _submit() {
      if (!this.editor.title) return this.$message.warning('Title is empty')
      if (!this.editor[this.editor.format]) return this.$message.warning('Body is empty')
      if (this.withLocation && !this.editor.location.properties.name) return this.$message.warning('Location is empty')
      if (!this.editor.tags[1]) return this.$message.warning('Select publication type tag!')

      this.loading = true

      try {
        await this.submit()

        this.$alert('Your post will appear in the feed for a one minute.', 'Published', {
          confirmButtonText: 'OK',
          callback: () => this.$router.push({ name: 'index'})
        })
      } catch (e) {
        console.log(e)
        this.$notify.error({
          title: 'Error',
          message: JSON.stringify(e)
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
