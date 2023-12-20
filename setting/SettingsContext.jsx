import { h, createContext } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { getSettings, editSetting as serverEditSetting, editSettingImage as serverEditSettingImage} from "./api";

const SettingsContext = createContext({})

export function SettingsContextProvider({children}){
    const [settings, setSettings] = useState(null)

    useEffect(async () => {
        setSettings(null)
        const response = await getSettings()
        if(response.status == 1) setSettings(response.data)
    }, [setSettings])

    const editSetting = useCallback(async (key, value) => {
        const response = await serverEditSetting(key, value)
        if(response.status == 1){
            setSettings(settings => settings.map(s => s.key == key ? {...s, value: response.data} : s))
            return true
        }
        return false
    }, [setSettings])

    const editSettingImage = useCallback(async (key, imagesToRemove, files) => {
        const response = await serverEditSettingImage(key, imagesToRemove, files)
        if(response.status == 1){
            setSettings(settings => settings.map(s => s.key == key ? {...s, value: response.data} : s))
            return true
        }
        return false
    }, [setSettings])

    return <SettingsContext.Provider value={{
        settings,
        editSetting,
        editSettingImage
    }}>{children}</SettingsContext.Provider>
}

export default SettingsContext;