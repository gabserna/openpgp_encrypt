Create app folder
$ mkdir html-js-express-pgp
$ cd html-js-express-pgp/

Create entry point and a markdown README file
$ touch index.js
$ touch README.md

Initialize the app
$ npm init -y

Install dependencies
$ npm i express multer openpgp
$ npm i -D dotenv

Create a .env config file and add a scrip to load .env config
$ touch .env

$ mkdir public
$ touch public/index.html
$ touch public/script.js

$ mkdir data
$ echo 'hello data' > data/sample.txt

$ echo node_modules > .gitignore