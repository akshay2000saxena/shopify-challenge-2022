const Validator = require("validator");
const isEmpty = require("../utils/isEmpty");

module.exports = function validateLogInInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  const [email, password] = data;

  if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email field is required.";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}