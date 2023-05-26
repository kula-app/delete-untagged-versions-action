import * as core from '@actions/core';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import * as OctokitOpenApiTypes from '@octokit/openapi-types';

export async function removeUntaggedPackageVersions({
  owner,
  repo,
  authToken,
  packageName,
  dryRun,
  isPackageOwnedByUser,
}: {
  authToken: string;
  owner: string;
  repo: string;
  dryRun: boolean;
  packageName: string;
  isPackageOwnedByUser: boolean;
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
  // Find the packages
  if (isPackageOwnedByUser) {
    const { data: packages } = await octokit.packages.listPackagesForUser({
      username: owner,
      repo: repo,
      package_type: 'container',
    });
    core.debug(`Found the following packages:`);
    core.startGroup(`Packages found in user package`);
    for (const p of packages) {
      core.debug(` - ${p.name}`);
    }
    core.endGroup();
  } else {
    const { data: packages } = await octokit.packages.listPackagesForOrganization({
      org: owner,
      repo: repo,
      package_type: 'container',
    });
    core.debug(`Found the following packages:`);
    core.startGroup(`Packages found in user package`);
    for (const p of packages) {
      core.debug(` - ${p.name}`);
    }
    core.endGroup();
  }

  // Find the package versions
  core.info(`Finding versions for package '${packageName}' in repo '${owner}/${repo}'`);
  let versions: OctokitOpenApiTypes.components['schemas']['package-version'][];
  if (isPackageOwnedByUser) {
    core.debug(`Package is owned by user`);
    let response = await octokit.packages.getAllPackageVersionsForPackageOwnedByUser({
      username: owner,
      repo: repo,
      package_type: 'container',
      package_name: packageName,
    });
    versions = response.data;
  } else {
    core.debug(`Package is owned by organization`);
    let response = await octokit.packages.getAllPackageVersionsForPackageOwnedByOrg({
      org: owner,
      repo: repo,
      package_type: 'container',
      package_name: packageName,
    });
    response.data[0].metadata;
    versions = response.data;
  }
  core.info(`Found ${versions.length} package versions`);

  // Iterate the versions and the associated tags
  for (const version of versions) {
    const tags = version.metadata?.container?.tags;
    if (!tags || tags.length === 0) {
      core.info(`Package version '${version.id}' has no tags associated`);
      const { id } = version;
      try {
        if (dryRun) {
          core.warning(`Dry running is enabled, not deleting package version '${version.id}'`);
        } else {
          core.info(`Deleting package version '${version.id}'...`);
          if (isPackageOwnedByUser) {
            await octokit.packages.deletePackageVersionForUser({
              username: owner,
              repo: repo,
              package_type: 'container',
              package_name: packageName,
              package_version_id: version.id,
            });
          } else {
            await octokit.packages.deletePackageVersionForOrg({
              org: owner,
              repo: repo,
              package_type: 'container',
              package_name: packageName,
              package_version_id: version.id,
            });
          }
          core.info(`Package version '${version.id}' successfully deleted`);
        }
      } catch (error) {
        core.info(`Failed to delete package version '${version.id}', reason: ${error}`);
        throw error;
      }
    }
  }
}
