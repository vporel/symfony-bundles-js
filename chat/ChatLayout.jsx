import {Fragment, h} from 'preact'
import FloatingComponentOpener from '@vporel/react/components/FloatingComponentOpener'

export default function ChatLayout({
    visible, setVisible, selectedChat, title, ChatsElement, MessagesElement,
    openerProps, unreadMessagesCount, onCloseConversation, noOpener
}){
    return <Fragment>
        <div className={`chat-overlay ${visible ? 'visible' : ''}`} onClick={() => setVisible(false)}/>
        {!noOpener && <FloatingComponentOpener onClick={() => setVisible(true)} {...{iconName: "fab fa-facebook-messenger", bottom: 15, right: 15, ...openerProps}} badgeProps={{visible: unreadMessagesCount > 0, value: unreadMessagesCount}}/>}
        <div className={`chat ${visible ? 'visible' : ''}`}>
            <div className="header">
                <div className="d-flex align-items-center gap-2">
                    <i className={"fas fa-arrow-left cursor-pointer fs-5 " +(selectedChat ? " d-block" : " d-none")} onClick={onCloseConversation}></i>
                    <h3 className={"mb-0 "+(selectedChat ? (title.length > 30 ? "fs-6" : "fs-5") : " fs-3")} style={{transition: "all .3s ease"}}>{title || "Discussions"}</h3>
                </div>
                <i className="fas fa-times cursor-pointer fs-3 pt-0" onClick={() => setVisible(false)} style={{paddingTop: 5}}/>
            </div>
            <div className="body">
                <div className="chats-container">
                    {ChatsElement}
                </div>
                <div className={"messages-container "+(selectedChat ? " visible" : "")}>
                    {MessagesElement}
                </div>
            </div>
        </div>
    </Fragment>
}