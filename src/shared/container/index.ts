import { container } from 'tsyringe'
import { ICategoriesRepository } from '../../modules/cars/repositories/protocols/ICategoriesRepository'
import { CategoriesRepository } from '../../modules/cars/repositories/implementations/CategoriesRepository'
import { ISpecificationsRepository } from '../../modules/cars/repositories/protocols/ISpecificationsRepository'
import { SpecificationsRepository } from '../../modules/cars/repositories/implementations/SpecificationsRepository'
import { IUsersRepository } from '../../modules/accounts/repositories/protocols/IUsersRepository'
import { UsersRepository } from '../../modules/accounts/repositories/implementations/UsersRepository'

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
)

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
)

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
)