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
    name: "Category Supertest",
    description: "Description Supertest"
  }
}
describe('List Categories Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
    const id = uuidv4()
    const password = await hash("admin", 8)
    await connection.query(`INSERT INTO USERS (id,name,email,password,"isAdmin",created_at,driver_license)
       values ('${id}','admin','admin@rentx.com.br','${password}',true,'now ()','xxx')   
    `)
  })

  afterAll(() => {
    connection.dropDatabase;
    connection.close;
  })

  test('should be able to list all categories', async () => {
    const responseToken = await request(app).post("/sessions").send(makeFakeUser());
    const { token } = responseToken.body;
    await request(app)
      .post("/categories")
      .send(makeFakeCategory())
      .set({
        Authorization: `Bearer ${token}`,
      });
    const response = await request(app).get("/categories")
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Supertest");
  });

});
