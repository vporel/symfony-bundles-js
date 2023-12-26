import {Fragment, h} from "preact"
import { ButtonDanger } from "@vporel/react/components/Button"
import { useCallback, useContext, useState } from "preact/hooks"
import SuggestionContext from "../../SuggestionContext"
import { format } from "date-fns"
import { parseDate } from "@vporel/js/date"

export default function Suggestion({suggestion}){
    const {deleteSuggestion} = useContext(SuggestionContext)
    const [loading, setLoading] = useState(false)

    const handleDeleteClick = useCallback(async () => {
        setLoading(true)
        await deleteSuggestion(suggestion.id)
        setLoading(false)
    }, [suggestion, deleteSuggestion])

    return <div className="rounded bg-rgb245 hover:bg-rgb230 p-3">
        <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
            <label className="fw-bold d-block -w-100 -w-md-20">{suggestion.subject}</label>
            <span className="-w-100 -w-md-60">{suggestion.message}</span>
            <div className="-w-100 -w-md-20 d-flex justify-content-start justify-content-md-end gap-2">
                <span>{format(parseDate(suggestion.createdAt), "dd-MM-yyyy")}</span>
                <ButtonDanger iconName="trash" loading={loading} onClick={handleDeleteClick}/>
            </div>
        </div>
    </div>
}