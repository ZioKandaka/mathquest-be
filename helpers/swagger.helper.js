// swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'MathQuest API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }]
  },
  // Files to scan for JSDoc blocks:
  apis: ['./routes/**/*.js', './controllers/**/*.js', './docs/**/*.js'],
};

export function mountDocs(app) {
  const spec = swaggerJSDoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  app.get('/openapi.json', (_req, res) => res.json(spec));
}
