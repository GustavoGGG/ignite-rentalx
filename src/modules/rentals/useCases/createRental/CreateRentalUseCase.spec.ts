import dayjs from "dayjs";
import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { IRentalsRepository } from "@modules/rentals/repositories/procotols/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO";



interface ISut {
  createRentalUseCase: CreateRentalUseCase;
  rentalsRepository: IRentalsRepository;
  dayjsDateProvider: IDateProvider;
  carsRepository: ICarsRepository;
}
const makeSut = (): ISut => {
  const rentalsRepository = new RentalsRepositoryInMemory()
  const carsRepository = new CarsRepositoryInMemory()
  const dayjsDateProvider = new DayjsDateProvider()
  const createRentalUseCase = new CreateRentalUseCase(rentalsRepository, dayjsDateProvider, carsRepository)
  return { createRentalUseCase, rentalsRepository, dayjsDateProvider, carsRepository }
}

const makeFakeRental = (): ICreateRentalDTO => {
  const dayAdd24Hours = dayjs().add(2, "day").toDate();
  return {
    user_id: 'any_user',
    car_id: "any_car",
    expected_return_date: dayAdd24Hours
  }
}

const makeFakeCar = (): ICreateCartDTO => {
  return {
    name: "Test",
    description: "Car Test",
    daily_rate: 100,
    license_plate: "test_license",
    fine_amount: 40,
    brand: "brand",
    category_id: "123"
  }
}
describe('Create Rental', () => {
  test('should be able to create a new rental', async () => {
    const { createRentalUseCase, carsRepository } = makeSut();
    const car = await carsRepository.create(makeFakeCar())
    const rental = makeFakeRental();
    rental.car_id = car.id
    const response = await createRentalUseCase.execute(rental);
    expect(response).toHaveProperty("id")
    expect(response).toHaveProperty("start_date")
  })

  test('should not be able to create a new rental if there is another open to the same user', async () => {
    const { createRentalUseCase, carsRepository } = makeSut();

    const car = await carsRepository.create(makeFakeCar())
    const rental = makeFakeRental();
    rental.car_id = car.id
    await createRentalUseCase.execute(rental);
    const rental2 = makeFakeRental();
    rental2.car_id = "other_id"
    const promise = createRentalUseCase.execute(rental2);
    expect(promise).rejects.toEqual(new AppError("There's a rental in progress for users!"))
  })

  test('should not be able to create a new rental if there is another open to the same car', async () => {
    const { createRentalUseCase, carsRepository } = makeSut();
    const car = await carsRepository.create(makeFakeCar())
    const rental = makeFakeRental();
    rental.car_id = car.id
    await createRentalUseCase.execute(rental);
    const rental2 = makeFakeRental();
    rental2.car_id = car.id
    rental2.user_id = 'user_id_2'
    const promise = createRentalUseCase.execute(rental2);
    expect(promise).rejects.toEqual(new AppError("Car is unavailable"))
  })

  test('should not be able to create a new rental with invalid return time', async () => {
    const { createRentalUseCase, dayjsDateProvider } = makeSut();
    const rental = makeFakeRental();
    rental.expected_return_date = dayjsDateProvider.dateNow()
    const promise = createRentalUseCase.execute(rental);
    expect(promise).rejects.toEqual(new AppError("Invalid return time!"))

  })
})
