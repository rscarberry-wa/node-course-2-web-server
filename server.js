const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const app = express();

const port = 3000;

const padNum = (num, width) => {
  let s = num + "";
  while(s.length < width) {
    s = "0" + s;
  }
  return s;
};

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', hbs);

app.use((req, res, next) => {
  const date = new Date();
  const now = date.toString();
  // 1-12 instead of 0-11; padNum converts to string
  const month = padNum(1 + date.getMonth(), 2);
  const day = padNum(date.getDay(), 2);
  const year = date.getFullYear();
  const logMessage = `${now}: ${req.method} ${req.url} from ip ${req.ip}`;
  const logFile = `logs/${year}-${month}-${day}.log`;
  console.log(logMessage);
  fs.appendFile(logFile, logMessage + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log: ' + err.message);
    }
  });
  next();
});

app.use((req, res, next) => {
    res.render('maintenance.hbs', {
      pageTitle: 'Maintenance Underway'
    });
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', s => s ? s.toUpperCase() : '');

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
