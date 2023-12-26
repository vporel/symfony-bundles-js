import {get} from "@vporel/js/api"

export async function getFaq(){
    return await get("/api/faq")
}