const Validator = require("validator");
const isEmpty = require("../utils/isEmpty");

module.exports = function validateSignUpInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.passwordConfirmation = !isEmpty(data.passwordConfirmation) ? data.passwordConfirmation: "";

  const { name, email, password, passwordConfirmation } = data;

  if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  if (!Validator.isEmpty(name)) {
    errors.name = "Name field is required.";
  }

  if (!Validator.isEmpty(email)) {
    errors.email = "Email field is required.";
  }

  if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid.";
  }

  if (!Validator.isEmpty(password)) {
    errors.password = "Password field is required.";
  }
  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Confirm password field is required.";
  }

  if (!Validator.equals(password, passwordConfirmation)) {
    errors.email = "Passwords must match.";
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