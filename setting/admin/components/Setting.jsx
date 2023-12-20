import {Fragment, h} from "preact"
import { ButtonLight, ButtonPrimary } from "vporel/components/Button"
import { useCallback, useContext, useState } from "preact/hooks"
import SettingsContext from "../../SettingsContext"
import { useToggle } from "vporel/hooks"
import { Form } from "react-bootstrap"
import { FilesUploadBox } from "vporel/components/FilesUploadBox"

function Value({setting}){
    if(setting.type == "image"){
        if(setting.value == null || setting.value == "") return "Aucune image"
        else{
            if(!setting.multiple) return <img src={setting.folder+"/"+setting.value} alt={setting.value} style={{maxHeight: "70px"}}/>
            else return <div className="d-flex gap-2 flex-wrap">{setting.value.map(img => <img key={img} src={setting.folder+"/"+img} alt={setting.value} style={{maxHeight: "70px"}}/>)}</div>
        }
    }

    return <span className="text-primary">{setting.value}</span>

}

function Edit({setting, onEdit}){
    const {editSetting, editSettingImage} = useContext(SettingsContext)
    const [saving, setSaving] = useState(false)
    const [files, setFiles] = useState([])
    const [filesToRemove, setFilesToRemove] = useState([])
    
    const save = useCallback(async () => {
        setSaving(true)
        if(setting.type = "image"){
            if(await editSettingImage(setting.key, filesToRemove, !setting.multiple ? files[0] : files))
                onEdit()
            setSaving(false)
        }
    }, [setting, files, editSetting, filesToRemove, editSettingImage, onEdit])

    switch(setting.type){
        case "image": {
            if(!setting.multiple)
                return <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                    <Form.Control type="file" accept={setting.extensions.join(", ")} onChange={e => setFiles(e.target.files)}/>
                    <ButtonPrimary iconName="save" loading={saving} disabled={files.length == 0 || saving} onClick={save}/>
                </div>
            else
                return <div>
                    <FilesUploadBox 
                        style="blocks" extensions={setting.extensions} onFilesChange={setFiles}
                        initialFiles={setting.value} initialFilesPath={setting.folder}
                        onRemoveInitialFile={fileName => setFilesToRemove(fls => [...fls, fileName])}
                    />
                    <div className="d-flex justify-content-end">
                    <ButtonPrimary iconName="save" loading={saving} disabled={(files.length == 0 && filesToRemove.length == 0) || saving} onClick={save}>Enregistrer</ButtonPrimary>
                    </div>
                </div>
        }
        default: return <div/>
    }
}

export default function Setting({setting}){
    const [editing, toggleEditing] = useToggle(false)

    return <div className="rounded bg-rgb245 hover:bg-rgb230 p-3">
        <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
            <label className="fw-bold d-block -w-100 -w-md-30">{setting.name}</label>
            <span className="-w-100 -w-md-50"><Value setting={setting} /></span>
            <div className="-w-100 -w-md-20 d-flex justify-content-start justify-content-md-end gap-2">
                <ButtonPrimary iconName="edit" onClick={toggleEditing}/>
                <ButtonLight iconName="undo" />
            </div>
        </div>
        {editing && <div className="mt-2"><Edit setting={setting} onEdit={toggleEditing}/></div>}
    </div>
}