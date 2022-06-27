import * as dotenv from 'dotenv';

import { ChainJson, toChain } from '../../src/chain';
import { CoreConfig } from '../../src/governance/CoreDeploy';
import { BigNumber } from 'ethers';

dotenv.config();

const rpc = process.env.KOVAN_RPC;
if (!rpc) {
  throw new Error('Missing RPC URI');
}

const chainJson: ChainJson = {
  name: 'kovan',
  rpc,
  deployerKey: process.env.KOVAN_DEPLOYER_KEY,
  domain: 3000,
  gasPrice: BigNumber.from(10_000_000_000),
};

export const chain = toChain(chainJson);

export const devConfig: CoreConfig = {
  environment: 'dev',
  updater: '0x4177372FD9581ceb2367e0Ce84adC5DAD9DF8D55',
  optimisticSeconds: 10,
  watchers: ['0x20aC2FD664bA5406A7262967C34107e708dCb18E'],
  recoveryTimelock: 180,
  recoveryManager: '0x24F6c874F56533d9a1422e85e5C7A806ED11c036',
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0x0ED518F19fEbbd3737e39a55a8a708AFe8a9BE59',
  replicas: new Map<number, string>([
    [1000, '0xC6b39Ac67FBE3e029708390ffea130c8C0E7D30b'],
  ]),
};

export const stagingConfig: CoreConfig = {
  homeAddress: '0xB6Ee3e8fE5b577Bd6aB9a06FA169F97303586E7C',
  replicas: new Map<number, string>([
    [1000, '0xF76995174f3C02e2900d0F6261e8cbeC04078E1f'],
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
