import { NextFunction, Request, Response } from "express";

type controller = (req: Request, res: Response, next: NextFunction) => void;

export const HealthCheck: controller = async (req: Request, res, next) => {
    try {
      res.status(200).json("Server Running Successfully");
    } catch (err) {
      next(err);
    }
  };