## Contents
- [Technology Stack](https://gitlab.com/noni-brands/better-seller/-/edit/develop/README.md#technology-stack)
- [Setup](https://gitlab.com/noni-brands/better-seller/-/edit/develop/README.md#setup)
- [Mailtrap](https://gitlab.com/noni-brands/better-seller/-/edit/develop/README.md#mailtrap)

## Technology Stack

- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [Reactstrap](https://reactstrap.github.io/)
- [Sass](https://sass-lang.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Docker](https://www.docker.com/)

## Setup

This setup requires that you have Docker and Docker Compose installed on your your system.

For **MacOS and Windows** users, you should only need to install [Docker Desktop](https://www.docker.com/products/docker-desktop). Docker Desktop includes both Docker Engine and Docker Compose.

For **Linux** users, you have to separetely install Docker and Docker Compose. You can follow this [guide](https://docs.docker.com/compose/install/). 

### 1. Spin up containers with Docker Compose
Once you clone this repository to your local machine, run the docker-compose command below to spin up the containers:

```
docker-compose up
```

If you are running Linux, you might need to run the command above with sudo:

```
sudo docker-compose up
```

The application should now be running on:

```
http://localhost
```

When you make a change to the client or server files, the respective Docker containers running will recompile automatically. In other words, hot-reloading is enabled.

### 2. Database migration with Sequelize CLI

A migration needs to take place in order to create the necessary database tables for the application to work.

If you want to learn more about how migrations work with Sequelize CLI, you can give this part of the [Sequelize documentation](https://sequelize.org/master/manual/migrations.html) a read.

To run the migrations, you would need to enter the backend/api container :

```
docker exec -it better-seller_api_1 sh
```

Once you are inside the container, you can run:
```
npx sequelize-cli db:migrate
```

### 3. Database seeder with Sequelize CLI
Now that you have the database tables created, it's time to seed them with data. 

Make sure that you are still inside the container from step 2. To run all seeders, you can run:

```
npx sequelize-cli db:seed:all
```
That's it! The application should be fully running now. 

You can log on with the default user:

- **Email:** damagecontrol@betterseller.com
- **Password:** password

This account is already associated to a Seller Central account by Damage Control(delano.romero@gmail.com).

### 4. Set up Postgres GUI tool with pgAdmin (optional)

If you want to manage the database with a GUI, pgAdmin is the way to go. You can download the latest pgAdmin 4 through this [link](https://www.pgadmin.org/download/).

Once you install pgAdmin, you can add the database server with the following credentials:

- **Host name/address:** localhost
- **Port:** 5432
- **Maintenance database:** postgres
- **Username:** postgres
- **Password:** postgres_password

## Mailtrap
Since we don't have a specific domain purchased just yet, we're utilizing a dev mail server for now. 

The all emails send by the sendEmail utility will be received in our shared Mailtrap account. To login, you can use the credentials below:
- **Username:** developers@nonibrands.com
- **Password:** qB15DUlC00go
