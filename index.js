const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')
const firebase = require('firebase/app')
require('firebase/database')

var firebaseConfig = {
  apiKey: "AIzaSyDIFM8bHn41NJjnH_-tcfBzOA_ecL1YsZ0",
  authDomain: "swp-exam.firebaseapp.com",
  databaseURL: "https://swp-exam.firebaseio.com",
  projectId: "swp-exam",
  storageBucket: "swp-exam.appspot.com",
  messagingSenderId: "232730242474",
  appId: "1:232730242474:web:be2eeb20ce87f98b"
};
firebase.initializeApp(firebaseConfig);

function writeUserData(time, tweet) {
  firebase
    .database()
    .ref("key/" + time)
    .push(tweet) 
}
 
var client = new Twitter({
  consumer_key: 'ZzSW0cBVfb6vsCVl6msg3e52H',
  consumer_secret: 'HPfS7UBvtXctToWCxyvFKDBBjrMC6NFfM5Zsegt00oGZFcJxgg',
  access_token_key: '893119975723999238-Tf8aemV6MaYAa9EtpKqfwdZko8hu2OB',
  access_token_secret: 'HI2OxxUX8MBSYl6eMHfUDZ9KMIZoba1V9Nt6p5xYKacuD'
});

const port = '4000'

const app = server.listen(port, () => {
  console.log('Server is listening at ' + port)
})

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')

  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const stream = client.stream('statuses/filter', { track: '#TradeWar' })
stream.on('data', function (event) {
  if (event)
    writeUserData(event.timestamp_ms, event.text) 
})
