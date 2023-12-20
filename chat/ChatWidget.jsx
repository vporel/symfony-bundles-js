import {h} from 'preact'
import { Image } from 'react-bootstrap'
import FlexCenter from 'vporel/components/display/FlexCenter'

export default function ChatWidget({chat, onSelect, selected, unreadMessagesCount, imageSrc, title}){
    const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length-1] : null
        
    return <div className={"p-2 d-flex align-items-center justify-content-between gap-1 cursor-pointer rounded-2 hover:bg-rgb240"} onClick={() => {onSelect(chat)}}>
        <div className="d-flex align-items-center gap-2">
            <Image roundedCircle src={imageSrc} style={{width: 30, height: 30}} alt="C"/>
            <div className="d-flex flex-column">
                <span className={"text-black"+(selected ? " fw-bold " : "")}>{title}</span>
                {lastMessage &&
                    <span className={"last-message"} style={{fontSize: ".8rem"}}>
                        {lastMessage.content.slice(0, 30)}{lastMessage.content.length > 30 ? " ..." : ""}
                    </span>
                }
            </div>
        </div>
        {unreadMessagesCount > 0 && 
            <FlexCenter className="d-block bg-primary text-white" style={{borderRadius: "50%", height: 25, width: 25}}>{unreadMessagesCount}</FlexCenter>
        }
    </div>
}