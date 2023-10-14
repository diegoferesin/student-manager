const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students');
const validation = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

router.get('/',
    // isAuthenticated, 
    studentsController.getStudents);

router.get('/:id',
    // isAuthenticated,
    studentsController.getStudentById);

router.post('/',
    // isAuthenticated,
    validation.saveStudent, studentsController.createStudent);
router.put('/:id',
    // isAuthenticated,
    validation.updateStudent, studentsController.updateStudentInfo);
router.delete('/:id',
    // isAuthenticated,
    studentsController.deleteStudentById);

module.exports = router;