# Northcoders News API

Must add a .env.developer and a .env.test file to connect to the correct developer and test databases respectively

## Link to hosted site 
```html
 https://nc-news-robin.herokuapp.com/api
```

## Description

A server providing articles on various topics. Allows users to post comments and vote on articles.

## Installation

1. Clone the remote git repository to a local machine.

```bash
git clone https://github.com/robdan54/backend-nc-news.git
```

2. Install the npm dependencies using the command.

```bash
npm install
```
3. setup and seed the databases by running the commands in the order shown below.

```bash
npm setup-dbs
npm seed
```
4. Tests can be run using jest with the command.
```bash 
npm test
```
The test scripts will connect to the test database automatically so there is no need to provide .env files to run the tests. However if you wish to connect to the development or test databases you will need to provide .env files in the form.
```
    PGDATABASE=**your-database-name-goes-here**
```

## Minimum supported versions

node.js v17.4.0

Postgres 8.7.3