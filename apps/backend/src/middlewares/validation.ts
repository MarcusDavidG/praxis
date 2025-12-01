import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        next(new ValidationError(messages.join(", ")));
      } else {
        next(error);
      }
    }
  };
};
