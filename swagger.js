const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Students Manager API",
        description: "Students Manager API Information for CSE341 Class",
    },
    host: "students-manager-aaet.onrender.com",
    schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);