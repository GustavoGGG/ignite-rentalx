import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO"
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

interface ISut {
  listAvailableCarsUseCase: ListAvailableCarsUseCase
  carsRepositoryInMemory: ICarsRepository
}
const makeSut = (): ISut => {
  const carsRepositoryInMemory = new CarsRepositoryInMemory()
  const listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory)
  return { listAvailableCarsUseCase, carsRepositoryInMemory }
}

const makeFakeCar = (): ICreateCartDTO => {
  return {
    name: "any_name",
    description: "any_description",
    daily_rate: 150,
    license_plate: "any_license_plate",
    fine_amount: 23,
    brand: "any_brand",
    category_id: "any_category"
  }
}
describe('List Cars', () => {
  test('should be able to list all available cars', async () => {
    const { listAvailableCarsUseCase, carsRepositoryInMemory } = makeSut()
    const car = await carsRepositoryInMemory.create(makeFakeCar())
    const cars = await listAvailableCarsUseCase.execute({})
    expect(cars).toEqual([car])
  })
  test('should be able to list all available cars by name', async () => {
    const { listAvailableCarsUseCase, carsRepositoryInMemory } = makeSut()
    const car = await carsRepositoryInMemory.create(makeFakeCar())
    const cars = await listAvailableCarsUseCase.execute({ name: "uuid" })
    expect(cars).toEqual([car])
  })
  test('should be able to list all available cars by brand', async () => {
    const { listAvailableCarsUseCase, carsRepositoryInMemory } = makeSut()
    const car = await carsRepositoryInMemory.create(makeFakeCar())
    const cars = await listAvailableCarsUseCase.execute({ brand: "any_brand" })
    expect(cars).toEqual([car])
  })
  test('should be able to list all available cars by category', async () => {
    const { listAvailableCarsUseCase, carsRepositoryInMemory } = makeSut()
    const car = await carsRepositoryInMemory.create(makeFakeCar())
    const cars = await listAvailableCarsUseCase.execute({ category_id: "any_category" })
    expect(cars).toEqual([car])
  })
})
