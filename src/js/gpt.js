import axios from 'axios';

const url = 'https://api.openai.com/v1/chat/completions'

var call_cnt = 0

export default {
    name: 'gpt',
    data() {
        return {
            call_cnt: 0,
        };
    },
    props: {
        rounds: 0,
        topic: '',
    },
    methods: {
        async sendRequest(messages, api_key) {
            try {
                const params = {
                    model: 'gpt-3.5-turbo',
                    messages,
                    max_tokens: 256,
                };
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + api_key[call_cnt % api_key.length]
                };
                call_cnt++;
                const response = await axios.post(url, params, { headers })
                return response.data.choices[0].message
            } catch (error) {
                console.log(error)
                throw new Error("GPT调用失败。")
            }
        }
    }
};