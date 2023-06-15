import session from 'express-session';
import passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  const configService = app.get(ConfigService);

  /**
   * Логирование
   */
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  /**
   * Глобальные миделлвары
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({ credentials: true, origin: true });

  /**
   * Middleware
   */
  const BODY_PARSER_LIMIT_MB = configService.get<number>('BODY_PARSER_LIMIT_MB', { infer: true });
  const BODY_URLENCODED_LIMIT_MB = configService.get('BODY_PARSER_LIMIT_MB');
  const BODY_URLENCODED_LIMIT_COUNT = configService.get<number>('BODY_URLENCODED_LIMIT_COUNT', { infer: true });
  const RATE_LIMIT_PENDING_TIME = configService.get<number>('RATE_LIMIT_PENDING_TIME', { infer: true });
  const RATE_LIMIT_MAX_CONNECTIONS = configService.get<number>('RATE_LIMIT_MAX_CONNECTIONS', { infer: true });

  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: BODY_PARSER_LIMIT_MB, }));
  app.use(
    bodyParser.urlencoded({
      limit: BODY_URLENCODED_LIMIT_MB,
      extended: true,
      parameterLimit: BODY_URLENCODED_LIMIT_COUNT,
    }),
  );
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: parseInt(RATE_LIMIT_PENDING_TIME),
      max: parseInt(RATE_LIMIT_MAX_CONNECTIONS),
      message: `Слишком большое количестов запросов с этого IP, пожалуйста, повторите попытку позже`,
    }),
  );

  /**
   * Авторизация
   */
  const SESSION_SECRET_KEY = configService.get('SESSION_SECRET_KEY');
  app.use(
    session({
      secret: SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());


  /**
   * OpenApi документация
   */
  const API_VERSION = configService.get('API_VERSION');
  const PREFIX_API = configService.get('PREFIX_API');
  const GLOBAL_PREFIX_API = `/${PREFIX_API}/${API_VERSION}`;
  app.setGlobalPrefix(GLOBAL_PREFIX_API);

  const SWAGGER_APP_TAG = configService.get('SWAGGER_APP_TAG');
  const SWAGGER_APP_NAME = configService.get('SWAGGER_APP_NAME');
  const SWAGGER_APP_DESCRIPTION = configService.get('SWAGGER_APP_DESCRIPTION');
  const SWAGGER_USER = configService.get('SWAGGER_USER');
  const SWAGGER_PASSWORD = configService.get('SWAGGER_PASSWORD');
  const SWAGGER_URL = configService.get('SWAGGER_URL');

  app.use(
    [`/${SWAGGER_URL}`, `/${SWAGGER_URL}-json`],
    basicAuth({
      challenge: true,
      users: {
        [SWAGGER_USER]: SWAGGER_PASSWORD,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_APP_NAME)
    .setDescription(SWAGGER_APP_DESCRIPTION)
    .addTag(SWAGGER_APP_TAG)
    .addServer(GLOBAL_PREFIX_API)
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie'
    })
    .build()

  const options = {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup(`/${SWAGGER_URL}`, app, document, options);


  /**
   * Запуск приложения
   */
  const PORT = configService.get<number>('PORT', { infer: true });
  await app.listen(parseInt(PORT), () => process.stdout.write(`The server is running on port ${PORT}`));

}

bootstrap().catch(e => {
  process.stdout.write(e)
  throw e;
});


