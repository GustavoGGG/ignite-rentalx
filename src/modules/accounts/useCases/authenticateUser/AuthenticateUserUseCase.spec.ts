import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/protocols/IUsersTokensRepository";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

interface ISutAuthenticate {
  userRepositoryInMemory: IUsersRepository;
  authenticateUserUseCase: AuthenticateUserUseCase;
  createUserUseCase: CreateUserUseCase;
  usersTokensRepositoryInMemory: IUsersTokensRepository;
  dataProvider: IDateProvider;
}

interface IFakeUser {
  driver_license: string;
  email: string;
  password: string;
  name: string;
}

const makeFakeUser = (): IFakeUser => {
  return {
    driver_license: "any_license",
    email: "any_email@mail.com",
    password: "any_password",
    name: "any_name"
  }
}
describe('Authenticate User Use Case', () => {
  const makeSut = (): ISutAuthenticate => {
    const userRepositoryInMemory = new UserRepositoryInMemory();
    const usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    const dataProvider = new DayjsDateProvider()
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dataProvider)
    const createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    return {
      userRepositoryInMemory,
      authenticateUserUseCase,
      createUserUseCase,
      usersTokensRepositoryInMemory,
      dataProvider
    }
  }

  test('should be able to authenticate an user', async () => {
    const { authenticateUserUseCase, createUserUseCase } = makeSut()
    await createUserUseCase.execute(makeFakeUser())
    const { email, password } = makeFakeUser()
    const result = await authenticateUserUseCase.execute({
      email,
      password
    })

    expect(result).toHaveProperty("token")
  })

  test('should not be able to authenticate an nonexistent user', async () => {
    const { authenticateUserUseCase } = makeSut()
    const { email, password } = makeFakeUser()
    const promise = authenticateUserUseCase.execute({
      email,
      password
    })
    expect(promise).rejects.toEqual(new AppError("Email or password incorrect!"))
  })

  test('should not be able to authenticate with incorrect password', async () => {
    const { authenticateUserUseCase, createUserUseCase } = makeSut()
    await createUserUseCase.execute(makeFakeUser())
    const { email } = makeFakeUser()
    const promise = authenticateUserUseCase.execute({
      email,
      password: "incorrect password"
    })
    expect(promise).rejects.toEqual(new AppError("Email or password incorrect!"))
  })

})
