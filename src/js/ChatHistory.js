export default class ChatHistory{
    static chats = {};

    constructor(){
        let history = [{
            role: 'system', 
            content: '你是我的私人助手，帮助我解决问题或者陪我聊天。'
        }];
        this.chatId = crypto.randomUUID();
        ChatHistory.chats[this.chatId] = history;
    }
}