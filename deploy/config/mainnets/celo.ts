import { ChainJson, toChain } from '../../src/chain';
import * as dotenv from 'dotenv';
import { CoreConfig } from '../../src/governance/CoreDeploy';

dotenv.config();

const rpc = process.env.CELO_RPC;
if (!rpc) {
  throw new Error('Missing RPC URI');
}

export const chainJson: ChainJson = {
  name: 'celo',
  rpc,
  deployerKey: process.env.CELO_DEPLOYER_KEY,
  domain: 0x63656c6f, // b'celo' interpreted as an int
};

export const chain = toChain(chainJson);

export const config: CoreConfig = {
  environment: 'prod-community',
  updater: '0x703643995262c92ab013E3CCA810BdcB9239d45a',
  recoveryTimelock: 60 * 60 * 24 * 14, // 14 days
  recoveryManager: '0x80431CA95Ef408f2d15361653F03167D14B559DD',
  optimisticSeconds: 60 * 30, // 30 minutes
  watchers: [
    '0xd87fcd362391607e0ca10d1eaaf08a185f7a2d5a',
    '0xafa81fb03431c3b4c3061e4e7cedcfca448d49d3',
    '0x6d1a467fadcd8b9dc4f1fd48e8579438640a4b29',
  ],
  processGas: 850_000,
  reserveGas: 15_000,
  // Optics production community home celo address
  homeAddress: '0x913EE05036f3cbc94Ee4afDea87ceb430524648a',
  replicas: new Map<number, string>([
    // Optics production community celo replica address on ethereum
    [6648936, '0xcDE146d1C673fE13f4fF1569d3F0d9f4d0b9c837'],
  ]),
};
