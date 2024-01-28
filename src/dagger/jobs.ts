import { Directory, Secret, dag } from "../../deps.ts";
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
 * @returns {Promise<string>}
 */
export async function test(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
): Promise<string> {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";

  const secret = await getSnykToken(dag, token);
  if (!secret) {
    console.error("SNYK_TOKEN is not set");
    Deno.exit(1);
  }

  const context = await getDirectory(dag, src);
  const ctr = dag
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

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Checks projects for infrastructure as code issues
 * @param {string | Directory | undefined} src Source directory
 * @param {string | Secret} token Snyk token
 * @param {string} severityThreshold Snyk severity threshold
 * @returns {Promise<string>}
 */
export async function iacTest(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
): Promise<string> {
  const SNYK_SEVERITY_THRESHOLD =
    Deno.env.get("SNYK_SEVERITY_THRESHOLD") || severityThreshold || "low";
  const secret = await getSnykToken(dag, token);
  if (!secret) {
    console.error("SNYK_TOKEN is not set");
    Deno.exit(1);
  }

  const context = await getDirectory(dag, src);
  const ctr = dag
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

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (
  src?: string | Directory,
  token?: string | Secret,
  severityThreshold?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.iacTest]: iacTest,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]:
    "Checks projects for open source vulnerabilities and license issues",
  [Job.iacTest]: "Checks projects for infrastructure as code issues",
};
