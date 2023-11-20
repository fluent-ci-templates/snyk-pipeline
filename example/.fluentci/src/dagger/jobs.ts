import Client, { Directory } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  iacTest = "iac_test",
}

export const exclude = [".git", ".fluentci", ".devbox"];

const SNYK_IMAGE_TAG = Deno.env.get("SNYK_IMAGE_TAG") || "alpine";

export const test = async (
  src: string | Directory | undefined = ".",
  token?: string,
  severityThreshold?: string
) => {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";
  const SNYK_TOKEN = Deno.env.get("SNYK_TOKEN") || token || "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withEnvVariable("SNYK_TOKEN", SNYK_TOKEN)
      .withExec([
        "snyk",
        "test",
        `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const iacTest = async (
  src = ".",
  token?: string,
  severityThreshold?: string
) => {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";
  const SNYK_TOKEN = Deno.env.get("SNYK_TOKEN") || token || "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.iacTest)
      .container()
      .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withEnvVariable("SNYK_TOKEN", SNYK_TOKEN)
      .withExec([
        "snyk",
        "iac",
        "test",
        `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.iacTest]: iacTest,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]:
    "Checks projects for open source vulnerabilities and license issues",
  [Job.iacTest]: "Checks projects for infrastructure as code issues",
};
