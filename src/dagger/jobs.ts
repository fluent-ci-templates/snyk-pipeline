import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getSnykToken } from "./lib.ts";

export enum Job {
  test = "Checks projects for open source vulnerabilities and license issues",
  iacTest = "iac_test",
}

export const exclude = [".git", ".fluentci", ".devbox"];

const SNYK_IMAGE_TAG = Deno.env.get("SNYK_IMAGE_TAG") || "alpine";

/**
 * @function
 * @description Checks projects for open source vulnerabilities and license issues
 * @param {string | Directory | undefined} src Source directory
 * @param {string | Secret} token Snyk token
 * @param {string} severityThreshold Snyk severity threshold
 * @returns {string}
 */
export async function test(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
): Promise<string> {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";

  const secret = getSnykToken(new Client(), token);
  if (!secret) {
    console.error("SNYK_TOKEN is not set");
    Deno.exit(1);
  }

  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withSecretVariable("SNYK_TOKEN", secret)
      .withExec([
        "snyk",
        "test",
        `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
      ]);

    await ctr.stdout();
  });
  return "Done";
}

/**
 * @function
 * @description Checks projects for infrastructure as code issues
 * @param {string | Directory | undefined} src Source directory
 * @param {string | Secret} token Snyk token
 * @param {string} severityThreshold Snyk severity threshold
 * @returns {string}
 */
export async function iacTest(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
) {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";
  const secret = getSnykToken(new Client(), token);
  if (!secret) {
    console.error("SNYK_TOKEN is not set");
    Deno.exit(1);
  }

  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.iacTest)
      .container()
      .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withSecretVariable("SNYK_TOKEN", secret)
      .withExec([
        "snyk",
        "iac",
        "test",
        `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
      ]);

    await ctr.stdout();
  });
  return "Done";
}

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
