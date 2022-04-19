import { IResetPasswordUserDto } from "@modules/accounts/dtos/IResetPasswordUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/protocols/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/protocols/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

import { hash } from "bcrypt"


@injectable()
class ResetPasswordUserUseCase {


  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ token, password }: IResetPasswordUserDto): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);
    if (!userToken) {
      throw new AppError("Token invalid!");
    }

    if (this.dateProvider.compareIsBefore(
      userToken.expires_date,
      this.dateProvider.dateNow()
    )
    ) {
      throw new AppError("Token expired!");
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await hash(password, 8);

    await this.usersRepository.create(user)
    await this.usersTokensRepository.deleteById(userToken.id)
  }
}

export { ResetPasswordUserUseCase }