import { Router } from "express";
import { S3Controller } from "../controllers/s3.controller";

const router: Router = Router();

router.get("/list", S3Controller.listObjects as any);
router.get("/download/all", S3Controller.handleDownloadAll as any);
router.get("/download/file/:key", S3Controller.handleDownloadFile as any);
router.get(
  "/download/folder/:prefix",
  S3Controller.handleDownloadFolder as any
);

export default router;
