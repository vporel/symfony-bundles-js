import { reactCustomElement } from "@vporel/react/react"
import LoginPage from "./pages/LoginPage"
import EmailValidationPage from "./pages/EmailValidationPage"

reactCustomElement("x-login-page", LoginPage)
reactCustomElement("x-email-validation-page", EmailValidationPage)