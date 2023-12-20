import {get} from "vporel/api"

export async function getFaq(){
    return await get("/api/faq")
}