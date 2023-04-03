import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

export async function removeUntaggedPackageVersions({
  owner,
  repo,
  authToken,
  packageName,
  dryRun,
}: {
  authToken: string;
  owner: string;
  repo: string;
  dryRun: boolean;
  packageName: string;
}) {
  const octokit = new Octokit({
    auth: authToken,
    log: {
      debug: core.debug,
      info: core.info,
      warn: core.warning,
      error: core.error,
    },
  });
}
