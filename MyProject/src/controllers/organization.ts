import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Organisation } from "../entity/organizaton";
import { User } from "../entity/User";

export const createOrganisation = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const user = req.user as User;

  const organisationRepository = AppDataSource.getRepository(Organisation);
  const organisation = new Organisation();
  organisation.name = name;
  organisation.description = description;
  organisation.users = [user];

  try {
    await organisationRepository.save(organisation);
    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not create organisation",
    });
  }
};

export const getOrganisations = async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    const organisationRepository = AppDataSource.getRepository(Organisation);
    const organisations = await organisationRepository
      .createQueryBuilder("organisation")
      .leftJoinAndSelect("organisation.users", "user")
      .where("user.userId = :userId", { userId: user.userId })
      .getMany();

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not fetch organisations",
    });
  }
};

export const getOrganisation = async (req: Request, res: Response) => {
  const user = req.user as User;
  let { orgId } = req.params;
  const org = Number(orgId);

  try {
    const organisationRepository = AppDataSource.getRepository(Organisation);
    const organisation = await organisationRepository.findOne({
      where: { orgId: org },
      relations: ["users"],
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
      });
    }

    const belongsToOrganisation = organisation.users.some(
      (u) => u.userId === user.userId
    );

    if (!belongsToOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Access denied",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not fetch organisation",
    });
  }
};

export const addUserToOrganisation = async (req: Request, res: Response) => {
  let { orgId } = req.params;
  const org = Number(orgId);

  const { userId } = req.body;
  const user = req.user as User;

  try {
    const organisationRepository = AppDataSource.getRepository(Organisation);
    const userRepository = AppDataSource.getRepository(User);

    const organisation = await organisationRepository.findOne({
      where: { orgId: org },
      relations: ["users"],
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
      });
    }

    const belongsToOrganisation = organisation.users.some(
      (u) => u.userId === user.userId
    );

    if (!belongsToOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Access denied",
      });
    }

    const newUser = await userRepository.findOneBy({ userId });

    if (!newUser) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
      });
    }

    organisation.users.push(newUser);
    await organisationRepository.save(organisation);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Could not add user to organisation",
    });
  }
};
