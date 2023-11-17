# Snyk Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fsnyk_pipeline&query=%24.version)](https://pkg.fluentci.io/snyk_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/snyk-pipeline)](https://codecov.io/gh/fluent-ci-templates/snyk-pipeline)

A ready-to-use CI/CD Pipeline for scanning vulnerabilities in your project with Snyk.

## 🚀 Usage

Run the following command:

```bash
fluentci run snyk_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t snyk
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Environment variables

| Variable                | Description                   | Default    |
| ----------------------- | ----------------------------- | ---------- |
| SNYK_TOKEN              | Your Snyk API token           |            |
| SNYK_IMAGE_TAG          | Default snyk image tag to use | alpine     |
| SNYK_SEVERITY_THRESHOLD | Minimum severity threshold    | low        |

## Jobs

| Job      | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| test     | Checks projects for open source vulnerabilities and license issues |
| iac_test | Checks infrastructure as code for security issues                  |

```graphql
iacTest(
  severityThreshold: String!, 
  src: String!, 
  token: String!
): String

test(
  severityThreshold: String!, 
  src: String!, 
  token: String!
): String
```
## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "https://pkg.fluentci.io/snyk_pipeline@v0.3.0/mod.ts";

await test();
```
