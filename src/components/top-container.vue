<template>
    <form class="container">
      <div class="row top-container">
        <div class="mb-3 input-container col">
          <label for="topicInput" class="form-label input-label">Topic</label>
          <input class="form-control input-box" id="topic" aria-describedby="Topic">
        </div>
        <div class="mb-3 input-container col-3">
          <label for="NumOfRounds" class="form-label input-label">Rounds</label>
          <input type="number" class="form-control input-box" id="rounds">
        </div>
      </div>
      <div class="d-grid gap-2">
        <!-- 点击就向父组件发送信息 -->
        <button class="btn btn-primary" type="button" @click="sendProps" id="button" 
        :style="{ backgroundColor: buttonColor }"
            @mousedown="changeButtonColor('#205F3B')"
            @mouseup="changeButtonColor('#337C53')"
            @mouseleave="changeButtonColor('#337C53')"
          >Begin now!</button>
      </div>
    </form>
</template>

<script>
    export default {
        name: 'top-container',
        methods: {
          sendProps() {
            // 获取输入框的值
            let rounds = document.getElementById('rounds').value;
            let topic = document.getElementById('topic').value;
            // 向父组件发送信息
            this.$emit('setProps', rounds, topic);
          },
          changeButtonColor(color) {
            this.buttonColor = color
          }
        },
        data() {
          return {
            buttonColor: '#337C53'
          }
        },
    }

</script>

<style>
#button {
  background-color: #337C53;
  border-color: #3FB472;
}
</style>