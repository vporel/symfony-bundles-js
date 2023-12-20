import {Fragment, h} from "preact"
import { useCallback, useEffect, useMemo, useState } from "preact/hooks"
import Loader from "vporel/components/Loader"
import FlexCenter from "vporel/components/display/FlexCenter"
import _ from "vporel/translator"
import { searchUsers } from "~/tutoring/users/api"
import { Image } from "react-bootstrap"
import { userSignal } from "~/globals"
import { onMobile } from "vporel/standard"
import ChatWidget from "./ChatWidget"

/**
 * onSelect: (usr, chat) => void    If chat != null, the selected element is an existing chat
 */
function SearchResults({chats, results, onSelect}){
    const existingUsersInChats = useMemo(() => {      //Users that are already in the chats list
        if(!results) return []
        const list = []
        for(const usr of results)
            if(chats.find(ch => ch.receiver.id == usr.id)) list.push(usr)
        return list
    }, [chats, results])

    const others = useMemo(() => {
        if(!results) return []
        const list = []
        for(const usr of results)
            if(!existingUsersInChats.find(u => u.id == usr.id)) list.push(usr)
        return list
    }, [results, existingUsersInChats])

    return results === null 
        ? <FlexCenter className="h-100"><Loader /></FlexCenter>
        : (results.length > 0 
            ? <div style={{overflow: "auto"}} className="h-100">
                {existingUsersInChats.length > 0 && <div>
                    <h5 className="p-2 pb-1">{_("My chats")}</h5>
                    {existingUsersInChats.map(u => (
                        <div className="p-2 d-flex align-items-center gap-2 cursor-pointer hover:bg-rgb240" onClick={() => {onSelect(u)}}>
                            <Image roundedCircle src={u.avatarUrl} style={{width: 30, height: 30}}/>
                            <span>{u.firstName}</span>
                        </div>
                    ))}
                    <hr />
                </div>}
                {others.length > 0 && <div>
                    <h5 className="p-2 pb-1">{_("Other users")}</h5>
                    {others.map(u => (
                        <div className="p-2 d-flex align-items-center gap-2 cursor-pointer hover:bg-rgb240" onClick={() => {onSelect(u)}}>
                            <Image roundedCircle src={u.avatarUrl} style={{width: 30, height: 30}}/>
                            <span>{u.firstName}</span>
                        </div>
                    ))}
                </div>}
            </div>
            : <FlexCenter className="h-100">{_("No result")}</FlexCenter>
        )
    
}

export default function Chats({chats, selectedChat, onNewChat, onSelect}){
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState(null)
    const [creatingNewChat, setCreatingNewChat] = useState(false)


    useEffect(async () => {
        setSearchResults(null)
        if(searchText.length > 1){  //At least two character
            const response = await searchUsers(searchText)
            if(response.status == 1) setSearchResults(response.data)
        }
    }, [searchText, setSearchResults])

    const selectSearchResult = useCallback(async usr => {
        const chat = chats.find(ch => ch.receiver.id == usr.id)
        setSearchText("")
        if(chat) onSelect(chat)
        else{
            setCreatingNewChat(true)
            await onNewChat(usr) 
            setCreatingNewChat(false)
        }
    }, [chats, onNewChat, onSelect, setSearchText,setCreatingNewChat])

    return <div className="chats h-100 d-flex flex-column rounded rounded-3">
        <div className="mt-1" style={{border: "1px solid lightgray", borderRadius: 30}}>
            <div className="d-flex align-items-center gap-2 p-2">
                <i className="fas fa-search"></i> 
                <input type="text" placeholder={_("Search")} className="w-100" value={searchText} onChange={e => setSearchText(e.target.value.trim())}/>
                {searchText != "" && <i className="fas fa-times cursor-pointer" onClick={() => setSearchText("")}></i>}
            </div>
        </div>
        {searchText.length > 1
            ? <SearchResults chats={chats} results={searchResults} onSelect={selectSearchResult}/>
            :(chats === null
                ? <FlexCenter className="h-100"><Loader /></FlexCenter>
                : <Fragment>
                    {creatingNewChat && <FlexCenter><Loader /></FlexCenter>}
                    {chats.length > 0 
                        ? <div style={{overflow: "auto"}} className="h-100 mt-2">
                            {chats.map(chat => <ChatWidget 
                                key={chat.id} 
                                chat={chat} 
                                selected={selectedChat && chat.id == selectedChat.id} 
                                onSelect={onSelect}
                                unreadMessagesCount={chat.messages.filter(m => m.sender.id != userSignal.value.id && !m.seen).length}
                                imageSrc={chat.receiver.avatarUrl}
                                title={chat.receiver.firstName}
                            />)}
                        </div>
                        : <FlexCenter className="h-100">{_("No chat")}</FlexCenter>
                    }
                </Fragment>
            )
        }
    </div>
}
