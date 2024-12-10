<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1 align="center">User Management API</h1>

## Description

Backend REST API for a user management application that covers:
- CROUD operations
- Authentication
- Authorization

## Tools and packages list
- NestJS: As the backend framework
- Prisma: As the Object-Relational Mapper (ORM)
- Postgres: As the database
- Swagger: As the API documentation tool
- TypeScript: As the programming language

## Development environment
To be able to run this application, you will be expected to:
- Have Node.js installed.
- Have Docker or PostgreSQL installed.

## Project setup
```bash
$ npm install
```
The docker-compose.yml file is a configuration file that will contain the specifications for running a docker container with PostgreSQL setup inside.

```bash
docker-compose up
```
Migrate the database:
```bash
npx prisma migrate dev --name "init"
```
Who likes empty Database? 😜 Let's Seed the database!
```bash
npx prisma db seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test
```