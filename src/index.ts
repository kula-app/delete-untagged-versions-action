import * as core from '@actions/core';
import { removeUntaggedPackageVersions } from './removeUntaggedPackageVersions';

async function run() {
  try {
    // -- Read Inputs --
    const repository = core.getInput('repository', { required: true });
    const repoParts = repository.split('/');
    if (repoParts.length !== 2) {
      throw `Invalid repository "${repository}" (needs to have one slash, i.e. 'owner/repo')`;
    }
    const [owner, repo] = repoParts;
    const authToken = core.getInput('token', {
      required: true,
    });
    const dryRun = core.getBooleanInput('dry_run');
    const packageName = core.getInput('package', { required: true });

    // -- Perform Tasks --
    await removeUntaggedPackageVersions({
      authToken,
      owner,
      repo,
      dryRun,
      packageName,
    });
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    core.setFailed(error?.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
