const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Students Manager API",
        description: "Students Manager API Information for CSE341 Class",
    },
    host: "https://students-manager-aaet.onrender.com/",
    schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);