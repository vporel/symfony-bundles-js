import { h, createContext } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import Chat from "./Chat";
import { onMobile } from "vporel/standard";
import { useSearchParams } from "vporel/hooks";

const ChatContext = createContext({})

export function ChatContextProvider({openerProps, children}){
    const [chatVisible, setChatVisible] = useState(false)
    const [chatOpeningReceiver, setChatOpeningReceiver] = useState(null)
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
    const searchParams = useSearchParams()

    useEffect(() => {
        if(searchParams.openChat){
            setChatVisible(true)
        }
    }, [searchParams])

    useEffect(() => {
        if(onMobile())
            document.getElementsByTagName('body')[0].style.overflowY = chatVisible ? "hidden" : "auto"
    }, [chatVisible])

    return <ChatContext.Provider value={{
        openChat: useCallback(receiver => {
            setChatOpeningReceiver(receiver)
            setChatVisible(true)
        }, []),
        onChatOpened: useCallback(() => setChatOpeningReceiver(null), []),
        chatOpeningReceiver,
        chatVisible,
        setChatVisible,
        unreadMessagesCount,
        setUnreadMessagesCount
    }}>
        {children}

        <Chat openerProps={openerProps}/>
    </ChatContext.Provider>
}

export default ChatContext