import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const EthereumBalance = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [inputAddress, setInputAddress] = useState('');

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

  const connectToCustomAddress = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Connect to the custom address provided by the user
      const connectedAccount = await signer.getAddress();
      setAccount(connectedAccount);

      // Get the account balance for the custom address
      const connectedBalance = await signer.getBalance();
      setBalance(ethers.utils.formatEther(connectedBalance));
    } catch (error) {
      console.error('Error connecting to custom address:', error.message);
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
        <div>
          <p>
            Please install MetaMask or enter your wallet address to connect:
          </p>
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Enter Wallet Address"
          />
          <button onClick={connectToCustomAddress}>Connect</button>
        </div>
      )}
    </div>
  );
};

export default EthereumBalance;
