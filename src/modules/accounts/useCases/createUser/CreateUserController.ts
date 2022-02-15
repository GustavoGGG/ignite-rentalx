import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "../CreateUserUseCase";


class CreateUserController {

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, username, password, email, driver_license } = req.body;
    const createUserCase = container.resolve(CreateUserUseCase)

    await createUserCase.execute({ name, username, password, email, driver_license })
    return res.status(201).send()
  }

}

export { CreateUserController }