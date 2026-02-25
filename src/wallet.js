import freighterApi from "@stellar/freighter-api";

export const connectWallet = async () => {
  const { isConnected } = await freighterApi.isConnected();
  if (!isConnected) throw new Error("Freighter not installed");

  const { isAllowed } = await freighterApi.isAllowed();
  if (!isAllowed) {
    await freighterApi.requestAccess();
  }

  const { address } = await freighterApi.getAddress();
  return address;
};

export const disconnectWallet = () => true;

export const checkNetwork = async () => {
  const { network } = await freighterApi.getNetwork();
  return network; // returns "TESTNET" or "MAINNET"
};