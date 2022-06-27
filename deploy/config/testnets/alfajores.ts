import { ChainJson, toChain } from '../../src/chain';
import * as dotenv from 'dotenv';
import { CoreConfig } from '../../src/governance/CoreDeploy';

dotenv.config();

const rpc = process.env.ALFAJORES_RPC;
if (!rpc) {
  throw new Error('Missing RPC URI');
}

export const chainJson: ChainJson = {
  name: 'alfajores',
  rpc,
  deployerKey: process.env.ALFAJORES_DEPLOYER_KEY,
  domain: 1000,
};

export const chain = toChain(chainJson);

export const devConfig: CoreConfig = {
  environment: 'dev',
  updater: '0x4177372FD9581ceb2367e0Ce84adC5DAD9DF8D55',
  watchers: ['0x20aC2FD664bA5406A7262967C34107e708dCb18E'],
  recoveryManager: '0x24F6c874F56533d9a1422e85e5C7A806ED11c036',
  optimisticSeconds: 10,
  recoveryTimelock: 180,
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0x01652e694BbD82C0900776c0406C3DFaa00e1e91',
  replicas: new Map<number, string>([
    [3000, '0xB5EB71E40bcAEAD5DDdc7687724f9F155Fd1a7a8'],
  ]),
};

export const stagingConfig: CoreConfig = {
  homeAddress: '0xc8abA9c65A292C84EA00441B81124d9507fB22A8',
  replicas: new Map<number, string>([
    [3000, '0xE469D8587D45BF85297BD924b159E726E7CA5408'],
  ]),
  environment: 'staging',
  updater: '0x201dd86063Dc251cA5a576d1b7365C38e5fB4CD5',
  watchers: ['0x22B2855635154Baa41C306BcA979C8c9a077A180'],
  recoveryManager: '0x24F6c874F56533d9a1422e85e5C7A806ED11c036',
  optimisticSeconds: 10,
  recoveryTimelock: 180,
  processGas: 850_000,
  reserveGas: 15_000,
};
