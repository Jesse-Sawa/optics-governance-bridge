import * as contracts from '@optics-xyz/ts-interface/dist/optics-core';

import { CoreDeploy } from './CoreDeploy';
import { toBytes32 } from '../utils';
import { assert } from 'console';
import * as proxyUtils from '../proxyUtils';
import { checkCoreDeploy } from './checks';
import {writeDeployOutput} from "./util";

export async function deployGovernanceBridgeOnTwoChains(
  gov: CoreDeploy,
  non: CoreDeploy,
) {
  console.log(
    `Deploying governance bridge on Gov:${gov.chain.name} with domain ${gov.chain.domain} and Non:${non.chain.name} with domain ${non.chain.domain}`,
  );

  console.log('\nawaiting provider ready');
  await Promise.all([gov.ready(), non.ready()]);

  console.log('\ndeploying governance routers and supporting contracts');
  await Promise.all([deployGovernanceBridge(gov), deployGovernanceBridge(non)]);

  console.log('\nenrolling existing replicas');
  await Promise.all([
    enrollExistingReplica(gov, non),
    enrollExistingReplica(non, gov),
  ]);

  console.log('\nenrolling watchers');
  await Promise.all([enrollWatchers(gov, non), enrollWatchers(non, gov)]);

  console.log('\nenrolling governance routers');
  await Promise.all([
    enrollGovernanceRouter(gov, non),
    enrollGovernanceRouter(non, gov),
  ]);

  console.log('\ntransferring governorship');
  await transferGovernorship(gov, non);

  console.log('\nrelinquishing to governor chains');
  await Promise.all([relinquish(gov), relinquish(non)]);

  console.log('\nrunning deployment checks ...');
  const govDomain = gov.chain.domain;
  const nonDomain = non.chain.domain;
  await checkCoreDeploy(gov, [nonDomain], govDomain);
  await checkCoreDeploy(non, [govDomain], govDomain);

  console.log('\nwriting deploy output');
  writeDeployOutput([gov, non]);
}

/*
  Contracts to be deployed
  UpgradeBeaconController
  UpdaterManager
  xAppConnectionManager
  GovernanceRouter
*/

async function deployGovernanceBridge(deploy: CoreDeploy) {
  console.log(`${deploy.chain.name}: awaiting deploy UBC`);
  await deployUpgradeBeaconController(deploy);

  console.log(`${deploy.chain.name}: awaiting deploy UpdaterManager`);
  await deployUpdaterManager(deploy);

  console.log(`${deploy.chain.name}: awaiting deploy XappConnectionManager`);
  await deployXAppConnectionManager(deploy);

  console.log(`${deploy.chain.name}: awaiting XAppConnectionManager.setHome`);
  await deploy.contracts.xAppConnectionManager!.setHome(
    deploy.config.homeAddress,
    deploy.overrides,
  );

  console.log(`${deploy.chain.name}: awaiting updaterManager.setHome`);
  await deploy.contracts.updaterManager!.setHome(
    deploy.config.homeAddress,
    deploy.overrides,
  );

  console.log(`${deploy.chain.name}: awaiting deploy GovernanceRouter`);
  await deployGovernanceRouter(deploy);
}

async function enrollExistingReplica(local: CoreDeploy, remote: CoreDeploy) {
  try {
    const replica = local.config.replicas.get(remote.chain.domain);
    console.log(
      `local is ${local.chain.name} using replica ${replica} for ${remote.chain.name} with domain ${remote.chain.domain}`,
    );
    let tx = await local.contracts.xAppConnectionManager!.ownerEnrollReplica(
      replica!,
      remote.chain.domain,
      local.overrides,
    );
    await tx.wait(local.chain.confirmations);

    console.log(`${local.chain.name}: replica enrollment done`);
  } catch (error) {
    console.log({ localName: local.chain.name });
    throw error;
  }
}

async function enrollWatchers(left: CoreDeploy, right: CoreDeploy) {
  try {
    console.log(`${left.chain.name}: starting watcher enrollment`);

    await Promise.all(
      left.config.watchers.map(async (watcher) => {
        const tx =
          await left.contracts.xAppConnectionManager!.setWatcherPermission(
            watcher,
            right.chain.domain,
            true,
            left.overrides,
          );
        await tx.wait(left.chain.confirmations);
      }),
    );

    console.log(`${left.chain.name}: watcher enrollment done`);
  } catch (error) {
    console.log({ leftName: left.chain.name });
    throw error;
  }
}

async function enrollGovernanceRouter(local: CoreDeploy, remote: CoreDeploy) {
  try {
    console.log(
      `${local.chain.name}: starting enroll ${remote.chain.name} governance router`,
    );
    let tx = await local.contracts.governance!.proxy.setRouter(
      remote.chain.domain,
      toBytes32(remote.contracts.governance!.proxy.address),
      local.overrides,
    );
    await tx.wait(local.chain.confirmations);
    console.log(
      `${local.chain.name}: enrolled ${remote.chain.name} governance router`,
    );
  } catch (error) {
    console.log({ localName: local.chain.name });
    throw error;
  }
}

async function transferGovernorship(gov: CoreDeploy, non: CoreDeploy) {
  try {
    let governorAddress = await gov.contracts.governance!.proxy.governor();
    console.log(
      `${non.chain.name}: transferring governorship to ${governorAddress}`,
    );
    let tx = await non.contracts.governance!.proxy.transferGovernor(
      gov.chain.domain,
      governorAddress,
      non.overrides,
    );
    await tx.wait(gov.chain.confirmations);
    console.log(`${non.chain.name}: governorship transferred`);
  } catch (error) {
    console.log({ govName: gov.chain.name });
    throw error;
  }
}

async function deployXAppConnectionManager(deploy: CoreDeploy) {
  try {
    const deployer = deploy.deployer;
    const factory = new contracts.XAppConnectionManager__factory(deployer);

    deploy.contracts.xAppConnectionManager = await factory.deploy(
      deploy.overrides,
    );
    await deploy.contracts.xAppConnectionManager.deployTransaction.wait(
      deploy.chain.confirmations,
    );

    // add contract information to Etherscan verification array
    deploy.verificationInput.push({
      name: 'XAppConnectionManager',
      address: deploy.contracts.xAppConnectionManager!.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.log({ name: deploy.chain.name });
    throw error;
  }
}

async function deployUpgradeBeaconController(deploy: CoreDeploy) {
  try {
    let factory = new contracts.UpgradeBeaconController__factory(
      deploy.deployer,
    );
    deploy.contracts.upgradeBeaconController = await factory.deploy(
      deploy.overrides,
    );
    assert(deploy.contracts.upgradeBeaconController);
    await deploy.contracts.upgradeBeaconController.deployTransaction.wait(
      deploy.chain.confirmations,
    );

    // add contract information to Etherscan verification array
    deploy.verificationInput.push({
      name: 'UpgradeBeaconController',
      address: deploy.contracts.upgradeBeaconController.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.log({ name: deploy.chain.name });
    throw error;
  }
}

async function deployUpdaterManager(deploy: CoreDeploy) {
  try {
    let factory = new contracts.UpdaterManager__factory(deploy.deployer);
    deploy.contracts.updaterManager = await factory.deploy(
      deploy.config.updater,
      deploy.overrides,
    );
    await deploy.contracts.updaterManager.deployTransaction.wait(
      deploy.chain.confirmations,
    );

    // add contract information to Etherscan verification array
    deploy.verificationInput.push({
      name: 'UpdaterManager',
      address: deploy.contracts.updaterManager!.address,
      constructorArguments: [deploy.config.updater],
    });
  } catch (error) {
    console.log({ name: deploy.chain.name });
    throw error;
  }
}

async function deployGovernanceRouter(deploy: CoreDeploy) {
  try {
    const governanceRouter = contracts.GovernanceRouter__factory;

    let { xAppConnectionManager } = deploy.contracts;
    const recoveryManager = deploy.config.recoveryManager;
    const recoveryTimelock = deploy.config.recoveryTimelock;

    let initData = governanceRouter
      .createInterface()
      .encodeFunctionData('initialize', [
        xAppConnectionManager!.address,
        recoveryManager,
      ]);

    deploy.contracts.governance =
      await proxyUtils.deployProxy<contracts.GovernanceRouter>(
        'Governance',
        deploy,
        new governanceRouter(deploy.deployer),
        initData,
        deploy.chain.domain,
        recoveryTimelock,
      );
  } catch (error) {
    console.log({ name: deploy.chain.name });
    throw error;
  }
}

export async function relinquish(deploy: CoreDeploy) {
  const govRouter = await deploy.contracts.governance!.proxy.address;

  console.log(`${deploy.chain.name}: Relinquishing control`);
  await deploy.contracts.updaterManager!.transferOwnership(
    govRouter,
    deploy.overrides,
  );

  console.log(`${deploy.chain.name}: Dispatched relinquish updatermanager`);

  await deploy.contracts.xAppConnectionManager!.transferOwnership(
    govRouter,
    deploy.overrides,
  );

  console.log(
    `${deploy.chain.name}: Dispatched relinquish XAppConnectionManager`,
  );

  let tx = await deploy.contracts.upgradeBeaconController!.transferOwnership(
    govRouter,
    deploy.overrides,
  );

  console.log(
    `${deploy.chain.name}: Dispatched relinquish upgradeBeaconController`,
  );

  console.log('. . . Not dispatching relinquish home');
  // let tx = await deploy.contracts.home!.proxy.transferOwnership(
  //   govRouter,
  //   deploy.overrides,
  // );
  //
  // log(isTestDeploy, `${deploy.chain.name}: Dispatched relinquish home`);

  await tx.wait(deploy.chain.confirmations);
  console.log(`${deploy.chain.name}: Control relinquished`);
}


