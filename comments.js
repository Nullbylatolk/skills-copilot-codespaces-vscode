// Create a web server
// 1. Handle GET requests for /comments
// 2. Handle POST requests for /comments
// 3. Serve static files from 'public' directory
// 4. Handle GET requests for all other routes
// 5. Listen on port 3000

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET requests for /comments
app.get('/comments', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Handle POST requests for /comments
app.post('/comments', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(comments));
    });
  });
});

// Handle GET requests for all other routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen on port 3000
app.listen(3000, function() {
  console.log('Server started: http://localhost:3000/');
});
