import Client from "../../deps.ts";

export enum Job {
  test = "test",
  iacTest = "iac_test",
}

export const exclude = [".git", ".fluentci", ".devbox"];

const SNYK_IMAGE_TAG = Deno.env.get("SNYK_IMAGE_TAG") || "alpine";
const SNYK_SEVERITY_THRESHOLD =
  Deno.env.get("SNYK_SEVERITY_THRESHOLD") || "low";

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.test)
    .container()
    .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withEnvVariable("SNYK_TOKEN", Deno.env.get("SNYK_TOKEN") || "")
    .withExec([
      "snyk",
      "test",
      `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export const iacTest = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.iacTest)
    .container()
    .from(`snyk/snyk:${SNYK_IMAGE_TAG}`)
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withEnvVariable("SNYK_TOKEN", Deno.env.get("SNYK_TOKEN") || "")
    .withExec([
      "snyk",
      "iac",
      "test",
      `--severity-threshold=${SNYK_SEVERITY_THRESHOLD}`,
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.iacTest]: iacTest,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]:
    "Checks projects for open source vulnerabilities and license issues",
  [Job.iacTest]: "Checks projects for infrastructure as code issues",
};
