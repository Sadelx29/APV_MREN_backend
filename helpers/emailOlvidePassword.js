import nodemailer from 'nodemailer'


const EmailOlvidePassword = async (datos) => {

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos 

    const info = await transport.sendMail({
      from: "APV- Administrador de pacientes de veterinaria",
      to: email,
      subject: 'Restablece tu Password',
      text: 'Comprueba tu cuenta en APV',
      html: `<p>Hola: ${nombre}, haz solicitado restablecer tu password.</p>
          <p>Sigue el siguiente enlance para generar un nuevo password:
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>
          
          <p> Si tu no creaste esta cuenta, puedes ignorar este email </p>
          
          
          
          `
    });

    console.log("Mensaje enviado: %s", info.messageId)


}

export default EmailOlvidePassword