import {h} from "preact"
import { useContext } from "preact/hooks"
import SettingsContext from "../../SettingsContext"
import Loader from "@vporel/react/components/Loader"
import Setting from "./Setting"

export default function List(){
    const {settings} = useContext(SettingsContext)

    if(!settings) return <Loader />
    if(settings.length == 0) return <div className="alert alert-info">Aucun paramètre défini</div>

    return <div>
        {settings.map(s => <div key={s.key} className="mb-2"><Setting setting={s} /></div>)}
    </div>
}