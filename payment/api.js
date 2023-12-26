import { get, post } from "@vporel/js/api";

export async function getCurrentPaymentStatus(info){
    return await get("/api/payments/current-payment-status", {info})
}

export async function cancelCurrentPayment(){
    return await post("/api/payments/cancel-current-payment")
}