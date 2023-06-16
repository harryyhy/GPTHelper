<template>
  <!-- BigBox -->
  <div class="container bigbox" name="bigbox">
    <form class="row">
      <input class="col-4 form-control-sm" type="text" placeholder="GPT-Key" v-model = "gptKey" autocomplete="on">
      <input class="col-4 form-control-sm" type="text" placeholder="Azure-TTS-Key" v-model = "azureKey" autocomplete="on">
      <input class="col-4 form-control-sm" type="text" placeholder="Azure-TTS-Region" v-model = "azureRegion" autocomplete="on">
      <button type="button" class="btn btn-outline-primary" style="margin-top: 1rem;" @click="clean">Restart</button>
    </form>
    <div class="seperate-line"></div>
    <!-- chatbox , 把rounds和topic传进去-->
    <ChatBox ref="ChatBox"/> 
    <InputBox />
  </div>
</template>
  
<script>
import ChatBox from './ChatBox.vue'
import InputBox from './Input.vue'


export default {
  name: 'BigBox',
  components: {
    ChatBox,
    InputBox,
  },
  data() {
    return {
      gptKey: '',
      azureKey: '',
      azureRegion: ''
    }
  },
  methods: {
    clean() {
      this.$refs.ChatBox.clean()
    },
  }
}
</script>

<style scoped>
/* chatbox全局居中，上下为100%高度 */
.bigbox {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.seperate-line {
  width: 100%;
  height: 0.1rem;
  background-color: #ccc;
  margin-top: 1rem;
  margin-bottom: 0.5rem; 
}
body {
  margin: 0;
  padding: 0;
}
</style>