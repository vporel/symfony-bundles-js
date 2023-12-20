import { useCallback } from "preact/hooks"


let botAnswerAnimationTimer
let dotsCount = 1
function dotsText(){
    let text = ""
    for(let i = 0; i< dotsCount; i++) text += "."
    return text
}

export function useBotAnswerAnimation(setMessages){
    const startBotAnswerAnimation = useCallback(() => {
        setMessages(msgs => [...msgs, {sender: "bot", content: dotsText()}]) //Add a waiting message
        botAnswerAnimationTimer = setInterval(() => {
            setMessages(msgs => {
                const newList = [...msgs]
                dotsCount++
                newList[newList.length-1].content = dotsText()
                if(dotsCount > 4) dotsCount = 1
                return newList
            })
        }, 400)
    }, [])

    const stopBotAnswerAnimation = useCallback(() => {
        clearInterval(botAnswerAnimationTimer)
        dotsCount = 1
        setMessages(msgs => { //Remove a waiting message
            const newList = [...msgs]
            newList.pop()
            return newList
        })
    }, [])
    
    return [startBotAnswerAnimation, stopBotAnswerAnimation]
}