import { container } from 'tsyringe'
import { ICategoriesRepository } from '@modules/cars/repositories/protocols/ICategoriesRepository'
import { CategoriesRepository } from '@modules/cars/infra/typeorm/repositories/CategoriesRepository'
import { ISpecificationsRepository } from '@modules/cars/repositories/protocols/ISpecificationsRepository'
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository'
import { IUsersRepository } from '@modules/accounts/repositories/protocols/IUsersRepository'
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository'
import { ICarsRepository } from '@modules/cars/repositories/protocols/ICarsRepository'
import { CarsRepository } from '@modules/cars/infra/typeorm/repositories/CarsRepository'

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

container.registerSingleton<ICarsRepository>(
  "CarsRepository",
  CarsRepository
)