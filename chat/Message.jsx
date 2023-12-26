import {Fragment, h} from "preact"
import _ from "@vporel/js/translator"
import { userSignal } from "~/globals"
import { format } from "date-fns"
import { parseDate } from "@vporel/js/date"
import { Box } from "@mui/material"

const containerClasses = highlight => "rounded-2 "+(highlight ? "bg-primary text-white" : "bg-rgb240")

function Files({message, highlight}){

    return <Box className={"d-flex flex-column gap-1 -w-80"}>
        {message.filesData.map((file, index) => {
            return <Box className={"p-1 "+containerClasses(highlight)}>
                {file.image && <img src={file.src} className="w-100 rounded-2" />}
                {(index == message.filesData.length - 1 && (!message.content || message.content != "")) && <span className="d-block mt-1 text-end" style={{fontSize: ".6rem"}}>{format(parseDate(message.sentAt), "dd/MM/yyyy HH:mm")}</span>}
            </Box>
        })}
    </Box>
}

/**
 * @param {*} param0 
 * @returns 
 */
export default function Message({message, highlight}){
    return <Box className={"d-flex flex-column px-2 py-1 gap-1 "+(highlight ? " align-items-end" : "")}>
        {message.files.length > 0 && <Files highlight={highlight} message={message}/>}
        {(message.content && message.content != "") && <Box className={"p-2 "+containerClasses(highlight)} style={{maxWidth: "80%", whiteSpace: "pre-line"}}>
            {message.content}
            <span className="d-block text-end" style={{fontSize: ".6rem"}}>{format(parseDate(message.sentAt), "dd/MM/yyyy HH:mm")}</span>
        </Box>}
    </Box>
}