import {Fragment, h} from "preact"
import Messages from "./Messages"
import { BotContextProvider } from "./BotContext"

function Header({onHide}){
    return <div className="header d-flex align-items-center justify-content-between">
        <span><i className="fas fa-robot"></i> Cerebro</span>
        <i className="fas fa-chevron-down cursor-pointer" onClick={onHide}></i>
    </div>
}

export default function FaqChatBot({visible, toggleVisible}){

    return <BotContextProvider visible={visible}>
        <div className={`faq-bot-overlay ${visible ? 'visible' : ''}`} onClick={toggleVisible}></div>
        <div className={`faq-bot d-flex flex-column ${visible ? 'visible' : ''}`}>
            <Header onHide={toggleVisible}/>
            <Messages />
        </div>
    </BotContextProvider>          
}