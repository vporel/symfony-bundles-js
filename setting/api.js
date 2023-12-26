import { get, post, postWithFiles } from "@vporel/js/api";

export async function getSettings(){
    return await get("/api/settings");
}

export async function editSetting(key, value){
    return await post(`/api/settings/${key}`, {value});
}

export async function editSettingImage(key, imagesToRemove, files){
    return await postWithFiles(`/api/settings/${key}/edit`, {imagesToRemove}, files, "image")
}