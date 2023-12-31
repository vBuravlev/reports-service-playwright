<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Сервис отчетов предназначен для хранения и взаимодействия с сохраненными отчетами Playwright.
База данных - Postgresql
Бэкнед - Nest.js
UI для БД - PG_Admin

## Installation and running the app

```bash
$ docker-compose up -d
```
## Swagger documentation

После запуска приложения можно перейти по адресу
```
http://localhost:3000/docs
``` 
(или по адресу, назначенному в процессе развертывания) и после указания учетных данных (находятся в .env сервера), можно получить доступ к swagger документации по API

## Basic usage

1. Создайте своего пользователя или используйте учетные данные дефолтного пользователя (находятся в .env сервера) - через *POST* запрос на *"/users/signup"*

2. Залогиньтесь - через *POST* запрос на *"/users/login"*

3. Создайте свой конфиг для Cron задач или просто используйте дефолтный – через *POST* запрос *"/configs"*

4. Упакуйте директорию с отчетом playwright в tar архив (можно использовать npm пакет https://www.npmjs.com/package/tar)

5. Отправьте архив с отчетом в хранилище сервиса – через *POST* запрос *"/reports"*

6. Посмотреть сохраненные данные по отчету, можно запросив список отчетов (*get* запрос на *"/reports?offset=0&limit=10*") или обратившись к нему напрямую (*GET* запрос на *"/reports/Id_отчета"*)

7. Скачать tar архив отчета можно через *GET* запрос *"/reports/Id_отчета/files"*

## Technical description

1. Postman collection для тестирования и наладки сервиса находится в *./docs/report-service.postman_collection.json*

2. Принципиальная схема сервиса 
<img width="100%" title="Принципиальная схема сервиса" src="docs/PrincipalScheme.png">

3. Отчеты хранятся заданный промежуток времени. Удаление устаревших отчетов осуществляется по Cron'у. Подробнее в swagger документации.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
