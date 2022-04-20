import request from "supertest";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid"

import { Connection } from "typeorm";
import createConnection from "@shared/infra/typeorm"
import { app } from "@shared/infra/http/app"


let connection: Connection;

interface IFakeUser {
  email: string;
  password: string;
}
interface IFakeCategory {
  name: string;
  description: string;
}
const makeFakeUser = (): IFakeUser => {
  return {
    email: "admin@rentx.com.br",
    password: "admin"
  }
}

const makeFakeCategory = (): IFakeCategory => {
  return {
    name: 'Category Supertest',
    description: 'Category Supertest',
  }
}
describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
    const id = uuidv4()
    const password = await hash("admin", 8)
    await connection.query(`INSERT INTO USERS (id,name,email,password,"isAdmin",created_at,driver_license)
   values ('${id}','admin','admin@rentx.com.br','${password}',true,'now ()','xxx')   
`)
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  test('should be able to create a new category', async () => {
    const responseToken = await request(app).post("/sessions").send(makeFakeUser());
    const { refresh_token } = responseToken.body;
    const response = await request(app)
      .post("/categories")
      .send(makeFakeCategory())
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });
    expect(response.status).toBe(201);
  })

  test('should not be able to create a new category with name exists', async () => {
    const responseToken = await request(app).post("/sessions").send(makeFakeUser());
    const { refresh_token } = responseToken.body;
    const response = await request(app)
      .post("/categories")
      .send(makeFakeCategory())
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });
    expect(response.status).toBe(400);
  });
});
