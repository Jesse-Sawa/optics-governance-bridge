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
  gasPrice: '40000000000', // 400 gwei
  // EIP 1559 params
  maxFeePerGas: '200000000000', // 400 gwei
  maxPriorityFeePerGas: '8000000000', // 4 gwei
};

export const chain = toChain(chainJson);

export const config: CoreConfig = {
  environment: 'prod-community',
  updater: '0x5Ef6e0F6A7E1f866612D806041799a9D762b62c0',
  recoveryTimelock: 60 * 60 * 24 * 7, // 7 days
  recoveryManager: '0x484c9FD80e0A5f06db8D7D7C893D27658Fda4b10',
  optimisticSeconds: 60 * 30, // 30 minutes
  watchers: [
    '0xd87fcd362391607e0ca10d1eaaf08a185f7a2d5a',
    '0xafa81fb03431c3b4c3061e4e7cedcfca448d49d3',
    '0x6d1a467fadcd8b9dc4f1fd48e8579438640a4b29',
  ],
  governor: {
    domain: chainJson.domain,
    address: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
  },
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97',
  replicas: new Map<number, string>([
    [1667591279, '0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97'],
  ]),
};
