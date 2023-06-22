import axios from 'axios';


const voices = [
    "zh-CN-YunhaoNeural",
    "zh-CN-YunfengNeural",                
]

export default {
    name: 'SpeechUtil',
    data() {
        return {
        };
    },
    methods: {
        // 文字转语音
        async synthesizeSpeech(text, subscriptionKey, serviceRegion, role = 0) {
            const voiceName = voices[role]
            // 请求头配置
            const headers = {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            };

            // 请求体配置
            const body = `
                <speak version='1.0' xml:lang='en-US'>
                    <voice name='${voiceName}'>
                    ${text}
                    </voice>
                </speak>
            `;
            let audioData = await axios.post(`https://${serviceRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, body, {
                headers: headers,
                responseType: 'arraybuffer',
            })
            audioData = audioData.data
            const blob = new Blob([audioData], { type: 'audio/wav' })
            const audioUrl = URL.createObjectURL(blob)
            return audioUrl
        },

        // 语音转文字
        async speechToText(subscriptionKey, region, audioBlob) {
            const speechEndpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=zh-CN&format=detailed`;
            let res = null
            try {
                res = await axios.post(speechEndpoint, audioBlob, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                        'Content-Type': 'audio/wav',
                    }
                })
            } catch (err) {
                console.error(err)
                throw new Error("语音识别失败。")
            }
            return res.data.DisplayText
        },

    },
};