import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO"
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens"

interface IUsersTokensRepository {
  create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens>
  findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserTokens>
  deleteById(id: string): Promise<void>
}

export { IUsersTokensRepository }