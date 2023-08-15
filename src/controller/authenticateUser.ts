import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "src/models/User";

export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idToken = req.cookies["login"];

  try {
    const decodedMessage = jwt.verify(idToken, "thisisexample");
    await UserModel.findOne({
      email: decodedMessage,
    });
    next();
  } catch (e) {
    res.status(401).send({
      error: e,
    });
  }
};
