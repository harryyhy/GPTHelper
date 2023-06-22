<template>
    <div class="chatbox-container" ref = "chatboxContainer">
        <div v-for="(message, idx) in conversationShow" :key="idx">
            <OthersChat v-if="message.role == 'assistant'" class="each-chat-container" :text="message.content" />
            <MyChat v-else class="each-chat-container"  style="flex-direction: row-reverse;" :text="message.content"/>
        </div>
    </div>
</template>

<script>
import OthersChat from './OthersChat.vue'
import MyChat from './MyChat.vue'
import gpt from '@/js/gpt'
import SpeechUtil from '@/js/SpeechUtil'

export default {
    name: 'ChatBox',
    components: {
        OthersChat,
        MyChat
    },
    data() {    // 可变的
        return {
            conversationShow: [],
            audioUrls: [],
            audioPlayer: null,
        }
    },
    methods: {
        clean() {
            this.conversationShow = []
            this.chatId = null
        },
        async newPrompt(text, chatId, gptKeys, ChatHistory, azureKey, azureRegion) {
            // 如果无法识别语音，即语音为undefined，则提示用户重新输入
            if (text == null || text == undefined || text == "") {
                throw new Error("语音识别失败，请重试")
            }

            // 同时加入conversationShow和ChatHistory
            this.conversationShow.push({role: 'user', content: text})
            this.chatId = chatId
            ChatHistory.chats[chatId].push({
                role: 'user',
                content: text
            })
            this.scrollToBottom()

            try {
                // 调用chatgpt
                let res = null
                // console.log(ChatHistory.chats[chatId])
                res = await gpt.methods.sendRequest(ChatHistory.chats[chatId], gptKeys)
                if (res == undefined || res == null) {
                    throw new Error("chatgpt请求失败")
                }
                ChatHistory.chats[chatId].push(res)
                this.conversationShow.push(res)
                this.scrollToBottom()
                // 调用azure
                this.callAzure(res.content, azureKey, azureRegion)
            } catch (error) {
                console.error(error)
                throw error
            }
        },

        async callAzure(text, azureKey, azureRegion) {
            try {
                this.audioUrl = await SpeechUtil.methods.synthesizeSpeech(text, azureKey, azureRegion)
            } catch (error) {
                console.error(error)
                throw new Error("azure请求失败")
            }
            if (this.audioPlayer != null) {
                this.audioPlayer.pause()
            }
            this.audioPlayer = new Audio(this.audioUrl)
            this.audioPlayer.play()
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const cont = this.$refs.chatboxContainer;
                cont.scrollTo({
                    top: cont.scrollHeight,
                    behavior: 'smooth'
                })
            });
        },
    }
}

</script>
<style scoped>
.chatbox-container {
    overflow-y: auto;
    height: 60vh;
    height: calc(var(--vh, 1vh) * 60);
}
.each-chat-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
}
</style>