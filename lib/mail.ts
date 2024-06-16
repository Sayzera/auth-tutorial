import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '2FA Kodu',
        html: `<p> Your 2FA code ${token} </p>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Şifrenizi sıfırlayınız',
        html: `<p>Şifrenizi sıfırlamak için <a href='${resetLink}'>tıklayınız</a> </p>`
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Hesabınızı doğrulayın!',
        html: `<p>Hesabınızı doğrulamak için <a href='${confirmLink}'>tıklayınız</a> </p>`
    })

};
