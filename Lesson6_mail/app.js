const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const validators = require('./controllers/validators');
const mailer = require('./controllers/mailer');
const errorMsgs = require('./config/routerConfig').errorMessages;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/order/', function (req, res) {
  const html = ejs.render(fs.readFileSync('./views/order-form.ejs').toString(), {});
  res.send(html);
  console.log('GET request: html sent');
});

app.post('/order/',
  validators.validateNoEmptyFields(),
  validators.validatePhone(),
  validators.validateMail(),
  generateId(),
  mailer.mailToManager(),
  mailer.mailToClient(),
  (req, res) => {
    const html = ejs.render(fs.readFileSync('./views/order-ok.ejs').toString(), {id: req.orderID});
    res.send(html);
    console.log('POST request: generated order ' + req.orderID);
  }
);

app.get('/', (req, res) => {
  if (req.query.error) {
    res.status(403).send(errorMsgs[req.query.error]);
  }
  else {
    res.status(401).send(errorMsgs["error_no_route"]); 
  }
  console.log('GET request: ' + req.query.error);
});

app.listen(3000, () => {
    console.log('listening on http://localhost:5000');
});

function generateId() {
  return (req, res, next) => {
    const d = new Date;
    req.orderID = Math.floor(Math.random() * 1000);
    req.orderDate = d.toString();
    next();
  }
}



