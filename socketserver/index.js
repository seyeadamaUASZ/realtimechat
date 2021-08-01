let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// Create instance of mysql
var mysql = require("mysql"); 
// make a connection
var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "db_chat"
});
 
// connect
connection.connect(function (error) {
    // show error if any
});
 
io.on('connection', (socket) => {
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: Date.now()}); 
    connection.query("INSERT INTO messages (sender,message,created_at) VALUES ('" + socket.nickname + "', '" + message.text + "','"+ new Date() +"')", function (error, result) {
        //
    }); 
    console.log('la date '+new Date());  
  });
});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});