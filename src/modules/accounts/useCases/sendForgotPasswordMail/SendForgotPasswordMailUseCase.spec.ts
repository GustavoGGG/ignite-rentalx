import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/protocols/IUsersTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { IMailProvider } from "@shared/container/providers/MailProvider/protocols/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

interface ISut {
  sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
  userRepositoryInMemory: IUsersRepository;
  dateProvider: IDateProvider;
  usersTokensRepositoryInMemory: IUsersTokensRepository;
  mailProvider: IMailProvider

}
const makeSut = (): ISut => {
  const userRepositoryInMemory = new UserRepositoryInMemory()
  const dateProvider = new DayjsDateProvider()
  const usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
  const mailProvider = new MailProviderInMemory()
  const sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(userRepositoryInMemory,
    usersTokensRepositoryInMemory,
    dateProvider,
    mailProvider);
  return {
    sendForgotPasswordMailUseCase,
    userRepositoryInMemory,
    dateProvider,
    usersTokensRepositoryInMemory,
    mailProvider,
  }
}
const makeFakeUser = (): ICreateUserDTO => {
  return {
    driver_license: "54578",
    email: "any@mail.com",
    name: "any_name",
    password: "any_password"
  }
}

beforeEach(() => {

})
describe('Send Forgot Email', () => {
  test('should be able to send a forgot password mail to user', async () => {
    const { userRepositoryInMemory, mailProvider, sendForgotPasswordMailUseCase } = makeSut()

    const spy = jest.spyOn(mailProvider, "sendMail")
    await userRepositoryInMemory.create(makeFakeUser())
    await sendForgotPasswordMailUseCase.execute("any@mail.com")
    expect(spy).toHaveBeenCalled()
  })

  test("should not be able to send an email if user does not exists", async () => {
    const { sendForgotPasswordMailUseCase } = makeSut()
    const promise = sendForgotPasswordMailUseCase.execute("any@mail.com");
    expect(promise).rejects.toEqual(new AppError('User does not exist!'))
  })

  test("should be able to create an users token", async () => {
    const { usersTokensRepositoryInMemory, userRepositoryInMemory, sendForgotPasswordMailUseCase } = makeSut()
    const spy = jest.spyOn(usersTokensRepositoryInMemory, "create")
    userRepositoryInMemory.create(makeFakeUser())
    await sendForgotPasswordMailUseCase.execute("any@mail.com")
    expect(spy).toHaveBeenCalled()
  })
})
