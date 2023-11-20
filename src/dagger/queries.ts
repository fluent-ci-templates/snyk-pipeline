import { gql } from "../../deps.ts";

export const test = gql`
  query test($src: String!, $token: String!, $severityThreshold: String) {
    test(src: $src, token: $token, severityThreshold: $severityThreshold)
  }
`;

export const iacTest = gql`
  query iacText($src: String!, $token: String!, $severityThreshold: String) {
    iacTest(src: $src, token: $token, severityThreshold: $severityThreshold)
  }
`;
