export async function connectKeplr(chainId) {
  if (!window.keplr) {
    alert("Keplr extension is not installed");
    return null;
  }

  // Enable Keplr for the specified chain
  await window.keplr.enable(chainId);

  // Get the offline signer
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();

  return {
    address: accounts[0].address,
    signer: offlineSigner,
  };
}
