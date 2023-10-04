const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students');
const validation = require('../middleware/validate');

router.get('/', studentsController.getStudents);

router.get('/:id', studentsController.getStudentById);

router.post('/', validation.saveStudent, studentsController.createStudent);
router.put('/:id', validation.saveStudent, studentsController.updateStudentInfo);
router.delete('/:id', studentsController.deleteStudentById);

module.exports = router;