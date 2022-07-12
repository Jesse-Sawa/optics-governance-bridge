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
  //TODO set before launch
  recoveryTimelock: 60 * 60 * 24 * 7, // 7 days
  recoveryManager: '0x80431CA95Ef408f2d15361653F03167D14B559DD',
  optimisticSeconds: 60 * 30, // 30 minutes
  watchers: [
    '0xd87fcd362391607e0ca10d1eaaf08a185f7a2d5a',
    '0xafa81fb03431c3b4c3061e4e7cedcfca448d49d3',
    '0x6d1a467fadcd8b9dc4f1fd48e8579438640a4b29',
  ],
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0x97bbda9A1D45D86631b243521380Bc070D6A4cBD',
  replicas: new Map<number, string>([
    [6648936, '0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97'],
  ]),
};
