require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const routes = require('./routes');
const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    name: 'firebase',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
app.use(cors());

app.use(express.static('public'));

app.use('/api', routes);
app.get('/', (req, res) => {
  res.status(200).json({
    information: 'Firebase Upload Photo',
  });
});
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

db.sync()
  .then(function () {
    app.listen(port, function (error) {
      if (error) {
        console.log('Something went wrong');
      }
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch(console.error);
