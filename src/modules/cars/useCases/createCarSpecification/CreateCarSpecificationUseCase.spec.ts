import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICreateSpecificationDTO } from "@modules/cars/dtos/ICreateSpecificationDTO";
import { ICreateCarSpecificationDTO } from "@modules/cars/dtos/ICreateCarSpecificationDTO";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/protocols/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"


interface ISut {
  createCarSpecificationUseCase: CreateCarSpecificationUseCase,
  specificationsRepository: ISpecificationsRepository,
  carsRepository: ICarsRepository
}
const makeSut = (): ISut => {
  const carsRepository = new CarsRepositoryInMemory()
  const specificationsRepository = new SpecificationsRepositoryInMemory()
  const createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepository, specificationsRepository);
  return { createCarSpecificationUseCase, specificationsRepository, carsRepository }
}
const makeFakeCarSpecification = (): ICreateCarSpecificationDTO => {
  return {
    car_id: "any_id_car",
    specifications_id: []
  }
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

const makeFakeSpecification = (): ICreateSpecificationDTO => {
  return {
    name: "any_name",
    description: "any_description"
  }

}
describe('Create Car Specification', () => {
  test('should not be able to add a new specification to now-existent car', async () => {
    const { createCarSpecificationUseCase } = makeSut();
    const promise = createCarSpecificationUseCase.execute(makeFakeCarSpecification())
    expect(promise).rejects.toEqual(new AppError("Car does not exists!"))
    //   expect(async () => {
    //     const { createCarSpecificationUseCase } = makeSut();
    //        const car = await carsRepository.create(makeFakeCar())
    //     const carSpecification = makeFakeCarSpecification()
    //       carSpecification.car_id = car.id
    //     await createCarSpecificationUseCase.execute(carSpecification)
    //   }).rejects.toBeInstanceOf(AppError)

  })

  test('should be able to add a new specification to the car', async () => {
    const { createCarSpecificationUseCase, carsRepository, specificationsRepository } = makeSut();
    const car = await carsRepository.create(makeFakeCar())
    const specification = await specificationsRepository.create(makeFakeSpecification())
    const specifications_id = [specification.id]
    const specificationsCars = await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id })
    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications.length).toBe(1)
  })
})
