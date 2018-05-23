<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link class="panel-open" open-panel="left" icon="fa fa-bars"></f7-link>
      </f7-nav-left>
      <div class="title">Vinder</div>
        <f7-nav-right>
          <f7-link class="searchbar-enable" data-searchbar=".searchbar-components" icon="fa fa-search"></f7-link>
        </f7-nav-right>
        <f7-searchbar class="searchbar-components" search-container=".components-list" search-in="a" expandable></f7-searchbar>
      </f7-navbar>
    <f7-block strong v-if="showBack()"><f7-button round fill @click="goBack()">Go back</f7-button></f7-block>
    <f7-list>
        <f7-list-item v-for="(entry, index) in entries" :key="index" @click="getEntries(entry.nativeURL)">
          <f7-icon slot="media" f7="folder" v-if="entry.isDirectory"></f7-icon>
          <f7-icon slot="media" f7="document" v-if="entry.isFile"></f7-icon>
            {{entry.name}}
        </f7-list-item>
    </f7-list>

    <f7-fab color="pink">
    <!-- First icon is visible when Speed Dial actions are closed -->
    <f7-icon f7="add"></f7-icon>
    <!-- Second icon is visible when Speed Dial actions are opened -->
    <f7-icon f7="close"></f7-icon>

    <!-- Speed Dial Buttons -->
    <f7-fab-buttons>
      <f7-fab-button color="grey" @click="showPopover()"><f7-icon f7="folder"></f7-icon></f7-fab-button>
      <f7-fab-button color="grey" :href="cameraSelection"><f7-icon f7="camera"></f7-icon></f7-fab-button>
      <f7-fab-button color="grey" :href="photoPathSelection"><f7-icon f7="images"></f7-icon></f7-fab-button>
    </f7-fab-buttons>
    </f7-fab>
     <f7-popover :opened="showModal">
       <f7-block>
       <f7-list no-hairlines-md>
         <f7-list-item>
          <f7-label>Name</f7-label>
          <f7-input
          type="text"
          :value="name"
          @input="name = $event.target.value"
          placeholder="Directory name"
          clear-button
          ></f7-input>
          </f7-list-item>
        <f7-button fill color="pink" @click="createDirectory(name)">Create</f7-button>
       </f7-list>
      </f7-block>
    </f7-popover>
  </f7-page>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      parent: null,
      name: '',
      showModal: false,
      cameraSelection: `/detail/${Camera.PictureSourceType.CAMERA}`,
      photoPathSelection: `/detail/${Camera.PictureSourceType.PHOTOLIBRARY}`
    }
  },

  methods: {
    showPopover() {
      this.showModal = true
    },

    getEntries(path) {
      console.log(path, this.entries = this.$store.getters.getEntries)
      this.$store.dispatch('loadEntries', path)

    },

    createDirectory(dir) {
      this.$store.dispatch('createDirectory', dir)      
      if (!this.$store.getters.getCreateDirectoryErrors) {
        this.showModal = false
      }
    },
    showBack() {
      const currentFolder = this.$store.getters.getCurrentFolder
      if (!currentFolder) return false
      
      return currentFolder.nativeURL !== this.$store.getters.getMainFolder
    },
    goBack() {
      const parent = this.$store.getters.getParentFolder
      this.getEntries(parent.nativeURL)
    }
  },
  computed: {
    ...mapState({
      entries: state => state.entries
    })
  }
}
</script>
<style>
  .upload-picture-button {
    position: fixed;
    right: 24px;
    bottom: 155px;
    z-index: 15;
  }
  .popover {
    top: 40%;
    left: 20%;
  }
</style>
