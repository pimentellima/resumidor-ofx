import nodemailer from 'nodemailer'

async function sendEmail(emailAddress: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_EMAIL_PASS,
        },
    })

    await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: emailAddress,
        subject: subject,
        html,
    })
}

export const sendVerificationRequest = async (params: any) => {
    let {
        identifier: email,
        url,
        provider: { from },
    } = params
    try {
        await sendEmail(
            email,
            'Login Link to your Account',
            '<p>Click the magic link below to sign in to your account:</p>\
               <p><a href="' +
                url +
                '"><b>Sign in</b></a></p>'
        )
    } catch (error) {
        console.log({ error })
    }
}
