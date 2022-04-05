import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/procotols/IRentalsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListRentalsByUserUserCase {

  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository
  ) { }
  async execute(user_id: string): Promise<Rental[]> {
    return await this.rentalsRepository.findByUser(user_id)
  }

}

export { ListRentalsByUserUserCase }