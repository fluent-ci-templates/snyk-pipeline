# Azure Pipelines

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fsnyk_pipeline&query=%24.version)](https://pkg.fluentci.io/snyk_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/snyk-pipeline)](https://codecov.io/gh/fluent-ci-templates/snyk-pipeline)

The following command will generate a `azure-pipelines.yml` file in your project:

```bash
fluentci ap init -t snyk_pipeline
```

Generated file:

```yaml
# Do not edit this file directly. It is generated by https://deno.land/x/fluent_azure_pipelines

trigger:
  - main
pool:
  name: Default
  vmImage: ubuntu-latest
steps:
  - script: |
        curl -fsSL https://deno.land/x/install/install.sh | sh
        export snyk_INSTALL="$HOME/.deno"
        export PATH="$snyk_INSTALL/bin:$PATH"
    displayName: Install Deno
  - script: deno install -A -r https://cli.fluentci.io -n fluentci
    displayName: Setup Fluent CI CLI
  - script: |
        curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh
        sudo mv bin/dagger /usr/local/bin
        dagger version
    displayName: Setup Dagger
  - script: fluentci run snyk_pipeline
    displayName: Run Dagger Pipelines

```

Feel free to edit the template generator at `.fluentci/src/azure/config.ts` to your needs.
