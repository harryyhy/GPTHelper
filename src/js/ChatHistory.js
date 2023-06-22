import { v4 as uuidv4 } from 'uuid';

export default class ChatHistory{
    static chats = {};

    constructor(){
        let history = [{
            role: 'system', 
            content: '你是我的私人助手，帮助我解决问题或者陪我聊天。'
        }];
        this.chatId = uuidv4();
        // console.log(this.chatId)
        ChatHistory.chats[this.chatId] = history;
    }
}