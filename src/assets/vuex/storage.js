import Vue from 'vue'
import Vuex from 'vuex'
import b64toBlob from '../js/base64tobob'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    entries: [],
    parentFolder: null,
    currentFolder: null,
    mainFolder: '',
    createdEntry: null,
    errors: []
  },
  actions: {
    setMainPath({commit}, path) {
      commit('setMainPath', path)
    },
    loadEntries ({commit, getters}, path) {
      window.resolveLocalFileSystemURL(path,
        (fileSystem) => {
          let data = {}
          const directoryReader = fileSystem.createReader()

          fileSystem.getParent((parentEntry) => {data.parent = parentEntry})
          data.current = fileSystem

          directoryReader.readEntries(
            (entries) => {
              data.entries = entries

              commit('loadEntries', data)
            },
            function(error) {
              commit('addError', {type: 'ENTRIES_ERROR', error: error})
            }
          )
        },
        function(error) {
          commit('addError', {type: 'FOLDER_URL_ERROR', error: error})
        }
      )
    },
    createFile({commit, getters}, payload) {
      const current = getters.getCurrentFolder
      current.getDirectory(payload.dir, { create: true },
        (dirEntry) => {
          commit('createEntry', dirEntry)

          const DataBlob = b64toBlob(payload.imageData, 'image/jpeg')

          dirEntry.getFile(Date.now()+'.jpeg', {create:true}, (file) => {
            file.createWriter(function(fileWriter) {
              fileWriter.write(DataBlob)

            }, (error) => {
              this.$error.dispatch('addError', {type: 'ERROR_CREATING_FILE', error: error})
            })
          })

        },
        (error) => {
          commit('addError', {type: 'ENTRIES_NOT_CREATED', error: error})
        })
    },
    createDirectory({commit, getters}, dir) {
      const current = getters.getCurrentFolder
      current.getDirectory(dir, { create: true },
        (dirEntry) => {
          commit('createEntry', dirEntry)
        },
        (error) => {
          commit('addError', {type: 'ENTRIES_NOT_CREATED', error: error})
        })
    },
    fileCreated({commit}) {
      commit('fileCreated')
    }
  },

  mutations: {
    loadEntries (state, data) {
      state.entries = data.entries
      state.currentFolder = data.current
      state.parentFolder = data.parent
    },
    createEntry (state, payload) {
      const entryName = state.entries.find((entry) => {
        return entry.name === payload.name
      })

      if (!entryName) {
        state.entries.push(payload)
      }
    },
    addError (state, payload) {
      state.errors.push(payload)
    },
    setMainPath(state, path) {
      state.mainFolder = path
    }
  },

  getters: {
    getEntries (state) {
      return state.folders
    },
    getCurrentFolder (state) {
      return state.currentFolder
    },
    getParentFolder (state) {
      return state.parentFolder
    },
    getMainFolder (state) {
      return state.mainFolder
    },
    getErrors(state) {
      return state.errors
    },
    getCreateDirectoryErrors(state) {
      const error = state.errors.find((err) => {
        return err.type = 'ENTRIES_NOT_CREATED'
      })

      return error
    }
  }
});
