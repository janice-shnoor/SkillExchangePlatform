import nodemailer from 'nodemailer'

let transporter

export async function getMailer() {
  if (transporter) {
    return transporter
  }

  const testAccount = await nodemailer.createTestAccount()

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  return transporter
}

export async function sendEmail({ to, subject, text, html }) {
  const mailer = await getMailer()

  const info = await mailer.sendMail({
    from: '"SkillExchange" <no-reply@skillexchange.test>',
    to,
    subject,
    text,
    html,
  })

  const previewUrl = nodemailer.getTestMessageUrl(info)

  if (previewUrl) {
    console.log('Email preview:', previewUrl)
  }

  return info
}