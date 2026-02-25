import * as StellarSdk from "@stellar/stellar-sdk";
import freighterApi from "@stellar/freighter-api";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export const sendXLM = async (sourcePublicKey, destination, amount) => {
  const account = await server.loadAccount(sourcePublicKey);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destination.trim(),
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(180)
    .build();

  
  const result = await freighterApi.signTransaction(transaction.toXDR(), {
    networkPassphrase: StellarSdk.Networks.TESTNET,
    accountToSign: sourcePublicKey,
  });

  //  Handle both old and new return formats safely
  const signedXdr = typeof result === "string" ? result : result.signedTxXdr;

  if (!signedXdr) throw new Error("Freighter did not return a signed transaction");

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    StellarSdk.Networks.TESTNET
  );

  return await server.submitTransaction(signedTx);
};