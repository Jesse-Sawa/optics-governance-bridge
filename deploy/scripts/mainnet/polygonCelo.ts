import * as celo from '../../config/mainnets/celo';
import * as polygon from '../../config/mainnets/polygon';
import { CoreDeploy } from '../../src/governance/CoreDeploy';
import { deployGovernanceBridgeOnTwoChains } from '../../src/governance';

let celoConfig = celo.config;
let polygonConfig = polygon.config;

const celoDeploy = new CoreDeploy(celo.chain, celoConfig);
const polygonDeploy = new CoreDeploy(polygon.chain, polygonConfig);

deployGovernanceBridgeOnTwoChains(polygonDeploy, celoDeploy);
