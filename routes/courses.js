const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses');
const validation = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

router.get('/',
    // isAuthenticated,
    coursesController.getCourses);

router.get('/:id',
    // isAuthenticated,
    coursesController.getCourseById);

router.post('/',
    // isAuthenticated,
    validation.saveCourse,
    coursesController.createCourse);
router.put('/:id',
    // isAuthenticated,
    validation.updateCourse,
    coursesController.updateCourseInfo);
router.delete('/:id',
    // isAuthenticated,
    coursesController.deleteCourseById);

module.exports = router;