const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KonnYoeung API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000" }]
  },
  // Since you are running app.js from the root 'server' folder, 
  // this path tells Swagger where to find the documentation in your route files.
  apis: ["./routes/*.js"] 
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
