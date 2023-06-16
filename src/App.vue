<template>
  <div class="cover" v-if="isSpeaking"></div>
  <div class="home">

  <!-- BigBox -->
  <div class="container bigbox" name="bigbox">
    <form class="row form-control" style="background-color: transparent; border: 0px;">
      <input :autocomplete="on" class="col-4 form-control-sm" placeholder="GPT-Key" v-model = "gptKey">
      <input class="col-4 form-control-sm" placeholder="Azure-TTS-Key" v-model = "azureKey" autocomplete="on">
      <input class="col-4 form-control-sm" placeholder="Azure-TTS-Region" v-model = "azureRegion" autocomplete="on">
      <button type="button" class="btn btn-outline-primary" style="margin-top: 1rem; font-weight: bold;" @click="clean">Restart</button>
    </form>
    <div class="seperate-line"></div>
    <!-- chatbox , 把rounds和topic传进去-->
    <ChatBox ref="ChatBox"/> 
  </div>

  <div class="inputBox container">
    <div class="input-group form-floting container" style="background-color: transparent; padding-left: 5rem;">
        <button class="btn btn-dark" data-bs-toggle="button" type="button" @click="changeMode()" style="width: 5rem; margin-left: -5rem; float: left;">Tap Me</button>
        <!-- TYPE IN -->
        <input type="text" class="form-control" placeholder="Type here" v-if="!isSpeakMode" ref="inputBox" @keydown.enter="sendPrompt(this.$refs.inputBox.value)" v-model="this.inputBoxValue">
        <button  type="button" v-if="!isSpeakMode" @click="sendPrompt(this.$refs.inputBox.value)" style="font-weight: bold;">Send</button>
        <!-- SPEAK -->
        <button  style="width: 100%; float: right;" type="button" v-if="isSpeakMode" @mousedown="startSpeak" @mouseup="endSpeak" ref="speakButton" @touchstart="startSpeak" @touchend="endSpeak">Press to speak!</button>
    </div>
  </div>
  </div>
</template>

<script>
import ChatBox from './components/ChatBox.vue'
import SpeechUtil from './js/SpeechUtil'
import Recorder from 'js-audio-recorder'
import ChatHistory from './js/ChatHistory'
import AlertComponent from './components/AlertComponent'

export default {
  name: 'App',
  components: {
    ChatBox,
  },
  data() {
    return {
      isSpeakMode: false,
      isSpeaking: false,
      recorder: new Recorder({
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1, // 声道，支持 1 或 2， 默认是1
      }),
      inputBoxValue: "",
      chatId: null,
      gptKey: "",
      azureKey: "",
      azureRegion: "",
    }
  },
  methods: {
    clean(){
      this.$refs.ChatBox.clean()
      this.chatId = null
    },
    changeMode() {
        this.isSpeakMode = !this.isSpeakMode
    },
    startSpeak(){
      if (this.chatId == null) {
        this.ChatHistory = new ChatHistory()
        this.chatId = this.ChatHistory.chatId
      }

      this.isSpeaking = true
      this.$refs.speakButton.innerText = "Speaking"
      // 录制声音。。。
      Recorder.getPermission().then(
        () => {
          this.recorder.start(); // 开始录音
        },
        (error) => {
          AlertComponent.showAlert("请允许使用麦克风")
          console.log(error)
        }
      )
    },
    async endSpeak(){
      this.recorder.stop();
      this.isSpeaking = false
      this.$refs.speakButton.innerText = "Press to Speak"
      // 转文本
      let audioBlob = this.recorder.getWAVBlob();
      let text = null
      try {
        text = await SpeechUtil.methods.speechToText(this.azureKey, this.azureRegion, audioBlob)
      } catch (error) {
        AlertComponent.showAlert("语音识别失败，请重试")
        return
      }
      await this.sendPrompt(text)
    },
    async sendPrompt(prompt){
      this.inputBoxValue = ""
      if (this.chatId == null) {
        // 这里的ChatHistory是一个实例对象
        this.ChatHistory = new ChatHistory()
        this.chatId = this.ChatHistory.chatId
      }
      // 调用gpt
      try {
        // 这里的没有this.的ChatHistory并不是对象，而是一个类；发送给ChatBox，由ChatBox来处理
        await this.$refs.ChatBox.newPrompt(prompt, this.ChatHistory.chatId, this.gptKey.split(";"), ChatHistory, this.azureKey, this.azureRegion)
      } catch (error) {
        console.log(error)
        AlertComponent.showAlert(error)
        return
      }
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  transform: none;
}

.cover{
    position: fixed;
    background-color: #727d88;
    opacity: 0.1;
    width: 100%;
    height: 100%;
    z-index: 10;
    /* 给遮罩层上添加这个属性即可，这是就可以穿透遮罩层，触发到确认按钮了 */
    pointer-events: none;
}
.home {
  background: linear-gradient(#EDF8F7, #BBFBF3) no-repeat;
  height: 100vh;
}
.bigbox {
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 90vh;
}
.seperate-line {
  width: 100%;
  height: 2px;
  background-color: #ccc;
  margin-top: 1rem;
  margin-bottom: 0.5rem; 
}
.inputBox {
  height: 10vh;
  bottom: 1rem;
}
</style>
