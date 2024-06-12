import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Şifrenizi sıfırlayınız',
        html: `<p>Şifrenizi sıfırlamak için <a href='${resetLink}'>tıklayınız</a> </p>`
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Hesabınızı doğrulayın!',
        html: `<p>Hesabınızı doğrulamak için <a href='${confirmLink}'>tıklayınız</a> </p>`
    })

};
