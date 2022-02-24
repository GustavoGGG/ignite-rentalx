import { AppError } from "@errors/AppError"
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory"
import { ICategoriesRepository } from "@modules/cars/repositories/protocols/ICategoriesRepository"
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

interface IFakeCategory {
  name: string;
  description: string;
}

interface ISutCategory {
  categoriesRepositoryInMemory: ICategoriesRepository;
  createCategoryUseCase: CreateCategoryUseCase;
}
describe(' Create Category UseCase', () => {
  const makeSut = (): ISutCategory => {
    const categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    const createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory)
    return { categoriesRepositoryInMemory, createCategoryUseCase }
  }

  const makeFakeCategory = (): IFakeCategory => {
    return { name: "any_name", description: "any_description" }

  }
  test('should be able to create  a new category', async () => {
    const { categoriesRepositoryInMemory, createCategoryUseCase } = makeSut();
    const { name, description } = makeFakeCategory()
    await createCategoryUseCase.execute({ name, description })
    const categoryCreated = await categoriesRepositoryInMemory.findByName(name)
    expect(categoryCreated).toHaveProperty("id")
  })

  test('should not be able to create  a new category with name exists', async () => {
    expect(async () => {
      const { createCategoryUseCase } = makeSut();
      const { name, description } = makeFakeCategory()
      await createCategoryUseCase.execute({ name, description })
      await createCategoryUseCase.execute({ name, description })
    }).rejects.toBeInstanceOf(AppError)
  })
})
