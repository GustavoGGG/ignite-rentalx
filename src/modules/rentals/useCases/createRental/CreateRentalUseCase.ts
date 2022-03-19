import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/procotols/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";


@injectable()
class CreateRentalUseCase {

  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) { }

  async execute({ user_id, car_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const minimumHours: number = 24
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id)

    if (carUnavailable) {
      throw new AppError("Car is unavailable")
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id)

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for users!")
    }

    const dateNow = this.dateProvider.dateNow()
    const compare = this.dateProvider.compareInHours(dateNow, expected_return_date)

    if (compare < minimumHours) {
      throw new AppError("Invalid return time!")
    }
    const rental = await this.rentalsRepository.create({
      user_id, car_id, expected_return_date
    })

    return rental
  }
}

export { CreateRentalUseCase }