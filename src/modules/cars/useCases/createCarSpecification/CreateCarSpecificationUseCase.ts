import { ICreateCarSpecificationDTO } from "@modules/cars/dtos/ICreateCarSpecificationDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/protocols/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCarSpecificationUseCase {

  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) { }
  async execute({ car_id, specifications_id }: ICreateCarSpecificationDTO): Promise<Car> {
    const carsExists = await this.carsRepository.findById(car_id)
    if (!carsExists) {
      throw new AppError("Car does not exists!")
    }

    if (specifications_id) {
      const specifications = await this.specificationsRepository.findByIds(specifications_id)

      carsExists.specifications = specifications
    }

    const carSpecification = await this.carsRepository.create(carsExists)
    return carSpecification;
  }

}

export { CreateCarSpecificationUseCase }