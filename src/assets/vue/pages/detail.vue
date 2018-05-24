<template>
<f7-page>
  <f7-navbar title="Details" back-link="Back" sliding></f7-navbar>       
    <f7-card v-if="isLoaded">
        <f7-card-header>{{description}}</f7-card-header>
      <f7-card-content>
        <img width="100%" :src="'data:image/jpeg;base64,' + this.image" />
      </f7-card-content> 
      <f7-card-footer>
        <pre style="width: 100%;padding:10;">
          <code class="json">
            {{text}}
          </code>
        </pre>
      </f7-card-footer>  
    </f7-card>
  </f7-page>
</template>
<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  props: {selection: String},
  data () {
    return {
      image: null,
      text: '',
      description: '',
      isLoaded: false
    }
  },
  computed: {
    createdEntry () {
      return this.$store.getters.getCreatedEntry
    }
  },
  mounted () {
    this.openCamera(this.selection)
  },
  methods: {
    backConfirm () {
      this.$f7Router.back()
    },
    setOptions(srcType) {
      return {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
      }
    },
    openCamera(srcType) {
      const options = this.setOptions(srcType);
      navigator.camera.getPicture((imageUri) => {
        this.image = imageUri
        this.getLabel(imageUri)
        this.isLoaded = true
      }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
      }, options);
    },
    getLabel(image) {
      const request = {
        "requests": [
          {
            "image": {
              "content":  image
            },
            "features": [
              {
                "type": "LABEL_DETECTION",
                "maxResults": 1
              }
            ]
          }
        ]
      }

      axios.post('https://vision.googleapis.com/v1/images:annotate?key=API_VISION_KEY', request)
      .then( response => {
        this.text = JSON.stringify(response.data, null, 2)
        this.description = response.data.responses[0].labelAnnotations[0].description
        const payload = {
          dir: this.description,
          imageData: image
        }
        this.$store.dispatch('createFile', payload)
      })
      .catch(error => console.log(error))
      
    }
  }
}
</script>
<style scoped>
  .picture > img {
    color: #fff;
    width:100%;
  }
  .info {
    text-align: right;
    padding: 5px;
    color: #555;
    font-size: 10px;
  }
  .comment {
    padding: 10px;
    color: #555;
  }
  .actions {
    text-align: center;
  }
</style>
