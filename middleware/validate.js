const validator = require('../helpers/validate');

const validateInput = (data, rules) => {
  for (const key in data) {
    if (rules.hasOwnProperty(key) && typeof data[key] === rules[key]) {
      return true;
    }
  }
  return false;
};

const saveStudent = (req, res, next) => {
  const validationRule = {
    firstName: 'string',
    lastName: 'string',
    email: 'email',
    username: 'string',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveCourse = (req, res, next) => {
  const validationRule = {
    courseName: 'required|string',
    code: 'required|string',
    level: 'required|string',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const updateStudent = (req, res, next) => {
  const validationRule = {
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    username: 'string'
  };

  const validationResult = validateInput(req.body, validationRule);
  if (!validationResult) {
    res.status(412).send({
      success: false,
      message: 'Validation failed',
      errors: 'At least one attribute should have a value'
    });
  } else {
    next();
  }
};

const updateCourse = (req, res, next) => {
  const validationRule = {
    courseName: 'string',
    description: 'string',
    code: 'string',
    duration: 'string',
    level: 'string'
  };

  const validationResult = validateInput(req.body, validationRule);
  if (!validationResult) {
    res.status(412).send({
      success: false,
      message: 'Validation failed',
      errors: 'At least one attribute should have a value'
    });
  } else {
    next();
  }
};

module.exports = {
  saveStudent,
  updateStudent,
  saveCourse,
  updateCourse
};