import nodemailer from 'nodemailer'


const emailRegistro = async (datos) => {

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
      subject: 'Compuerba tu cuenta en APV',
      text: 'Comprueba tu cuenta en APV',
      html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
          <p>Tu cuenta ya esta lista, solo debes comprobarlo en el siguiente enlace:
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta </a> </p>
          
          <p> Si tu no creaste esta cuenta, puedes ignorar este email </p>
          
          
          
          `
    });

    console.log("Mensaje enviado: %s", info.messageId)


}

export default emailRegistro