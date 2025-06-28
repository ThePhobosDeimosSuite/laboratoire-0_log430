import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping cart API',
      version: '1.0.0',
    },
    components: {
        securitySchemes: {
            basicAuth: {
                type: 'http',
                scheme: 'basic',
            },
        },
    },
    security: [
        {
            basicAuth: [],
        },
    ],
  },
  apis: ['./src/server.ts']
}

export default swaggerJSDoc(options)