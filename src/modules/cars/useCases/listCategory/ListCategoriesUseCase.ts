import { Category } from "@modules/cars/entities/Category"
import { inject, injectable } from "tsyringe"
import { CategoriesRepository } from "@modules/cars/repositories/implementations/CategoriesRepository"

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