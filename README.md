# Snyk Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/snyk_pipeline)](https://pkg.fluentci.io/snyk_pipeline)
[![deno module](https://shield.deno.dev/x/snyk_pipeline)](https://deno.land/x/snyk_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/snyk)](https://jsr.io/@fluentci/snyk)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/snyk-pipeline)](https://codecov.io/gh/fluent-ci-templates/snyk-pipeline)
[![ci](https://github.com/fluent-ci-templates/snyk-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/snyk-pipeline/actions/workflows/ci.yml)

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

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/snyk-pipeline@main
```

Call a function from the module:

```bash
dagger call iac-test \
  --src . \
  --token env:SNYK_TOKEN \
  --severity-threshold medium

dagger call test \
  --src . \
  --token env:SNYK_TOKEN \
  --severity-threshold medium
```

## 🛠️ Environment variables

| Variable                | Description                   | Default    |
| ----------------------- | ----------------------------- | ---------- |
| SNYK_TOKEN              | Your Snyk API token           |            |
| SNYK_IMAGE_TAG          | Default snyk image tag to use | alpine     |
| SNYK_SEVERITY_THRESHOLD | Minimum severity threshold    | low        |

## ✨ Jobs

| Job      | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| test     | Checks projects for open source vulnerabilities and license issues |
| iac_test | Checks infrastructure as code for security issues                  |

```typescript
test(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
): Promise<string>

iacTest(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  severityThreshold?: string
): Promise<string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "jsr:@fluentci/snyk";

await test();
```
