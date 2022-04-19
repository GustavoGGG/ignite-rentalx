import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/protocols/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/protocols/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { resolve } from "path";

@injectable()
class SendForgotPasswordMailUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private userTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider
  ) { }

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User does not exist!");
    }

    const templatePath = resolve(__dirname,
      "..", "..",
      "views", "emails", "forgotPassword.hbs")
    const token = uuidv4()
    const expires_date = this.dateProvider.addHours(3);
    await this.userTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    })
    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`
    }

    await this.mailProvider.sendMail(email,
      "Recuperação de senha", variables, templatePath)
  }
}

export { SendForgotPasswordMailUseCase }