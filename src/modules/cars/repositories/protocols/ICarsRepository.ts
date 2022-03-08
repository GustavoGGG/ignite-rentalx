import { ICreateCartDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";


interface ICarsRepository {
  create(data: ICreateCartDTO): Promise<Car>
  findByLicensePlate(license_plate: string): Promise<Car>
}

export { ICarsRepository }