import type { Response } from "express";
import type { ModRequest } from "../types";
import archiver from "archiver";

import { S3Service } from "../services/s3.service";

export class S3Controller {
  static listObjects = async (req: ModRequest, res: Response) => {
    if (!req.session.awsConfig) return res.redirect("/");

    const prefix = (req.query.prefix as string) || "";

    try {
      const { files, folders } = await S3Service.listObjects(
        req.session.awsConfig,
        prefix
      );

      res.json({ success: true, prefix, items: [...folders, ...files] });
    } catch (err: any) {
      console.error("Error listing S3 objects:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to list objects",
        error: err.message,
      });
    }
  };

  static handleDownloadFile = async (req: ModRequest, res: Response) => {
    try {
      if (!req.session.awsConfig) return res.redirect("/");
      let { key } = req.params;
      key = decodeURIComponent(key);
      const file = await S3Service.getFile(req.session.awsConfig, key);
      if (!file) {
        return res.json({
          success: false,
          message: "Invalid File URL or File not found!",
        });
      }
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${key.split("/").pop()}"`
      );
      (file.Body as any).pipe(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  static handleDownloadAll = async (req: ModRequest, res: Response) => {
    try {
      if (!req.session.awsConfig) return res.redirect("/");

      const Contents = await S3Service.getAll(req.session.awsConfig);

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="all-files.zip"`
      );

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);

      for (const item of Contents) {
        if (!item.Key) continue;

        const file = await S3Service.getFile(req.session.awsConfig, item.Key);

        if (file) {
          const safeName = item.Key.replace(/^\/+/, "");

          archive.append(file.Body as any, { name: safeName });
        }
      }

      await archive.finalize();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  static handleDownloadFolder = async (req: ModRequest, res: Response) => {
    try {
      if (!req.session.awsConfig) return res.redirect("/");

      let { prefix } = req.params;
      prefix = decodeURIComponent(prefix);

      const Contents = await S3Service.getFolder(req.session.awsConfig, prefix);

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${prefix.split("/").filter(Boolean).pop()}.zip"`
      );

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);

      for (const item of Contents) {
        if (!item.Key) continue;

        const file = await S3Service.getFile(req.session.awsConfig, item.Key);
        if (file) {
          const relativePath = item.Key.replace(new RegExp(`^${prefix}/?`), "");
          if (relativePath) {
            archive.append(file.Body as any, { name: relativePath });
          }
        }
      }

      await archive.finalize();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
