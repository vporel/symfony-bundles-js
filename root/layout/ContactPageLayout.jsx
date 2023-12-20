import { h } from "preact"
import FlexCenter from "vporel/components/display/FlexCenter"
import { useContext, useEffect } from "preact/hooks"
import AppContext from "../AppContext"

function ContactItem({ iconClassName, children }) {
    return <div className="d-flex align-items-center flex-wrap gap-2 m-2">
        <FlexCenter className="fs-4 -fs-md-3 rounded rounded-3 bg-primary text-white" style={{ width: 40, height: 40 }}><i className={iconClassName} /></FlexCenter>
        <div className="fs-6 -fs-md-5">{children}</div>
    </div>
}

export default function ContactPageLayout({ pageTitle = "Contactez-nous", phone, email, location, socialMedias, mapUrl }) {
    const {theme, setPageProps} = useContext(AppContext)
    useEffect(() => setPageProps(v => ({...v, title: pageTitle, shortTitle: "Contact"})), [pageTitle])

    return <div className="page-content-container py-0 bg-background">
        <div className="container py-5">
            <h1 className="color-text">Pour nous contacter, c'est simple</h1>
            <div className="row py-3 py-md-4">
                <div className="col-12 col-md-6">
                    <div className="section-part">
                        <ContactItem iconClassName="fas fa-phone"><span className="fw-bold">{phone}</span></ContactItem>
                        <ContactItem iconClassName="fas fa-map-marker"><span>{location}</span></ContactItem>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-4 mt-md-0">
                    <div className="section-part">
                        <ContactItem iconClassName="fas fa-envelope"><span>{email}</span></ContactItem>
                        <ContactItem iconClassName="fab fa-facebook"><a href={socialMedias.facebook} target="_blank">Suivez nous sur facebook</a></ContactItem>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center gap-2 pt-4">
                {Object.keys(socialMedias).map(media => <a key={media} href={socialMedias[media]} target="_blank" className="bg-rgb100 text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: 30, height: 30 }}><i className={"fab fa-" + media}></i></a>)}
            </div>
        </div>
        <iframe src={mapUrl} width="100%" height="450" style={{ border: "none" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

}