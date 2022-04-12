import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/protocols/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/protocols/IDateProvider';
import { AppError } from '@shared/errors/AppError';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

interface IPayLoad {
  sub: string;
  email: string;
}
@injectable()
class RefreshTokenUserCase {

  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
  ) { }
  async execute(token: string): Promise<string> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayLoad
    const user_id = sub
    const user_token = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token)
    if (!user_token) {
      throw new AppError("Refresh Token does not exists")
    }

    await this.usersTokensRepository.deleteById(user_token.id)

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    const refresh_token_expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days)
    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date: refresh_token_expires_date
    })
    return refresh_token;
  }

}

export { RefreshTokenUserCase }