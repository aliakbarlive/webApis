const EventEmiter = require('events')

// create emiter class
class MyEmiter extends EventEmiter {}

// init object
const myemiter = new MyEmiter()

// eventlister 
myemiter.on('event', ()=> console.log('my event is initialized'))
myemiter.emit('event')
myemiter.emit('event')


