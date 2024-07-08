import { expect } from "chai";
import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";

describe("User Authentication and Organisation Endpoints", () => {
  before(async () => {
    await AppDataSource.initialize();
  });

  after(async () => {
    await AppDataSource.destroy();
  });

  let accessToken: string;

  function randomString() {
    return Math.random().toString(36).substring(2, 7);
  }

  it("Should Register User Successfully with Default Organisation", async () => {
    const email = randomString() + "@example.com";
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email,
      password: "password123",
      phone: "1234567890",
    });

    console.log("Register Response:", response.body); // Debugging output

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Registration successful");
    expect(response.body.data.user.firstName).to.equal("John");
    expect(response.body.data.user.lastName).to.equal("Doe");
    expect(response.body.data.user.email).to.equal(email);
    expect(response.body.data.user.phone).to.equal("1234567890");
    expect(response.body.data.accessToken).to.exist;

    accessToken = response.body.data.accessToken;
  });

  it("Should Log the user in successfully", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    console.log("Login Response:", response.body); // Debugging output

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

    console.log("Missing Fields Response:", response.body); // Debugging output

    expect(response.status).to.equal(400);
    console.log(response.body.errors);
    expect(response.body.errors[0].message.toLowerCase()).to.equal(
      "first name is required"
    );
  });

  it("Should Fail if there’s Duplicate Email or UserID", async () => {
    // Initial registration to create a duplicate
    const initialResponse = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    console.log("Initial Register Response:", initialResponse.body);

    // Attempt to register with the same email
    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    console.log("Duplicate Email Response:", response.body); // Debugging output

    expect(response.status).to.equal(400);
    expect(response.body.message.toLowerCase()).to.equal(
      "registration unsuccessful, user already exists"
    );
  });
});
