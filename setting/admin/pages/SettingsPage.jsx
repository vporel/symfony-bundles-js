import {h} from "preact"
import { SettingsContextProvider } from "../../SettingsContext";
import List from "../components/List";

export default function SettingsPage(){
    
    return <SettingsContextProvider>
        <div id="settings-admin-page">
            <List />
        </div>
    </SettingsContextProvider>
}