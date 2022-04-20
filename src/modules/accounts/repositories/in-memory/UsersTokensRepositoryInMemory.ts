import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../protocols/IUsersTokensRepository";


class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = []
  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens()

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token
    })

    this.usersTokens.push(userToken)
    return userToken;
  }
  async findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserTokens> {
    return this.usersTokens.find(item => item.user_id === user_id &&
      item.refresh_token === token)
  }
  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(item => item.id === id)
    this.usersTokens.splice(userTokenIndex)
  }
  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return this.usersTokens.find(item => item.refresh_token === refresh_token)
  }

}

export { UsersTokensRepositoryInMemory }