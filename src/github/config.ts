import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("Snyk");

  const push = {
    branches: ["main"],
  };

  const tests: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v3",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v2",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run snyk_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ tests });

  return workflow;
}
