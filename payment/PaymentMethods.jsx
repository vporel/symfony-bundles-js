import { Fragment, h } from "preact"
import { useCallback, useMemo, useState } from "preact/hooks"
import _ from "@vporel/js/translator"
import { cancelCurrentPayment as apiCancelCurrentPayment } from "./api"
import Loader from "@vporel/react/components/Loader"
import { ButtonDanger, ButtonPrimary } from "@vporel/react/components/Button"
import { TextField } from "@mui/material"
import { phoneNumberValidators } from "../../validators"

/**
 * @param {array} methods
 * @param {paymentMethod => Promise} apiFunction
 */
export default function PaymentMethods({methods, apiFunction, defaultPhoneNumber}){
    const [errorMessage, setErrorMessage] = useState(null)
    const [errorCode, setErrorCode] = useState(null)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber) //For the apis that require beforehand a phoneNumber like orange ussd
    const phoneNumberRequired = useMemo(() => {
        return ["orange-ussd"].includes(paymentMethod)
    }, [paymentMethod])

    const submit = useCallback(async () => {
        if(!paymentMethod) return setErrorMessage("Choose a payment method")
        if(paymentMethod == "orange-ussd" && phoneNumberValidators.orange(phoneNumber) != "") return setErrorMessage("Invalid phone number")
        setLoading(true)
        setErrorMessage(null); setErrorCode(null);
        const response = await apiFunction(paymentMethod, phoneNumber)
        if(response){
            if(response.status == 1) window.location = response.data
            else{
                setErrorMessage(response.errorMessage)
                setErrorCode(response.errorCode)
            }
        }else setErrorMessage("Echec de l'opération, veuillez réessayer")
        setLoading(false)
    }, [apiFunction, paymentMethod, phoneNumber])

    const cancelCurrentPayment = useCallback(async () => {
        setLoading(true)
        if((await apiCancelCurrentPayment()).status == 1){
            setErrorMessage(null); setErrorCode(null);
        }
        setLoading(false)
    }, [setLoading, setErrorMessage, setErrorCode])

    return <div className="payment-methods-container">
        <form>
            <div className="choices d-flex flex-column flex-md-row flex-wrap gap-3">
                {methods.map(method => {
                    if(method == "orange-web-payment")
                        return <div className="form-check">
                            <input className="form-check-input" type="radio" id="orange-web-payment" checked={paymentMethod == "orange-web-payment"} onChange={e => {if(e.target.checked) setPaymentMethod("orange-web-payment")}}/>
                            <label className="form-check-label" for="orange-web-payment"><img src="/bundles/payment/images/orange.png" alt="Orange money" style={{height: "80px"}}/></label>
                        </div>
                    if(method == "orange-ussd")
                        return <div className="form-check">
                            <input className="form-check-input" type="radio" id="orange-ussd" checked={paymentMethod == "orange-ussd"} onChange={e => {if(e.target.checked) setPaymentMethod("orange-ussd")}}/>
                            <label className="form-check-label" for="orange-ussd"><img src="/bundles/payment/images/orange.png" alt="Orange money" style={{height: "80px"}}/></label>
                        </div>
                    if(method == "stripe")
                        return <div className="form-check">
                            <input className="form-check-input" type="radio" id="stripe" checked={paymentMethod == "stripe"} onChange={e => {if(e.target.checked) setPaymentMethod("stripe")}}/>
                            <label className="form-check-label" for="stripe"><img src="/bundles/payment/images/visa-mastercard.jpg" alt="Visa"  style={{height: "80px"}}/></label>
                        </div>
                })}
            </div>
            {phoneNumberRequired && <div className="mt-4">
                <TextField fullWidth label="Numéro de téléphone" type="number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
            </div>}
            {errorMessage &&
                <div className="alert alert-warning mt-2"> 
                    {errorCode == "ANOTHER_PAYMENT_IN_PROGRESS"
                        ? <Fragment>
                            {_("Another payment is in progress")}. {" "}
                            <a className="text-decoration-underline" href={errorMessage}>{_("Go to the payment")}</a>
                            <ButtonDanger className="p-1 px-2" onClick={cancelCurrentPayment} disabled={loading}>{_("Cancel it")}</ButtonDanger>
                        </Fragment>
                        : _(errorMessage) + "."
                    }
                </div>
            }
            <div className="actions d-flex gap-2 justify-content-end align-items-center mt-2">
                <ButtonPrimary onclick={submit} loading={loading} disabled={loading || paymentMethod == null} iconName="chevron-right">{_("Continue")}</ButtonPrimary>
            </div>
        </form>
    </div>
}