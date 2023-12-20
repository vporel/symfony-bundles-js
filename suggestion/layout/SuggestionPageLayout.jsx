import { h } from "preact"
import { useCallback, useContext, useEffect, useState } from "preact/hooks"
import { MenuItem, TextField } from "@mui/material"
import { ButtonPrimary } from "vporel/components/Button"
import ToastContext from "vporel/contexts/ToastContext"
import { createSuggestion } from "../api"
import AppContext from "../../root/AppContext"

export default function SuggestionPageLayout({ pageTitle = "Vos idées comptent", socialMedias, subjects = [] }) {
    const {theme, setPageProps} = useContext(AppContext)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const {toastSuccess, toastWarning} = useContext(ToastContext)

    const handleSubmit = useCallback(async e => {
        e.preventDefault()
        if(subject == "" || message == "") return toastWarning("Remplissez tous les champs")
        if(message.length < 10) return toastWarning("Au moins 10 caractères")
        setLoading(true)
        const response = await createSuggestion(subject, message)
        if(response.status){
            toastSuccess("Votre suggestion a été enregistrée")
            setSubject("")
            setMessage("")
        }
        setLoading(false)
    }, [subject, message, toastSuccess, toastWarning])

    useEffect(() => setPageProps(v => ({...v, title: pageTitle, shortTitle: "Suggestions"})), [pageTitle])

    return  <div className="container container-sm -w-md-50">
        <div className="text-center">
            <i className="fas fa-address-card text-primary" style={{fontSize: "4rem"}}></i>
            <h1 className="h2 mt-2">Boite à Suggestions</h1>
        </div>
        <div class="rounded p-4 mt-4" style={{boxShadow: "0 0 5px rgba(0, 0, 0, .1)"}}>
            <p><strong>Bienvenue</strong> dans notre Boite à <strong>Suggestions</strong>. C'est ici que nous écoutons vos idées dans le seul but d'améliorer votre expérience sur le site.<i class="smile icon" style="color:#00a0dc"></i></p>
            <div className="social-media d-flex mt-3 gap-2">
                {Object.keys(socialMedias).map(media => <a key={media} className="color-secondary" href={socialMedias[media]} target="_blank"><i className={"fab fa-"+media}></i></a>)}
            </div>
        </div>
        <form className="mt-3" onSubmit={handleSubmit}>
            <TextField label="Sujet" select fullWidth value={subject} onChange={e => setSubject(e.target.value)} required>
                <MenuItem value=""></MenuItem>
                {subjects.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                <MenuItem value="autre">Autre</MenuItem>
            </TextField>
            <TextField label="Votre suggestion" fullWidth multiline minRows={5} className="mt-3" value={message} onChange={e => setMessage(e.target.value)} required/>
            <div className="d-flex justify-content-end mt-3">
                <ButtonPrimary iconName="paper-plane" type="submit" loading={loading}>Envoyer</ButtonPrimary>
            </div>
        </form>
    </div>
}