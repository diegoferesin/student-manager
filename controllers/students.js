const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const studentsCollection = 'students'

const getStudents = async (req, res) => {
    //#swagger.tags = ['Students']
    const result = await mongodb.getDatabase().db().collection(studentsCollection).find();
    result.toArray((err) => {
        if (err) {
            res.status(500).json({ message: err });
        }
    }).then((students) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    });
};

const getStudentById = async (req, res) => {
    //#swagger.tags = ['Students']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("Must use a valid studentId to find a student.");
    }

    const studentId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection(studentsCollection).find({ _id: studentId });
    result.toArray().then((result) => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);

    }).catch((err) => {
        res.status(500).json({ message: err });
    });
};

const createStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        classID: req.body.classID
    };
    const response = await mongodb.getDatabase().db().collection(studentsCollection).insertOne(student);
    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while updating the student info");
    }
};

const updateStudentInfo = async (req, res) => {
    //#swagger.tags = ['Students']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("Must use a valid studenID to update a student.");
    }

    const studentId = new ObjectId(req.params.id);
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        classID: req.body.classID
    };
    const response = await mongodb.getDatabase().db().collection(studentsCollection).replaceOne({ _id: studentId }, student);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while updating the student's info");
    }
};

const deleteStudentById = async (req, res) => {
    //#swagger.tags = ['Students']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("Must use a valid studentID to delete a student.");
    }

    const studentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection(studentsCollection).deleteOne({ _id: studentId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while deleting the student");
    }
}

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudentInfo,
    deleteStudentById
};