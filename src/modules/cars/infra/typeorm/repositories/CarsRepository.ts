import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/protocols/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>
  constructor() {
    this.repository = getRepository(Car)
  }
  async create({ name, description, daily_rate, license_plate, fine_amount, brand, category_id }: ICreateCartDTO): Promise<Car> {
    const car = this.repository.create({
      name, description, daily_rate, license_plate, fine_amount, brand, category_id
    })
    await this.repository.save(car)
    return car
  }
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate })
    return car
  }

}

export { CarsRepository }