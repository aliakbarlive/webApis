
const Logger = require("./eventEmiter");

const logger = new Logger();
 logger.on("message", (data) => console.log("call the listener", data))

logger.log('Hello ')
