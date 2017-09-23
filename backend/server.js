var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'),
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/masprojectbdd', {useMongoClient: true})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

// ADD ROUTES
var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);

var lessonRoutes = require('./api/routes/lessonRoutes');
lessonRoutes(app);


// START APP
app.listen(port);

console.log('nodetest RESTful API server started on: ' + port);
