import {h} from "preact"
import { SuggestionContextProvider } from "../../SuggestionContext";
import List from "../components/List";

export default function SuggestionsPage(){
    
    return <SuggestionContextProvider>
        <div id="settings-admin-page">
            <List />
        </div>
    </SuggestionContextProvider>
}