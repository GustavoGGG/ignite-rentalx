import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

interface ISutCar {
  createCarUseCase: CreateCarUseCase,
  carsRepository: ICarsRepository
}
const makeSut = (): ISutCar => {
  const carsRepository = new CarsRepositoryInMemory()
  const createCarUseCase = new CreateCarUseCase(carsRepository);
  return { createCarUseCase, carsRepository };
}

const makeFakeCar = (): ICreateCartDTO => {
  return {
    name: "any_name",
    description: "any description",
    daily_rate: 123,
    license_plate: "any_license",
    fine_amount: 456,
    brand: "any_brand",
    category_id: "any_category"
  }
}
describe('Create Car', () => {
  test('should be able to create a new car', async () => {
    const { createCarUseCase } = makeSut()
    const car = await createCarUseCase.execute(makeFakeCar())
    expect(car).toHaveProperty("id")
  })

  test('should not be able to create a car with exists license plate', async () => {
    const { createCarUseCase } = makeSut()
    const car = makeFakeCar()
    await createCarUseCase.execute(car)
    car.name = 'Car2'
    const promise = createCarUseCase.execute(car)
    expect(promise).rejects.toEqual(new AppError("Car already exists!"))
  })
  test('should be able to create a car with available true by default', async () => {
    const { createCarUseCase } = makeSut()
    const car = await createCarUseCase.execute(makeFakeCar())
    expect(car.available).toBe(true)
  })
})
