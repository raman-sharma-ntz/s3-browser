import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.number().default(3000),
  SESSION_SECRET: z.string(),
  MAX_ZIP_MB: z.number().default(512),
});

export const ENV = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
