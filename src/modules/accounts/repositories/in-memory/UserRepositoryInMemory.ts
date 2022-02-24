import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/protocols/IUsersRepository";

class UserRepositoryInMemory implements IUsersRepository {
  users: User[] = []
  async create({ driver_license, email, name, password }: ICreateUserDTO): Promise<void> {
    const user = new User()

    Object.assign(user, {
      driver_license,
      email,
      name,
      password
    })

    this.users.push(user)
  }
  async findByEmail(email: string): Promise<User> {
    const user = this.users.find(item => item.email === email);
    return user
  }
  async findById(id: string): Promise<User> {
    const user = this.users.find(item => item.id === id);
    return user
  }

}

export { UserRepositoryInMemory }