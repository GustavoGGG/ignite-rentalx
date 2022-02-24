import { Category } from "@modules/cars/infra/typeorm/entities/Category"
import { inject, injectable } from "tsyringe"
import { CategoriesRepository } from "@modules/cars/infra/typeorm/repositories/CategoriesRepository"

interface IRequest {
  name: string;
  description: string;
}
@injectable()
class ListCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: CategoriesRepository) {
  }

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.list()
    return categories;
  }

}

export { ListCategoriesUseCase }