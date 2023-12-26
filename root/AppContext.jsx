import { h, createContext } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "react-router-dom";
import { onMobile, standaloneMode } from "@vporel/js/standard";
import { ThemeProvider } from "@mui/material";


const AppContext = createContext({})

export function AppContextProvider({appName, appKeyName, muiTheme, theme, children}){
    const _theme = useMemo(() => {
        const themeProps = {layout: 1, ...theme}
        themeProps.innerPageTitleVisible = themeProps.layout == 1 || !onMobile()
        return themeProps
    }, [theme])
    const [pageProps, setPageProps] = useState({title: null, shortTitle: null})
    const location = useLocation()
    /**
     * The value of this variable changes when the location changes
     * I's used to notify the components unables to the use properly the 'useLocation' hook
     */
    const [locationSignal, setLocationSignal] = useState(false)

    useEffect(() => {
        setLocationSignal(v => !v)
    }, [location])

    useEffect(() => {
        if(standaloneMode()){
            document.body.classList.add("standalone")
        }
    }, [])

    useEffect(() => {
        if(pageProps.title) document.title = pageProps.title
    }, [pageProps])

    return <AppContext.Provider value={{appName, appKeyName, theme: _theme, locationSignal, pageProps, setPageProps}}>
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    </AppContext.Provider>
}

export default AppContext