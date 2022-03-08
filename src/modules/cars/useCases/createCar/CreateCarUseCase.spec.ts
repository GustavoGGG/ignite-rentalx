import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

interface IFakeCar {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;

}
interface ISutCar {
  createCarUseCase: CreateCarUseCase,
  carsRepository: ICarsRepository
}
const makeSut = (): ISutCar => {
  const carsRepository = new CarsRepositoryInMemory()
  const createCarUseCase = new CreateCarUseCase(carsRepository);
  return { createCarUseCase, carsRepository };
}

const makeFakeCar = (): IFakeCar => {
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

  test('should not be able to create a car with exists license plate', () => {
    expect(async () => {
      const { createCarUseCase } = makeSut()
      const car = makeFakeCar()
      await createCarUseCase.execute(car)
      car.name = 'Car2'
      await createCarUseCase.execute(car)
    }).rejects.toBeInstanceOf(AppError)
  })
  test('should be able to create a car with available true by default', async () => {
    const { createCarUseCase } = makeSut()
    const car = await createCarUseCase.execute(makeFakeCar())
    expect(car.available).toBe(true)
  })
})
