/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionCase = "name"; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hi, I am a chatbot for chloemoomoomoo. AMA."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "Before we moo, What can I call you?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionCase = bot(data, socket, questionCase); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});

//--------------------------CHAT BOT FUNCTION-------------------------------//


function bot(data, socket, questionCase) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  console.log("1  *****from bot",input, questionCase);
  /// These are the main statments that make up the conversation.
  questionCase = processInput(input);
  console.log("2  *****from bot",input, questionCase);

  switch(questionCase) {
    case "name":
      answer = 'Hello ' + input + ' 🐮'; // output response
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "yourself":
      answer = "My name is Mardhika, I’m a PhD student at Cornell Tech. I'm interested in blockmoo and deep mooning."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "daily_food":
      answer = "I drink half and half on my tough days and bitcoins on regular days."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "favorite_food":
      answer = "I louu Mootiful Roosevelt Island pasture."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "mood":
      answer = "I always feel mooti-ful."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "day":
      answer = "I usually moo in the morning, a little moo in the afternoon and then moo again later in the evening. It’s hard."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "weekends":
      socket.emit('changeBG', '/images/mardhika.png');
      answer = "On the weekends, I chill and moo."
      waitTime = 5000;
      question = 'Ask Moo Anything!'; // load next question
      break;
    case "bye":
      answer = "It was nice talking to you, Find me on Instagram."
      waitTime = 0;
      question = '';
      break;
  }

  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  // return (questionNum + 1);
  return questionCase;
}
function processInput(input)
{
  input = input.toLowerCase();
  var questionCase = "name";
  console.log("input data: ----", input);

  if (input.includes("yourself"))
    questionCase = "yourself";
  else if (input.includes("favorite food"))
    questionCase =  "favorite_food";
  else if (input.includes("drink") || input.includes("food") || input.includes("eat"))
    questionCase = "daily_food";
  else if (input.includes("mood"))
    questionCase =  "mood";
  else if(input.includes("day") || input.includes("daily"))
    questionCase = "day";
  else if (input.includes("weekends"))
    questionCase = "weekends";
  else if (input.includes("bye") || input.includes("thank"))
    questionCase = "bye";
  return questionCase;
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
