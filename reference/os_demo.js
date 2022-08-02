const os = require('os')

// get the cpu platfrom
console.log(os.platform())


// get cpu architecture
console.log(os.arch())

// get home directory
console.log(os.homedir())

// get hostname
console.log(os.hostname());

// get the userinfo
console.log(os.userInfo());

// get free memory
console.log('free Memory---->', os.freemem());

// get total memory
console.log('total memory---->', os.totalmem());