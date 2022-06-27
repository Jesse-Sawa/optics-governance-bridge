import { ChainJson, toChain } from '../../src/chain';
import * as dotenv from 'dotenv';
import { CoreConfig } from '../../src/governance/CoreDeploy';

dotenv.config();

const rpc = process.env.ETHEREUM_RPC;
if (!rpc) {
  throw new Error('Missing RPC URI');
}

export const chainJson: ChainJson = {
  name: 'ethereum',
  rpc,
  deployerKey: process.env.ETHEREUM_DEPLOYER_KEY,
  domain: 0x657468, // b'eth' interpreted as an int
  // This isn't actually used because Ethereum supports EIP 1559 - but just in case
  gasPrice: '400000000000', // 400 gwei
  // EIP 1559 params
  maxFeePerGas: '400000000000', // 400 gwei
  maxPriorityFeePerGas: '4000000000', // 4 gwei
  gasLimit: 600000,
};

export const chain = toChain(chainJson);

export const config: CoreConfig = {
  environment: 'prod-community',
  updater: '0x5Ef6e0F6A7E1f866612D806041799a9D762b62c0',
  //TODO set before launch
  recoveryTimelock: 60 * 60 * 24 * 7, // 14 days
  recoveryManager: '0x507B0CED6A8F435866C5C578Cc17C29e22307A0A',
  optimisticSeconds: 60 * 30, // 30 minutes
  watchers: ['0xD0D09d9CF712ccE87141Dfa22a3aBBDb7B1c296e'],
  // governor: {},
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97',
  replicas: new Map<number, string>([
    [1667591279, '0x07b5B57b08202294E657D51Eb453A189290f6385'],
  ]),
};
