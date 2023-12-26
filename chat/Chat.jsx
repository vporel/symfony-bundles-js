import {Fragment, h} from "preact"
import { userSignal } from "~/globals"
import { Offcanvas } from "react-bootstrap"
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks"
import Messages from "./Messages"
import Chats from "./Chats"
import { getChats, markChatMessagesSeen as serverMarkChatMessagesSeen, newChat, getChat } from "./api"
import { useToggle } from "@vporel/react/hooks"
import { ButtonPrimary } from "@vporel/react/components/Button"
import { getSocket } from "~/socket-io"
import AppContext from "../root/AppContext"
import FloatingComponent from "@vporel/react/components/FloatingComponent"
import ChatContext from "./ChatContext"
import FloatingComponentOpener from "@vporel/react/components/FloatingComponentOpener"
import ChatLayout from "./ChatLayout"

async function serverCreateNewChat(receiver){
    const response = await newChat(receiver.id)
    if(response.status == 1){
        const createdChat = response.data
        createdChat.receiver = createdChat.user1.id == userSignal.value.id ? createdChat.user2 : createdChat.user1
        return createdChat
    }
    return null
}

export default function Chat(){
    if(!userSignal.value) return ""
    const {appKeyName} = useContext(AppContext)
    const [chats, setChats] = useState(null)
    const [selectedChat, setSelectedChat] = useState(null)
    const {chatVisible, setChatVisible, onChatOpen, chatOpeningReceiver} = useContext(ChatContext)
    
    //Load the chats
    useEffect(async () => {
        const response = await getChats()
        if(response.status == 1){
            const loadedChats = response.data
            for(const chat of loadedChats){
                chat.receiver = (chat.user1.id == userSignal.value.id) ? chat.user2 : chat.user1 
            }
            setChats(loadedChats)
        }
    }, [setChats])

    //Update the selected chat when the chats list changes
    useEffect(() => {
        if(chats){
            setSelectedChat(chat => {
                if(chat == null) return null 
                const foundChat = chats.find(c => c.id == chat.id)
                if(!foundChat) return null 
                return {...foundChat}
            })
        }
    }, [chats, markChatMessagesSeen])

    // Listen on socket io
    useEffect(() => { 
        getSocket(appKeyName).on("chat.message", message => {
            setChats(list => {  //To messages list
                const newList = [...list]
                const chatToUpdate = newList.find(c => c.receiver.id == message.sender.id)
                if(chatToUpdate == undefined){
                    (async () => {
                        const response = await getChat(message.chat.id)
                        if(response.status) setChats(list => [response.data, ...list])
                    })()
                }else{
                    chatToUpdate.messages.push(message)
                }
                return newList
            })
        })
        return () => {getSocket(appKeyName).removeAllListeners("chat.message");}
    }, [appKeyName, createNewChat])

    const markChatMessagesSeen = useCallback(chat => {
        if(chat.messages.filter(m => m.sender.id != userSignal.value.id && !m.seen).length > 0){ //There are unseen messages
            setChats(list => {
                const newList = [...list]
                const updatedChat = newList.find(c => c.id == chat.id)
                updatedChat.messages.forEach(m => {
                    if(m.sender.id != userSignal.value.id) m.seen = true
                })
                return newList
            })
            serverMarkChatMessagesSeen(chat.id)
        }
    }, [setChats])

    const selectChat = useCallback(chatToSelect => {
        if(chatToSelect) markChatMessagesSeen(chatToSelect)
        setSelectedChat(chatToSelect)
    }, [setSelectedChat, markChatMessagesSeen])

    const createNewChat = useCallback(async (receiver, callback) => {
        const createdChat = await serverCreateNewChat(receiver)
        if(createdChat){
            setChats(list => [createdChat, ...list])
            selectChat(createdChat)
            if(callback) callback()
            return true
        }
        return false
    }, [selectChat])

    useEffect(() => {
        (async () => {
            if(chatOpeningReceiver){
                setChats(chats => {
                    for(const chat of chats){
                        if(chat.receiver.id == chatOpeningReceiver.id){
                            selectChat()
                            onChatOpen()
                            return chats
                        }
                    }
                    //No chat for the receiver
                    //Create a chat
                    createNewChat(chatOpeningReceiver, onChatOpen)
                })
            }
        })()
    }, [createNewChat, selectChat, chatOpeningReceiver, onChatOpen])

    const onSendMessage = useCallback((chat, message) => {
        setChats(list => {
            const newList = [...list]
            const updatedChat = newList.find(c => c.id == chat.id)
            updatedChat.messages.push(message)
            return newList
        })
    }, [setChats])

    const unreadMessagesCount = useMemo(() => {
        if(!chats) return 0
        let count = 0
        for(const chat of chats) count += chat.messages.filter(m => m.sender.id != userSignal.value.id && !m.seen).length
        return count
    }, [chats])

    return <ChatLayout
        noOpener
        visible={chatVisible}
        unreadMessagesCount={unreadMessagesCount}
        setVisible={setChatVisible}
        selectedChat={selectedChat}
        ChatsElement={<Chats chats={chats} selectedChat={selectedChat}  onSelect={selectChat} onNewChat={createNewChat}/>}
        MessagesElement={<Messages chat={selectedChat} onSendMessage={onSendMessage}/>}
        title={!selectedChat ? "Discussions" : selectedChat.receiver.firstName}
        onCloseConversation={() => selectChat(null)}
    />
}
