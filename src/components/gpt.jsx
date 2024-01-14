import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const EthereumBalance = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Connect to MetaMask on component mount
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Get the connected account address
        const connectedAccount = await signer.getAddress();
        setAccount(connectedAccount);

        // Get the account balance
        const connectedBalance = await signer.getBalance();
        setBalance(ethers.utils.formatEther(connectedBalance));
      } catch (error) {
        console.error('Error connecting to MetaMask:', error.message);
      }
    } else {
      console.error('MetaMask not detected! Please install it.');
    }
  };

  const changeAccount = async () => {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get the new connected account address
      const newAccount = await signer.getAddress();
      setAccount(newAccount);

      // Get the new account balance
      const newBalance = await signer.getBalance();
      setBalance(ethers.utils.formatEther(newBalance));
    } catch (error) {
      console.error('Error changing account:', error.message);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={changeAccount}>Change Account</button>
        </div>
      ) : (
        <p>Please install MetaMask to use this application.</p>
      )}
    </div>
  );
};

export default EthereumBalance;
