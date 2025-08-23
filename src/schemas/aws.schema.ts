import { z } from "zod";

export const s3ConfigSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string().min(16, "Invalid Access Key"),
  AWS_SECRET_ACCESS_KEY: z.string().min(30, "Invalid Secret Key"),
  AWS_REGION: z.string().min(2),
  BUCKET_NAME: z.string().min(1),
});

export type s3Config = z.infer<typeof s3ConfigSchema>;
