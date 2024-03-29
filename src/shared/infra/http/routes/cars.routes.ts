import { Router } from "express"
import multer from "multer"
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated"
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin"
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController"
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController"
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController"
import uploadConfig from "@config/upload"

const carsRoutes = Router()
const createCarController = new CreateCarController()
const listAvailableCarsController = new ListAvailableCarsController()
const createCarSpecificationController = new CreateCarSpecificationController()
const uploadCarImagesController = new UploadCarImagesController()

const uploadImage = multer(uploadConfig)

carsRoutes.post('/', ensureAuthenticated, ensureAdmin, createCarController.handle)

carsRoutes.get('/available', listAvailableCarsController.handle)

carsRoutes.post('/specifications/:id', ensureAuthenticated, ensureAdmin, createCarSpecificationController.handle)

carsRoutes.post('/images/:id', ensureAuthenticated, ensureAdmin, uploadImage.array("images"), uploadCarImagesController.handle)

export { carsRoutes }