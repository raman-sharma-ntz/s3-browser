import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ListObjectsV2Command, GetObjectCommand, S3 } from "@aws-sdk/client-s3";

import { createS3Client } from "../helpers/s3.client";
import type { s3Config } from "../schemas/aws.schema";

export class S3Service {
  static listObjects = async (config: s3Config, prefix: string = "") => {
    const s3 = createS3Client(config);

    const command = new ListObjectsV2Command({
      Bucket: config.BUCKET_NAME,
      Prefix: prefix,
      Delimiter: "/",
    });

    const response = await s3.send(command);

    const folders = (response.CommonPrefixes || []).map((p) => {
      const full = p.Prefix || "";
      const name = full.slice(prefix.length).replace(/\/$/, "");
      return {
        name,
        key: full,
        type: "folder",
      };
    });

    const files = await Promise.all(
      (response.Contents || [])
        .filter((item) => item.Key !== prefix)
        .map(async (item) => {
          const full = item.Key || "";
          const name = full.slice(prefix.length);

          const getObjectParams = {
            Bucket: config.BUCKET_NAME,
            Key: full,
          };
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand(getObjectParams),
            {
              expiresIn: 3600,
            }
          );

          return {
            name,
            key: full,
            type: "file",
            url,
          };
        })
    );

    s3.destroy();

    return { folders, files };
  };

  static getFile = async (config: s3Config, key: string) => {
    if (!key?.trim()) return null;
    const s3 = createS3Client(config);
    const command = new GetObjectCommand({
      Bucket: config.BUCKET_NAME,
      Key: key,
    });
    const file = await s3.send(command);

    return file;
  };

  static getAll = async (config: s3Config) => {
    const s3 = createS3Client(config);
    const listCommand = new ListObjectsV2Command({
      Bucket: config.BUCKET_NAME,
    });
    const { Contents } = await s3.send(listCommand);

    if (!Contents || Contents.length === 0) {
      throw new Error("No files found in bucket");
    }

    s3.destroy();

    return Contents;
  };

  static getFolder = async (config: s3Config, prefix: string) => {
    const s3 = createS3Client(config);
    const listCommand = new ListObjectsV2Command({
      Bucket: config.BUCKET_NAME,
      Prefix: prefix,
    });
    const { Contents } = await s3.send(listCommand);

    if (!Contents || Contents.length === 0) {
      throw new Error("No files found in folder");
    }

    s3.destroy();

    return Contents;
  };

  static getFileStream = async (awsConfig: s3Config, Key: string) => {
    const s3 = createS3Client(awsConfig);
    return s3.getObject({ Bucket: awsConfig.BUCKET_NAME, Key }).then((data) => {
      if (!data.Body) throw new Error("No file body");
      return data.Body as NodeJS.ReadableStream;
    });
  };
}
