/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';

test('test runs', () => {
  process.env['INPUT_REPOSITORY'] = 'kula-app/remove-stale-workflow-runs';
  process.env['INPUT_MAX_RUNS_LIMIT'] = '5000';
  process.env['INPUT_DRY_RUN'] = 'false';
  const ip = path.join(__dirname, '../', 'dist', 'index.js');
  const cmd = `node ${ip}`;
  try {
    const result = cp.execSync(cmd, { env: process.env }).toString();
    console.log(result);
  } catch (error) {
    console.error(error);
    console.error(error.stdout?.toString());
    console.error(error.stderr?.toString());
    throw error;
  }
});
