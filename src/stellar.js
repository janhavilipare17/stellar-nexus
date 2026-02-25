import { Horizon } from "@stellar/stellar-sdk";

const server = new Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export const fetchBalance = async (publicKey) => {
  const account = await server.loadAccount(publicKey);

  const nativeBalance = account.balances.find(
    (balance) => balance.asset_type === "native"
  );

  return nativeBalance ? nativeBalance.balance : "0";
};