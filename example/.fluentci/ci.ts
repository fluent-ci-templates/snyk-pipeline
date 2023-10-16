import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import { test } from "https://pkg.fluentci.io/snyk_pipeline@v0.1.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
  });
}

pipeline();
