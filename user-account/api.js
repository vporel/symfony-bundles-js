import { post } from "vporel/api"

export async function sendEmailValidationCode(){
    return await post("/api/account/send-email-validation-code")
}

export async function validateEmail(code){
    return await post("/api/account/validate-email", {code})
}

export async function changeEmail(email){
    return await post("/api/account/change-email", {email})
}