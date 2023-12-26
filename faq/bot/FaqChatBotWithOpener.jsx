import {Fragment, h} from "preact"
import FloatingComponent from "@vporel/react/components/FloatingComponent"
import Messages from "./Messages"
import { BotContextProvider } from "./BotContext"
import FaqChatBot from "./FaqChatBot"

function Header({onHide}){
    return <div className="header d-flex align-items-center justify-content-between">
        <span><i className="fas fa-robot"></i> Cerebro</span>
        <i className="fas fa-chevron-down cursor-pointer" onClick={onHide}></i>
    </div>
}

export default function FaqChatBotWithOpener({openerProps}){

    return (
        <FloatingComponent openerProps={{iconName: "robot", bottom: 15, right: 15, ...openerProps}}>
            {(visible, toggleVisible) => <FaqChatBot visible={visible} toggleVisible={toggleVisible}/>}
        </FloatingComponent>
    )
                
}