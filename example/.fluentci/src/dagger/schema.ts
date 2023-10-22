import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { test, iacTest } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("test", {
      args: {
        src: nonNull(stringArg()),
        token: nonNull(stringArg()),
        severityThreshold: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await test(args.src, args.token, args.severityThreshold),
    });
    t.string("iacTest", {
      args: {
        src: nonNull(stringArg()),
        token: nonNull(stringArg()),
        severityThreshold: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await iacTest(args.src, args.token, args.severityThreshold),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
