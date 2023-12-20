import { useEffect, useState } from "preact/hooks";
import { getFaq } from "./api";

export function useFaq(){
    const [faq, setFaq] = useState(null)

    useEffect(async () => {
        setFaq(null)
        const response = await getFaq()
        if(response.status == 1) setFaq(response.data)
    }, [setFaq])

    return faq
}