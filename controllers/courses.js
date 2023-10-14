const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Courses = require('../models/courses');

const getCourses = (req, res) => {
    //#swagger.tags = ['Courses']
    console.log("Getting all courses");
    Courses.find().then(courses => {
        console.log('Courses found: ', courses);
        res.status(200).json(courses);
    }
    ).catch(err => {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    });
};

const getCourseById = (req, res) => {
    //#swagger.tags = ['Courses']
    console.log("Validating courseId");
    if (!ObjectId.isValid(req.params.id)) {
        console.log("Must use a valid courseID to find a course.");
        res.status(400).json({ message: "Must use a valid courseID to find a course." });
    }
    const courseID = req.params.id;
    console.log(`Getting course by ID: ${courseID}`);
    Courses.findById(courseID)
        .then(course => {
            if (course) {
                console.log('Course found it:', course);
                res.status(200).json(course);
            } else {
                console.log(`No course found with ID: ${courseID}`);
                res.status(500).json({ message: `No course found with ID: ${courseID}` });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).json({ message: err.message });
        });
};

const createCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    const { courseName, description, code, duration, level } = req.body;
    try {
        console.log(`Creating course, Name: ${courseName}, Code: ${code}`);
        const course = new Courses({
            courseName, description, code, duration, level
        });
        const newCourse = course.save().then((course) => {
            console.log();
            console.log('Course created successfully');
            console.log(`CourseID: ${course._id}`);
            console.log(`Course Code: ${course.code}`);
        })
        res.status(201).json(course);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

const updateCourseInfo = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        console.log("Must use a valid courseID to update a course.");
        res.status(400).json({ message: "Must use a valid courseID to update a course." });
    }

    let course = new Courses({});
    course._id = req.params.id;

    const courseUpdated = validateAttributes(req, course);

    console.log(`Getting course for update with ID: ${course._id}`);
    Courses.findByIdAndUpdate(course._id, courseUpdated, { new: true })
        .then(updatedCourse => {
            if (updatedCourse) {
                console.log('Course updated: ', updatedCourse);
                res.status(200).json(updatedCourse);
            } else {
                console.log(`No course found with ID: ${course._id} for update`);
                res.status(400).json({ message: `No course found with ID: ${course._id} for update` });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).json({ message: err.message });
        });

}

const deleteCourseById = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        console.log({ message: "Must use a valid courseID to delete one." });
        res.status(400).json({ message: "Must use a valid courseID to delete one." });
    }

    try {
        console.log(`Deleting course with ID: ${req.params.id}`);
        const courseID = req.params.id;
        const deletedCourse = await Courses.findByIdAndRemove(courseID);
        if (deletedCourse == null || !deletedCourse) {
            console.log(deletedCourse);
            res.status(404).json({ message: `No course found with ID: ${courseID} for delete` });;
        }

        console.log(`course with ID: ${courseID} was removed`)
        res.status(204).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
}

function validateAttributes(req, studentToUpdate) {
    if (req.body.courseName !== undefined && req.body.courseName !== '') {
        studentToUpdate.courseName = req.body.courseName;
    }

    if (req.body.description !== undefined && req.body.description !== '') {
        studentToUpdate.description = req.body.description;
    }

    if (req.body.code !== undefined && req.body.code !== '') {
        studentToUpdate.code = req.body.code;
    }

    if (req.body.duration !== undefined && req.body.duration !== '') {
        studentToUpdate.duration = req.body.duration;
    }

    if (req.body.level !== undefined && req.body.level !== '') {
        studentToUpdate.level = req.body.level;
    }

    return studentToUpdate;
}

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourseInfo,
    deleteCourseById
};