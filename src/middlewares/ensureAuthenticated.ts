import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";


interface IPayLoad {
  sub: string;
}
export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Token missing")
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, "64d106004133beaaa6cc2c23cea7d904") as IPayLoad;

    const usersRepository = new UsersRepository()
    const user = await usersRepository.findById(user_id)
    if (!user) {
      throw new Error("User does not exists!")
    }
    next()
  } catch (error) {
    throw new Error("Invalid token!")
  }

}