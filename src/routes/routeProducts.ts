import { Router } from "express";
import { controllers } from "../controllers/controllerProducts";
export const router = Router()

router.get('/products', controllers.read)
router.post('/products', controllers.create)
router.put('/products/:id', controllers.update)
router.delete('/products/:id', controllers.delete)