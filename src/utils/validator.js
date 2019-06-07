import { isEmpty } from 'lodash';

const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateSignup = (name, email, password) => {
  const errors = {};

  if (name === undefined || name.trim() === '' || name.length === 0) {
    errors.name = 'Name is required';
  }

  if (email === undefined || email.trim() === '' || email.length === 0 || !validEmail.test(email)) {
    errors.email = 'A valid email is required';
  }

  if (password === undefined || password.trim() === '' || password.length < 8) {
    errors.password = 'Password greater than 8 characters is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export const validateSignin = (email, password) => {
  const errors = {};

  if (email === undefined || !validEmail.test(email) || email.trim() === '') {
    errors.email = 'Please enter a valid email to sign in';
  }

  if (password === undefined || password.length < 8 || password.trim() === '') {
    errors.password = 'Please enter a valid password to sign in'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export const validateProfile = (
  data
) => {
  let errors = {};
  for (let key in data) {
    if (data[key] === undefined || data[key].trim() === '') {
      errors[key] = `${key} is required.`
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
