module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('disconnect', function(){
      io.emit('users-changed', {user: socket.nickname, event: 'left'});
    });

    socket.on('set-nickname', (nickname) => {
      socket.nickname = nickname;
      io.emit('users-changed', {user: nickname, event: 'joined'});
    });

    socket.on('add-message', (message) => {
      io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
    });
  });
}
