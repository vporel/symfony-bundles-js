import {Fragment, h} from "preact"
import FlexCenter from "vporel/components/display/FlexCenter"
import _ from "vporel/translator"
import LittleTextForm from "vporel/components/LittleTextForm"
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks"
import { userSignal } from "~/globals"
import { format } from "date-fns"
import { parseDate } from "vporel/date"
import AppContext from "../../root/AppContext"
import { getSocket } from "../../../socket-io"
import parse from "html-react-parser"
import { useBotAnswerAnimation } from "./hooks"
import BotContext from "./BotContext"

function MessageWidget({message, onClick}){

    return <div className={"d-flex px-2 py-1"+(message.sender == "user" ? " justify-content-end" : "")}>
        <div onClick={onClick} className={"p-2 rounded rounded-3 "+(message.sender == "user" ? "bg-primary text-white" : (message.suggestion ? "bg-secondary-op-05 cursor-pointer" : "bg-rgb240"))} style={{maxWidth: "80%", whiteSpace: "pre-line"}}>
            {message.sender == "user" ? message.content : parse(message.content)}
        </div>
    </div>
}

const helloMessage = {sender: "bot", content: "Hello! Je suis <strong>Cerebro</strong>, le robot créé pour répondre à vos questions. Comment puis-je vous aider ?"}

let helloMessageSpoken = false

export default function Messages(){
    const {appKeyName} = useContext(AppContext)
    const socket = useMemo(() => getSocket(appKeyName), [appKeyName])
    const [messages, setMessages] = useState([helloMessage])
    const [waitingBotAnswer, setWaitingBotAnswer] = useState(false)   //If the user is waiting an answer from the bot
    const [startBotAnswerAnimation, stopBotAnswerAnimation] = useBotAnswerAnimation(setMessages)
    const {speak, visible} = useContext(BotContext)

    const scrollDown = useCallback(() => {
        const messagesDiv = document.querySelector(".faq-bot .messages")
        if(messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight + 100
    }, [])

    useEffect(() => {
        setTimeout(scrollDown, 30)
    }, [messages])

    //Say the welcome message
    useEffect(() => {
        if(visible && !helloMessageSpoken){
            speak(helloMessage.content)
            helloMessageSpoken = true
        }
    }, [visible])

    useEffect(() => {
        socket.on("faqchatbot.answer", data => {
            stopBotAnswerAnimation()
            setMessages(msgs => {
                let message = {sender: "bot"}
                const suggestions = []
                if(!data) message.content = "Désolé, Je n'ai pas compris."
                else{
                    if(data.answer) message.content = data.answer
                    else{
                        if(!data.otherQuestions || data.otherQuestions.length == 0) message.content = "Désolé, Je n'ai pas compris."
                        else{
                            message.content = "Désolé, Je n'ai pas compris. Vous désirez peut-être savoir :"
                            data.otherQuestions.slice(0, 3).forEach(question => suggestions.push({sender: "bot", content: question, suggestion: true})) //Show only three suggestions
                        }
                    }
                }
                speak(message.content)
                return [...msgs, message, ...suggestions]
            })
            setWaitingBotAnswer(false)
        })
        return () => {socket.removeAllListeners("faqchatbot.answer");}
    }, [appKeyName, speak])

    const sendMessage = useCallback(async text => {
        setMessages(msgs => [...msgs, {content: text, sender: "user"}])
        setWaitingBotAnswer(true)
        startBotAnswerAnimation()
        socket.emit("faqchatbot.usertext", text)
        return true
    }, [startBotAnswerAnimation])

    return <div className="d-flex flex-column messages-container">
        <div className="h-100 py-1 messages" style={{overflow: "auto"}}>
            {messages.map(message => <MessageWidget key={message} message={message} onClick={() => {if(message.suggestion) sendMessage(message.content)}}/>)}
        </div>
        <div style={{borderTop: "1px solid lightgray"}}>
            <LittleTextForm multiline={false} onSubmit={sendMessage} placeholder="Taper ici" bordered={false} disabled={waitingBotAnswer}/>
        </div>
    </div>
}