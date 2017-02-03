const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const mailConfig = require('../config/mailConfig');

module.exports = {
  mailToManager,
  mailToClient
};

function mailToManager() {
  return (req, res, next) => {
    const data = req.body;

    const transporter = nodeMailer.createTransport({
        service: mailConfig.service,
        auth: mailConfig.mailCreds
    });

    const managerMailOptions = {
        from: `Test mail <${mailConfig.fromMail}>`,
        to: mailConfig.managerMail,
        bcc: mailConfig.managerMail,
        subject: `Order ${req.orderID}: ${data.first_name} ${data.last_name}`,
        forceEmbeddedImages: false,
        html: ejs.render(fs.readFileSync('./views/manager_mail.ejs').toString(),
            {
                name: data.first_name,
                sname: data.last_name,
                email: data.mail,
                phone: data.phone,

                orderId: req.orderID,
                product: data.product,
                date: req.orderDate
            }
        )
    };
    transporter.sendMail(managerMailOptions, error => {
        transporter.close();
        if (error) {
            res.redirect('/?error=error_sending_mail');
            console.log(error.message);
            return;
        }
        return next();
    });
  }
}

function mailToClient() {
  return (req, res, next) => {
    const data = req.body;

    const transporter = nodeMailer.createTransport({
        service: mailConfig.service,
        auth: mailConfig.mailCreds
    });

    const clientMailOptions = {
        from: `Test mail <${mailConfig.fromMail}>`,
        to: data.mail,
        subject: `Your order ${req.orderID} in Larek shop is submitted`,
        forceEmbeddedImages: false,
        html: ejs.render(fs.readFileSync('./views/client_mail.ejs').toString(),
            {
                name: data.first_name,
                orderId: req.orderID,
                product: data.product,
                date: req.orderDate
            }
        )
    };
    transporter.sendMail(clientMailOptions, error => {
        transporter.close();
        if (error) {
            res.redirect('/?error=error_sending_mail');
            console.log(error.message);
            return;
        }
        return next();
    });
  }
}
