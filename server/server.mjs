import { Server } from "socket.io"

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
})

const port = 4000
console.log(`Booting server on port: ${port}`)
io.listen(port)