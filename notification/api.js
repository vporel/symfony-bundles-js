import { get, post } from "vporel/api";

/**
 * @param {string} url Path on the server
 * @param {number} firstResult 
 * @param {number} maxResults 
 * @returns 
 */
export async function getNotifications(){
    return await get("/api/notifications");
}

export async function markNotificationSeen(notificationId){
    return await post("/api/notifications/"+notificationId+"/mark-seen");
}