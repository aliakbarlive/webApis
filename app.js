const {createServer}= require('http') 
const {pid} = process

const server = createServer((req, res)=>{
    const i = 1e7;
    while(i<0){i--}
    console.log(`handling req from ${pid}`)
    res.end(`Hello from  end ${pid}\n`)
}) 

const PORT = Number.parseInt(process.env.PORT|| process.argv[2] ) || 8080
server.listen(PORT,()=> console.log(`server is running on ${PORT}`))
