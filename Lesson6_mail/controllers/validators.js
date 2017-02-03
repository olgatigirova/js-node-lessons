module.exports = {
  validateNoEmptyFields,
  validatePhone,
  validateMail
};

function validateNoEmptyFields() {
  return (req, res, next) => {
    const data = req.body;
    if (data.first_name.length == 0 ||
        data.last_name.length == 0 ||
        data.phone.length == 0 ||
        data.mail.length == 0) {
      res.redirect('/?error=error_empty_fields');
      return;
    }
    if (!data.product) {
      res.redirect('/?error=error_no_product');
      return;
    }
    return next();
  };
}

function validatePhone() {
  return (req, res, next) => {
    const phone = req.body.phone;
    if (!checkPhone(phone)) {
      res.redirect('/?error=error_phone');
    }
    else {
        return next();
    }
  };
}

function validateMail() {
  return (req, res, next) => {
    const mail = req.body.mail;
    if (!checkMail(mail)) {
      res.redirect('/?error=error_mail');
    }
    else {
        return next();
    }
  };
}

function checkPhone(phone) {
    const regExp = /^\+*\d[\d\(\)\ -]{4,14}\d$/;
    return regExp.test(phone);
}
function checkMail(mail) {
    const patt = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return patt.test(mail);
}

