import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/protocols/IUsersTokensRepository";
import { getRepository, Repository } from "typeorm";
import { UserTokens } from "../entities/UserTokens";


class UsersTokensRepository implements IUsersTokensRepository {

  private repository: Repository<UserTokens>

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token
    });
    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserTokens> {
    return await this.repository.findOne({
      user_id,
      refresh_token: token
    });
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return await this.repository.findOne({
      refresh_token
    });
  }


}

export { UsersTokensRepository }