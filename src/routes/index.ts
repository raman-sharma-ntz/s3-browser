import { Router, type Response } from "express";

import type { ModRequest } from "../types";

import apiRouter from "./api.routes";
import { s3ConfigSchema } from "../schemas/aws.schema";

const router: Router = Router();

router.get("/", ((req: ModRequest, res: Response) => {
  if (!req.session.awsConfig)
    return res.render("login", {
      title: "S3 Browser",
      csrfToken: req.csrfToken(),
    });
  res.redirect("/browser");
}) as any);

router.post("/login", (async (req: ModRequest, res: Response) => {
  const parsed = s3ConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log("errors while login", parsed.error);
    return res.render("login", {
      title: "S3 Browser",
      csrfToken: req.csrfToken(),
      errors: parsed.error,
    });
  }

  req.session.awsConfig = parsed.data;

  res.redirect("/explorer");
}) as any);

router.get("/explorer", (async (req: ModRequest, res: Response) => {
  if (!req.session.awsConfig) return res.redirect("/");

  res.render("explorer", {
    bucket: req.session.awsConfig.BUCKET_NAME,
    csrfToken: req.csrfToken(),
    title: "File Explorer | S3 Browser",
  });
}) as any);

router.get("/disconnect", ((req: ModRequest, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}) as any);

router.use("/api", apiRouter);

export default router;
