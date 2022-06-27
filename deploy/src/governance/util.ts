import fs from 'fs';
import { CoreDeploy } from './CoreDeploy';

export function writePartials(dir: string) {
  // make folder if it doesn't exist already
  fs.mkdirSync(dir, { recursive: true });
  const defaultDir = './deployments/config/default';
  const partialNames = ['kathy', 'processor', 'relayer', 'updater', 'watcher'];
  // copy partial config from default directory to given directory
  for (let partialName of partialNames) {
    const filename = `${partialName}-partial.json`;
    fs.copyFile(`${defaultDir}/${filename}`, `${dir}/${filename}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

export function writeDeployOutput(deploys: CoreDeploy[]) {
  console.log(`Have ${deploys.length} deploys`);
  const dir = `../rust/config/${Date.now()}`;
  for (const local of deploys) {
    // get remotes
    const remotes = deploys
      .slice()
      .filter((remote) => remote.chain.domain !== local.chain.domain);

    const config = CoreDeploy.buildConfig(local, remotes);
    const name = local.chain.name;

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      `${dir}/${name}_config.json`,
      JSON.stringify(config, null, 2),
    );
    fs.writeFileSync(
      `${dir}/${name}_contracts.json`,
      JSON.stringify(local.contractOutput, null, 2),
    );
    fs.writeFileSync(
      `${dir}/${name}_verification.json`,
      JSON.stringify(local.verificationInput, null, 2),
    );
  }
  writePartials(dir);
}
