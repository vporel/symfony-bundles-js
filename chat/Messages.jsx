import {Fragment, h} from "preact"
import FlexCenter from "vporel/components/display/FlexCenter"
import _ from "vporel/translator"
import LittleTextForm from "vporel/components/LittleTextForm"
import { useCallback, useEffect } from "preact/hooks"
import { sendMessage as serverSendMessage } from "./api"
import { userSignal } from "~/globals"
import { format } from "date-fns"
import { parseDate } from "vporel/date"

function MessageWidget({message}){
    return <div className={"d-flex px-2 py-1"+(message.sender.id == userSignal.value.id ? " justify-content-end" : "")}>
        <div className={"p-2 rounded rounded-3 "+(message.sender.id == userSignal.value.id ? "bg-primary text-white" : "bg-rgb240")} style={{maxWidth: "80%", whiteSpace: "pre-line"}}>
            {message.content}
            <span className="d-block text-end" style={{fontSize: ".6rem"}}>{format(parseDate(message.sentAt), "dd/MM/yyyy HH:mm")}</span>
        </div>
    </div>
}

export default function Messages({chat, onSendMessage}){

    const scrollDown = useCallback(() => {
        const messagesContainer = document.getElementById("chat-messages")
        if(messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight + 100
    }, [])

    useEffect(() => {
        setTimeout(scrollDown, 30)
    }, [chat])

    const sendMessage = useCallback(async text => {
        const response = await serverSendMessage(chat.id, text)
        if(response.status == 1){
            onSendMessage(chat, response.data)
            setTimeout(scrollDown, 30)  //Scroll down after (time to add the message)
            return true
        }
        return false
    }, [chat, onSendMessage])

    return chat === null
        ? <FlexCenter className="h-100">{_("Select a chat")}</FlexCenter>
        : <div className="h-100 d-flex flex-column" style={{flex: "1 auto"}}>
            <div className="h-100 py-1" style={{overflow: "auto"}} id="chat-messages">
                {chat.messages.length == 0
                    ? <FlexCenter className="h-100">{_("Your messages will appear here")}</FlexCenter>
                    : <div className="py-1">
                        {chat.messages.map(message => <MessageWidget key={message.id} message={message}/>)}
                    </div>
                }
            </div>
            <div className="mt-1 p-2 p-md-0">
                <LittleTextForm onSubmit={sendMessage} placeholder={_("Your message")} bordered={false} className="bg-rgb240 rounded-2"/>
            </div>
        </div>
}