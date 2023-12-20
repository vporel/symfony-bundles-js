import { useEffect, useState } from "preact/hooks"
import { getCurrentPaymentStatus } from "./api"
import { useSearchParams } from "react-router-dom"

export function useCurrentPaymentStatus(){
    const [paymentStatus, setPaymentStatus] = useState(null)
    const info = useSearchParams()["info"]

    useEffect(async () => {
        setPaymentStatus(null)
        const response = await getCurrentPaymentStatus(info)
        if(response.status == 1) setPaymentStatus(response.data)
    }, [setPaymentStatus, info])

    return paymentStatus
}