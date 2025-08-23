import { Request } from "express";
import { s3Config } from "../schemas/aws.schema";
import type { SessionData, Session } from "express-session";

export type ModRequest = Request & {
  session: Session &
    Partial<SessionData> & {
      awsConfig: s3Config;
    };
};
