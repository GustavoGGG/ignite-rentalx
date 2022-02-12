import { container } from 'tsyringe'
import { ICategoriesRepository } from '../../modules/cars/repositories/protocols/ICategoriesRepository'
import { CategoriesRepository } from '../../modules/cars/repositories/implementations/CategoriesRepository'
import { ISpecificationsRepository } from '../../modules/cars/repositories/protocols/ISpecificationsRepository'
import { SpecificationsRepository } from '../../modules/cars/repositories/implementations/SpecificationsRepository'

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
)

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
)

