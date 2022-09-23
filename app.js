import {createServer} from 'http'
const {pid} = process
const server = createServer((req, res)=>{

}) 

const PORT = Number.parseInt(process.env.PORT|| process.argv[2] ) || 8080
server.listen(PORT,()=> console.log(`server is running on ${PORT}`))