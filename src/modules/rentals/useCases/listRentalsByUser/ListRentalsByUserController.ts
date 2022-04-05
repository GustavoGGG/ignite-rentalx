import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListRentalsByUserUserCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {

  c

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const listRentalsByUserUseCase = container.resolve(ListRentalsByUserUserCase);

    const list = await listRentalsByUserUseCase.execute(id)
    return res.json(list)
  }

}

export { ListRentalsByUserController }