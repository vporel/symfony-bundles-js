import { get, post } from "vporel/api";


export async function getChats(){
    return await get("/api/chats")
}

export async function getChat(chatId){
    return await get("/api/chats/"+chatId)
}

export async function newChat(receiverId){
    return await post("/api/chats", {receiverId})
}

export async function sendMessage(chatId, text){
    return await post("/api/chats/messages", {chat: "/api/chats/"+chatId, content: text})
}

export async function markChatMessagesSeen(chatId){
    return await post(`/api/chats/${chatId}/mark-messages-seen`)
}