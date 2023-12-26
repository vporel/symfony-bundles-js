import {get, post, _delete} from "@vporel/js/api"

export async function getSuggestions(){
    return await get("/api/suggestions")
}

export async function createSuggestion(subject, message){
    return await post("/api/suggestions", {subject, message})
}

export async function deleteSuggestion(id){
    return await _delete("/api/suggestions/"+id)
}

export async function clearSuggestions(){
    return await _delete("/api/suggestions/clear")
}