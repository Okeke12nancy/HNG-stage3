import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Organisation } from "../entity/organizaton";

export const createUser = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const { firstName, lastName, email, password, phone } = req.body;

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = password;
  user.phone = phone;
  try {
    await userRepository.save(user);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not create user",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  let { id } = req.params;
  const userId = Number(id);
  const user = req.user;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const userRecord = await userRepository.findOneBy({ userId });

    if (!userRecord) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
      });
    }
    const organisationRepository = AppDataSource.getRepository(Organisation);
    const organisations = await organisationRepository
      .createQueryBuilder("organisation")
      .leftJoinAndSelect("organisation.users", "user")
      .where("user.userId = :userId", { userId: user?.userId })
      .getMany();

    console.log(`This is it`, user);
    const belongsToOrganisation = organisations.some((org) => {
      return org.users.find((u) => u.userId === userRecord.userId);
      // console.log(`This is the ${org}`);
    });
    if (userRecord.userId !== user?.userId && !belongsToOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Access denied",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: userRecord.userId,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        email: userRecord.email,
        phone: userRecord.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not fetch user",
    });
  }
};
