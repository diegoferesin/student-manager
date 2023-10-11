const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Student = require('../models/student');

const getStudents = (req, res) => {
    //#swagger.tags = ['Students']
    console.log("Getting all students");
    Student.find().then(students => {
        console.log('Students found: ', students);
        res.status(200).json(students);
    }
    ).catch(err => {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    });
};

const getStudentById = (req, res) => {
    //#swagger.tags = ['Students']
    console.log("Validating studentId");
    if (!ObjectId.isValid(req.params.id)) {
        console.log({ message: "Must use a valid studentID to find a student." });
        res.status(400).json({ message: "Must use a valid studentID to find a student." });
    }
    const studentID = req.params.id;
    console.log(`Getting student by ID: ${studentID}`);
    Student.findById(studentID)
        .then(student => {
            if (student) {
                console.log('Student found it:', student);
                res.status(200).json(student);
            } else {
                console.log(`No student found with ID: ${studentID}`);
                res.status(500).json({ message: `No student found with ID: ${studentID}` });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).json({ message: err.message });
        });
};

const createStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    const { firstName, lastName, email, username, classID } = req.body;
    try {
        console.log(`Validating student username: ${username}`);
        findStudentByUsername(username).then((student) => {
            if (student) {
                console.log({ message: 'Username already exists.' });
                res.status(400).json({ message: 'Username already exists.' });
            } else {
                console.log(`Creating student: ${firstName} ${lastName}`);
                const student = new Student({
                    firstName,
                    lastName,
                    email,
                    username,
                    classID
                });
                const newStudent = student.save().then((student) => {
                    console.log();
                    console.log('Student created successfully');
                    console.log(`StudentID: ${student._id}`);
                    console.log(`Username: ${student.username}`);
                })
                res.status(201).json(student);
            }
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

const updateStudentInfo = async (req, res) => {
    //#swagger.tags = ['Students']
    if (!ObjectId.isValid(req.params.id)) {
        console.log({ message: "Must use a valid studentID to update a student." });
        res.status(400).json({ message: "Must use a valid studentID to update a student." });
    }

    let student = new Student({});
    student._id = req.params.id;

    const studentUpdated = validateAttributes(req, student);

    console.log(`Getting student for update with ID: ${student._id}`);
    Student.findByIdAndUpdate(student._id, studentUpdated, { new: true })
        .then(updatedStudent => {
            if (updatedStudent) {
                console.log('Student updated: ', updatedStudent);
                res.status(200).json(updatedStudent);
            } else {
                console.log(`No student found with ID: ${student._id} for update`);
                res.status(400).json({ message: `No student found with ID: ${student._id} for update` });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).json({ message: err.message });
        });

}

const deleteStudentById = async (req, res) => {
    //#swagger.tags = ['Students']
    if (!ObjectId.isValid(req.params.id)) {
        console.log({ message: "Must use a valid studentID to delete one." });
        res.status(400).json({ message: "Must use a valid studentID to delete one." });
    }

    try {
        console.log(`Deleting student with ID: ${req.params.id}`);
        const studentID = req.params.id;
        const deletedStudent = await Student.findByIdAndRemove(studentID);
        if (deletedStudent == null || !deletedStudent) {
            console.log(deletedStudent);
            res.status(404).json({ message: `No student found with ID: ${studentID} for delete` });;
        }

        console.log(`Student with ID: ${studentID} was removed`)
        res.status(204).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
}

function validateAttributes(req, studentToUpdate) {
    if (req.body.firstName !== undefined && req.body.firstName !== '') {
        studentToUpdate.firstName = req.body.firstName;
    }

    if (req.body.lastName !== undefined && req.body.lastName !== '') {
        studentToUpdate.lastName = req.body.lastName;
    }

    if (req.body.email !== undefined && req.body.email !== '') {
        studentToUpdate.email = req.body.email;
    }

    if (req.body.username !== undefined && req.body.username !== '') {
        studentToUpdate.username = req.body.username;
    }

    if (req.body.classID !== undefined && req.body.classID !== '') {
        studentToUpdate.classID = req.body.classID;
    }
    return studentToUpdate;
}

const findStudentByUsername = async (username) => {
    try {
        const student = await Student.findOne({ username });
        return student;
    } catch (error) {
        throw new Error('Fail finding student by username: ' + error.message);
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudentInfo,
    deleteStudentById
};