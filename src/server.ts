import express, { Request, Response } from 'express'
import { router } from './routes/routeProducts'
import cors from 'cors'

const app = express()
app.listen(3333, () => console.log("Server is running on port" + 3333))

app.use(cors())
app.use(express.json())
app.use(router)

app.get('/', (req: Request, res: Response) => {
  res.send("Olá")
})