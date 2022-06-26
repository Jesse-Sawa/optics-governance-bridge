import * as dotenv from "dotenv";

import { ethers, Wallet } from "ethers";
import { HELLO_WORLD_CONTRACT, GOV_CONTRACT } from "./constants";
import { formatCall, sendFromSigner } from "./utils";

dotenv.config({ path: __dirname + "/.env" });

async function sendMessageOverOptics() {
  try {
    if (!process.env.PRIVATE_KEY) {
      console.log("Missing private key");
      return;
    }
    if (!process.env.POLYGON_GOV_ADDRESS) {
      console.log("Missing POLYGON_GOV_ADDRESS");
      return;
    }
    if (!process.env.HELLO_WORLD_CONTRACT_CELO_MAINNET_ADDRESS) {
      console.log("Missing HELLO_CONTRACT_ADDRESS_MAINNET_ADDRESS");
      return;
    }

    const provider = new ethers.providers.JsonRpcProvider(
      process.env.POLYGON_RPC
    );
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const celoOpticsDomain = 1667591279;

    const govContract = new ethers.Contract(
      process.env.POLYGON_GOV_ADDRESS,
      GOV_CONTRACT.abi,
      wallet
    );

    const helloWorldContractOnCelo = new ethers.Contract(
      process.env.HELLO_WORLD_CONTRACT_CELO_MAINNET_ADDRESS,
      HELLO_WORLD_CONTRACT.abi,
      wallet
    );

    const call = await formatCall(helloWorldContractOnCelo, "setName", [
      "second update with Optics",
    ]);

    const transactionResponse = await sendFromSigner(
      wallet,
      govContract,
      "callRemote",
      [celoOpticsDomain, [call]]
    );

    const receipt = await transactionResponse.wait();

    console.log({ receipt });
  } catch (error) {
    console.log({ error });
  }
}

sendMessageOverOptics().then(() => console.log("\n"));
