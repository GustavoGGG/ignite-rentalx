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
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  return {
    user_id: 'any_user',
    car_id: "any_car",
    expected_return_date: dayAdd24Hours
  }
}
describe('Create Rental', () => {
  test('should be able to create a new rental', async () => {
    const { createRentalUseCase } = makeSut();
    const rental = await createRentalUseCase.execute(makeFakeRental());
    expect(rental).toHaveProperty("id")
    expect(rental).toHaveProperty("start_date")
  })

  test('should not be able to create a new rental if there is another open to the same user', async () => {
    const { createRentalUseCase } = makeSut();
    await createRentalUseCase.execute(makeFakeRental());
    const rental = makeFakeRental();
    rental.car_id = 'car_id_2'
    const promise = createRentalUseCase.execute(rental);
    expect(promise).rejects.toBeInstanceOf(AppError)
  })

  test('should not be able to create a new rental if there is another open to the same car', async () => {
    const { createRentalUseCase } = makeSut();
    await createRentalUseCase.execute(makeFakeRental());
    const rental = makeFakeRental();
    rental.user_id = 'user_id_2'
    const promise = createRentalUseCase.execute(rental);
    expect(promise).rejects.toBeInstanceOf(AppError)
  })

  test('should not be able to create a new rental with invalid return time', async () => {
    const { createRentalUseCase, dayjsDateProvider } = makeSut();
    const rental = makeFakeRental();
    rental.expected_return_date = dayjsDateProvider.dateNow()
    const promise = createRentalUseCase.execute(rental);
    expect(promise).rejects.toBeInstanceOf(AppError)

  })
})
