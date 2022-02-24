import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";
import { AppError } from "@errors/AppError";
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"



interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  },
  token: string;
}
@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {

  }
  async execute({ email, password }: IRequest): Promise<IResponse> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!");
    }
    const token = sign({}, "64d106004133beaaa6cc2c23cea7d904", {
      subject: user.id,
      expiresIn: "1d"
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      }, token,
    }

  }
}
export { AuthenticateUserUseCase }