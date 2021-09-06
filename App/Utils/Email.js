//filename=>Email.js

import Helpers from '../Utils/Helpers';

const {mailer} = Helpers

class Email{

    static formSubmitResponseTemplate({to, from, subject}){

        const html_ = `<div>
                <header>
                    <h3 align='center' >${from}</h3>
                    <h4 align='center' > ${subject} </h4>
                </header>

                <section >
                    <p>Thank you for filling the form</p>
                </section>
            </div>`

        return mailer().sendMail({
            to: to,
            from: from,
            subject: subject,
            html:html_
        })
        
    }

    static forgetPasswordTemplate(){

    }

    static paymentConfirmationTemplate(){

    
    }
}

export default Email