import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { DB } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger } from '@utils/logger';


export function listenApp(app: express.Application, port: string | number, env: string) {
  app.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} =======`);
    logger.info(`🚀 App listening on the port ${port}`);
    logger.info(`=================================`);
  });
}

export function connectToDatabase() {
  DB.sequelize
    .sync()
    .then(() => {
      logger.info('DB synced');
    })
    .catch(e => {
      logger.error('DB sync failed', e);
    });
  logger.info('DB connected');
}

export function initializeMiddlewares(app: express.Application) {
  logger.info('Start Middlewares');
 // app.use(morgan(LOG_FORMAT, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  logger.info('Initialized Middlewares');
}

export function initializeRoutes(app: express.Application, routes: Routes[]) {
  routes.forEach(route => {
    app.use('/', route.router);
  });
  app.use('/static', express.static(__dirname + '/public'));
  logger.debug('Initialized Routes');
}

export function initializeSwagger(app: express.Application) {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Example docs',
      },
    },
    apis: [`${__dirname}/swagger/*.yaml`],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  logger.debug('Initialized Swagger');
}

export function initializeErrorHandling(app: express.Application) {
  app.use(ErrorMiddleware);
  logger.debug('Initialized Error Handling');
}

export default function initializeApp(app: express.Application, routes: Routes[]) {
  try {
    connectToDatabase();
    initializeMiddlewares(app);
    initializeRoutes(app, routes);
    initializeSwagger(app);
    initializeErrorHandling(app);
  } catch (e) {
    logger.error(e);
  }

  return app;
}
