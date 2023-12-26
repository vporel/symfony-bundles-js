import { h, createContext } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import { onMobile } from "@vporel/js/standard";

const BotContext = createContext({})


const synthesis = window.speechSynthesis
const synthesisUtterance = new SpeechSynthesisUtterance("")

export function BotContextProvider({children, visible}){
    const speak = useCallback(text => {
        if(!synthesis) return
        const frVoices = synthesis.getVoices().filter(v => v.lang == "fr-FR")
        if(frVoices.length == 0) return
        synthesisUtterance.voice = frVoices[frVoices.length > 1 ? 1 : 0]
        synthesisUtterance.text = text 
        synthesis.speak(synthesisUtterance)
    }, [])

    useEffect(() => {
        if(onMobile())
            document.getElementsByTagName('body')[0].style.overflowY = visible ? "hidden": "auto"
    }, [visible])

    return <BotContext.Provider value={{speak, visible}}>
        {children}
    </BotContext.Provider>
}

export default BotContext;