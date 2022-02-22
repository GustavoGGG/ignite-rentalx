import { AppError } from "../../../../errors/AppError";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { IUsersRepository } from "../../repositories/protocols/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

interface ISutAuthenticate {
  userRepositoryInMemory: IUsersRepository;
  authenticateUserUseCase: AuthenticateUserUseCase;
  createUserUseCase: CreateUserUseCase;
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
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
    const createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    return {
      userRepositoryInMemory,
      authenticateUserUseCase,
      createUserUseCase
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

    expect(async () => {
      const { authenticateUserUseCase } = makeSut()
      const { email, password } = makeFakeUser()
      await authenticateUserUseCase.execute({
        email,
        password
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  test('should not be able to authenticate with incorrect password', async () => {

    expect(async () => {
      const { authenticateUserUseCase, createUserUseCase } = makeSut()
      await createUserUseCase.execute(makeFakeUser())
      const { email } = makeFakeUser()
      await authenticateUserUseCase.execute({
        email,
        password: "incorrect password"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

})
