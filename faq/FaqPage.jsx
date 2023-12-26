import {h, Fragment} from "preact"
import { useContext, useEffect, useState } from "preact/hooks"
import { useFaq } from "./hooks"
import { Accordion, AccordionDetails, AccordionSummary, Tab, Tabs, Typography } from "@mui/material"
import parse from "html-react-parser"
import { Link } from "react-router-dom"
import Loader from "@vporel/react/components/Loader"
import AppContext from "../root/AppContext"

export default function FaqPage({pageTitle = "FAQ des utilisateurs", contactUrl}){
    const faq = useFaq()
    const [value, setValue] = useState(0)
    const {theme, setPageProps} = useContext(AppContext)

    useEffect(() => setPageProps(v => ({...v, title: pageTitle, shortTitle: "FAQ"})), [pageTitle])

    return <div>
        {theme.innerPageTitleVisible && <div className="banner h-auto py-4 bg-background">
            <div className="container">
                <h1 className="text-center text-md-start">FAQ des utilisateurs</h1>
            </div>
        </div>}
        {faq == null 
            ? <Loader className="-py-6"/>
            : <section>
                <div className="container">
                    <div className="row my-3 my-md-3 py-0 py-md-4">
                        <div className="col-12 col-md-3">
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={(e, newValue) => setValue(newValue)}
                                aria-label="Faq groups tabs"
                                sx={{borderRight: 1, borderColor: 'divider'}}
                            >
                                {faq.map(group => <Tab className="align-items-start" key={group.id} style={{textTransform: "none"}} id={`tab-${group.id}`} aria-controls={`tabpanel-${group.id}`} label={group.name}/>)}
                                <Tab className="align-items-start text-start" style={{textTransform: "none"}} id="tab-question-not-found" aria-controls="tabpanel-question-not-found" label="Je ne trouve pas ma question"/>
                            </Tabs>
                        </div>
                        <div className="col-12 col-md-9 tab-content mt-4 mt-md-0">
                            {faq.map((group, index) => (
                                <div
                                    role="tabpanel"
                                    hidden={value !== index}
                                    id={`tabpanel-${group.id}`}
                                    aria-labelledby={`tab-${group.id}`}
                                >
                                    {value === index && group.questions.map(question => (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<i className="fas fa-chevron-down"/>}><Typography className="fw-bold">{question.question}</Typography></AccordionSummary>
                                            <AccordionDetails>{parse(question.answer)}</AccordionDetails>
                                        </Accordion>
                                        
                                    ))}
                                </div>
                            ))}
                            <div role="tabpanel"
                                hidden={value !== faq.length}
                                id={`tabpanel-question-not-found`}
                                aria-labelledby={`tab-question-not-found`}
                            >
                                <h2 className="text-primary">Votre question n'est pas dans cette FAQ ?</h2>
                                <p className="mt-5">
                                    Dans ce cas, il vous suffit de nous contacter en <Link to={contactUrl} className="text-decoration-underline">cliquant ici</Link>.
                                    <br /><br />
                                    Nous vous répondrons dans les plus brefs délais.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        }
    </div>
}