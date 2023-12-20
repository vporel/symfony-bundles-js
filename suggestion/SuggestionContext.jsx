import { h, createContext } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { getSuggestions, deleteSuggestion as serverDeleteSuggestion, clearSuggestions as serverClearSuggestions} from "./api";

const SuggestionContext = createContext({})

export function SuggestionContextProvider({children}){
    const [suggestions, setSuggestions] = useState(null)

    useEffect(async () => {
        setSuggestions(null)
        const response = await getSuggestions()
        if(response.status) setSuggestions(response.data)
    }, [])

    const deleteSuggestion = useCallback(async (id) => {
        const response = await serverDeleteSuggestion(id)
        if(response.status){
            setSuggestions(suggestions => suggestions.filter(s => s.id != id))
            return true
        }
        return false
    }, [])

    const clearSuggestions = useCallback(async () => {
        const response = await serverClearSuggestions()
        if(response.status){
            setSuggestions([])
            return true
        }
        return false
    }, [])

    return <SuggestionContext.Provider value={{
        suggestions,
        deleteSuggestion,
        clearSuggestions
    }}>{children}</SuggestionContext.Provider>
}

export default SuggestionContext;