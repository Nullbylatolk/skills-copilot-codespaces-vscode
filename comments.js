// Create web server
// 1. create a web server
// 2. read the comments.json file and parse it
// 3. send the comments to the client

// 1. create a web server
var http = require('http');
var fs = require('fs');
var url = require('url');

// 2. read the comments.json file and parse it
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// 3. send the comments to the client
var server = http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true);
    if (urlObj.pathname === '/comments' && request.method === 'GET') {
        var commentsToReturn = [];
        if (urlObj.query.name !== undefined) {
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].name === urlObj.query.name) {
                    commentsToReturn.push(comments[i]);
                }
            }
        } else {
            commentsToReturn = comments;
        }
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(commentsToReturn));
    } else if (urlObj.pathname === '/comments' && request.method === 'POST') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var comment = JSON.parse(body);
            comments.push(comment);
            fs.writeFileSync('comments.json', JSON.stringify(comments), 'utf8');
            response.end(JSON.stringify(comments));
        });
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('Not found');
    }
});

server.listen(8080);
console.log('Server is listening on port 8080');