/**
 * Users notifications
 * Make sure to include the corresponding SCSS file in your page style file
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
import {Fragment, h} from 'preact'
import {useState, useEffect, useRef, useCallback} from 'preact/hooks'
import { getNotifications, markNotificationSeen } from './api'
import { useToggle } from '@vporel/react/hooks'
import {userSignal} from '../../globals'
import { getSocket } from '../../socket-io'
import PropTypes from '@vporel/js/prop-types'
import { format } from 'date-fns'
import { parseDate } from '@vporel/js/date'
import LinkTag from '@vporel/react/components/LinkTag'
import { onMobile } from '@vporel/js/standard'
import Loader from '@vporel/react/components/Loader'

function countUnread(notifications){
    if(!notifications) return 0
    return notifications.filter(n => !n.seen).length
}

/**
 * @param {{url:string}} param0 url: Path on the server
 * @returns 
 */
function Notifications({appKeyName}){appKeyName
    const [notifications, setNotifications] = useState(null)
    const [open, toggleOpen] = useToggle(false)
    const unreadCount = countUnread(notifications);
    const notificationsOpener = useRef(null)
    const notificationsContainer = useRef(null)
    
    useEffect(async function(){
        const response = await getNotifications()
        if(response.status == 1) setNotifications(response.data ?? []); 
    }, [setNotifications])

    useEffect(() => { // Listen on socket io
        getSocket(appKeyName).on("notification", notification => {
            setNotifications(list => {
                if(notification.flash || list.find(n => n.id == notification.id) == undefined) // The notification is flash or does not already exist
                    return [notification, ...list] //prepend
                else 
                    return list
            })
        })
        return () => {getSocket(appKeyName).removeAllListeners("notification");}
    }, [appKeyName, setNotifications])

    useEffect(() => {   //Close the natification component when the user clicks on another place in the page
        const notificationsClickListener = event => {
            event.stopPropagation()
        }
        const documentClicklistener = () => {
            if(open) toggleOpen()
        }
        notificationsOpener.current.addEventListener("click", notificationsClickListener)
        notificationsContainer.current.addEventListener("click", notificationsClickListener)
        document.addEventListener("click", documentClicklistener)
        return () => {
            document.removeEventListener("click", documentClicklistener)
            notificationsOpener.current.removeEventListener("click", notificationsClickListener)
            notificationsContainer.current.removeEventListener("click", notificationsClickListener)
        }
    }, [open, toggleOpen, notificationsOpener, notificationsContainer])

    useEffect(() => {
        if(onMobile())
            document.getElementsByTagName('body')[0].style.overflowY = open ? 'hidden' : ''
    }, [open])

    const onNotificationClick = useCallback(notification => {
        if(onMobile()) toggleOpen()
        if(notification.seen) return
        if(!notification.flash) markNotificationSeen(notification.id) //Server call
        //Update the list to mark the notification seen
        setNotifications(list => {
            const newList = [...list]
            newList.find(n => n == notification).seen = true
            return newList
        })
    }, [setNotifications, toggleOpen])

    return <div className={"notifications " + (open ? "visible" : "")}>
        <div className="btn-container">
            <button aria-label="Voir les notifications" className='btn-open' onClick={toggleOpen} ref={notificationsOpener}>
                <i className="fas fa-bell fs-4"></i>
                { unreadCount == 0 ? "" : <span className="badge bg-primary">{ unreadCount }</span>}
            </button>
        </div>
        <div className={"notifications-list-container " + (open ? "visible" : "")} ref={notificationsContainer}>
            <h2 className="block-title d-flex justify-content-between align-items-center gap-3 pe-2 pe-md-1">
                <span>Notifications</span>
                <i className="fas fa-times cursor-pointer" onClick={toggleOpen} style={{paddingTop: 5}}/>
            </h2>
            {notifications === null ? <div className="text-center"><Loader /></div> : 
                <div className="notifications-list">
                    {notifications.length > 0 
                        ? notifications.map(notif => (
                            <LinkTag  className={"notification" + ((!notif.seen) ? " unread":"")  + ((notif.flash) ? " flash":"")} href={notif.url} onClick={() => onNotificationClick(notif)}>
                                <div>
                                    <h5 class="notification-title">{notif.title}</h5>
                                    <p class="notification-text nl2br">{notif.content.slice(0, 80) + (notif.content.length > 80 ? "..." : "")}</p>
                                    <span class="notification-date">{format(parseDate(notif.sentAt), "dd/MM/yyyy HH:mm")}</span>
                                </div>
                            </LinkTag>
                        ))
                        : <div className="ps-2">Aucune notification</div>
                    }
                </div>
            }
        </div>
    </div>
}

Notifications.propTypes = {
    appKeyName: PropTypes.string.isRequired()
}

export default Notifications