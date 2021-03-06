var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

const PORT = process.env.PORT || 3000

app.get('/',function(req, res){
  res.send('Hello World');
});

server.listen(PORT, function(){
  console.log('Listening on 3000');
})

var clients = [];
var clientNames = [];

io.on('connection', function(socket){

  console.log('a new client connected');

  socket.on('create_client',function(data){
    console.log('create_client :', data);
    
    let username = data;
    socket.name = username;
    clients.push(socket);
    clientNames.push({name: username});
    
    //socket.emit('create_client',`create_client ${clients} is OK`);    
    //socket.emit('create_client',JSON.stringify(clientNames));
    createClient(clients, socket);
    
  });

  socket.on('send_message', function(data){
    console.log('send_message :', data);
    
    let message = data;
    sendMessageToClient(clients, socket, message);
  })

  socket.on('disconnect',function(data){
    console.log('disconnect :', data);    
    deleteClient(clients, socket);
  }); 

});


const createClient = function(clients, socket){
  
  for(let i = 0; i < clients.length; i++){
    let client = clients[i];
    if(client === socket){
      console.log('user', client.name, 'connet');  
      client.emit('create_client',JSON.stringify(clientNames));      
    }else{
      //Do Nothing   
      client.emit('create_client',JSON.stringify(clientNames));      
    }

  }
}

const sendMessageToClient = function(clients, socket, message){
  
    for(let i = 0; i < clients.length; i++){
      let client = clients[i];
      if(client === socket){
        //Do Nothing
        console.log(socket.name,' said :',message);      
        //client.emit('send_message',`${message}`);        
        
      }else{
        client.emit('send_message',`${message}`);        
      }
    }
  
}

const deleteClient = function(clients, socket){
  
    for(let i = 0; i < clients.length; i++){
      let client = clients[i];
      if(client === socket){
        console.log('user', client.name, 'disconnet');
        clients.splice(i, 1 );
        clientNames.splice(i, 1 );  
      }else{
        //Do Nothing        
      }
  }

  for(let i = 0; i < clients.length; i++){
    let client = clients[i];
    client.emit('delete_client',JSON.stringify(clientNames));            
  }
  
}
