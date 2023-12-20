import {h} from "preact"
import { useCallback, useContext, useState } from "preact/hooks"
import SuggestionContext from "../../SuggestionContext"
import Loader from "vporel/components/Loader"
import Suggestion from "./Suggestion"
import { ButtonDanger } from "vporel/components/Button"

export default function List(){
    const {suggestions} = useContext(SuggestionContext)
    const [loading, setLoading] = useState(false)
    const {clearSuggestions} = useContext(SuggestionContext)

    const handleClearClick = useCallback(async () => {
        setLoading(true)
        await clearSuggestions()
        setLoading(false)
    }, [clearSuggestions])

    if(!suggestions) return <Loader />
    if(suggestions.length == 0) return <div className="alert alert-info">Aucune suggestion</div>

    return <div>
        <div className="d-flex justify-content-end mb-3">
            <ButtonDanger loading={loading} iconName="trash" onClick={handleClearClick}>Tout supprimer</ButtonDanger>
        </div>
        <div>
            {suggestions.map(s => <div key={s.id} className="mb-2"><Suggestion suggestion={s} /></div>)}
        </div>
    </div>
}