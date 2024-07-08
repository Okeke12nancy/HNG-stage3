import { expect } from "chai";
import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

describe("User Authentication and Organisation Endpoints", () => {
  before(async () => {
    await AppDataSource.initialize();
  });

  after(async () => {
    await AppDataSource.destroy();
  });

  let accessToken: string;

  it("Should Register User Successfully with Default Organisation", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Registration successful");
    expect(response.body.data.user.firstName).to.equal("John");
    expect(response.body.data.user.lastName).to.equal("Doe");
    expect(response.body.data.user.email).to.equal("john.doe@example.com");
    expect(response.body.data.user.phone).to.equal("1234567890");
    expect(response.body.data.accessToken).to.exist;

    accessToken = response.body.data.accessToken;
  });

  it("Should Log the user in successfully", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Login successful");
    expect(response.body.data.user.email).to.equal("john.doe@example.com");
    expect(response.body.data.accessToken).to.exist;

    accessToken = response.body.data.accessToken;
  });

  it("Should Fail If Required Fields Are Missing", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    expect(response.status).to.equal(422);
    expect(response.body.errors).to.deep.include({
      field: "firstName",
      message: "First name is required",
    });
    expect(response.body.errors).to.deep.include({
      field: "lastName",
      message: "Last name is required",
    });
    expect(response.body.errors).to.deep.include({
      field: "email",
      message: "Email is required",
    });
    expect(response.body.errors).to.deep.include({
      field: "password",
      message: "Password is required",
    });
  });

  it("Should Fail if there’s Duplicate Email or UserID", async () => {
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(response.status).to.equal(422);
    expect(response.body.errors).to.deep.include({
      field: "email",
      message: "Email already exists",
    });
  });
});
