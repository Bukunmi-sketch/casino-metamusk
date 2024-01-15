import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import metamusk from "../assets/download.jpeg";
import casino from "../assets/casino.png";

const EthereumBalance = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [inputAddress, setInputAddress] = useState('');
  const [useMetaMask, setUseMetaMask] = useState(false);

  useEffect(() => {
    // Connect to MetaMask on component mount
    connectToMetaMask();
  }, []);

//   const connectToMetaMask = async () => {
//     if (window.ethereum) {
//       try {
//         // Request account access only if there is no pending request
//         if (window.ethereum._metamask.isUnlocked()) {
//           const accounts = await window.ethereum.request({ method: 'eth_accounts' });

//           if (accounts.length > 0) {
//             const connectedAccount = accounts[0];
//             setAccount(connectedAccount);

//             const connectedBalance = await getBalance(connectedAccount);
//             setBalance(connectedBalance);
//           } else {
//             showError('Account access not granted.');
//           }
//         }
//       } catch (error) {
//         handleConnectError(error);
//       }
//     } else {
//       showError('MetaMask not detected! Please install it.');
//     }
//   };
// const connectToMetaMask = async () => {
//     if (window.ethereum) {
//       try {
//         console.log('Requesting account access...');
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         console.log('Account access granted.');
  
//         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//         if (accounts.length > 0) {
//           const connectedAccount = accounts[0];
//           console.log('Connected Account:', connectedAccount);
  
//           const connectedBalance = await getBalance(connectedAccount);
//           console.log('Connected Balance:', connectedBalance);
  
//           setAccount(connectedAccount);
//           setBalance(connectedBalance);
//         } else {
//           console.log('No accounts found after account access.');
//         }
//       } catch (error) {
//         console.error('Error connecting to MetaMask:', error.message);
//         handleConnectError(error);
//       }
//     } else {
//       console.log('MetaMask not detected! Please install it.');
//       showError('MetaMask not detected! Please install it.');
//     }
//   };
  

  const requestAccountAccess = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);

        const connectedBalance = await getBalance(connectedAccount);
        setBalance(connectedBalance);
      }
    } catch (error) {
      handleConnectError(error);
    }
  };

  const getBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      handleConnectError(error);
      return '0';
    }
  };

  const handleConnectError = (error) => {
    if (error.code === 4001) {
      console.log('User rejected the request for account access.');
    } else {
      console.error('Error connecting to wallet:', error.message);
      showError('Error connecting to wallet:', error.message);
    }
  };

  const connectToCustomAddress = async () => {
    try {
      if (useMetaMask) {
        await requestAccountAccess();
      } else {
        if (isIneligibleAddress(inputAddress)) {
          showError('Ineligible Wallet Address', 'This wallet address is ineligible for use.');
          return;
        }

        if (!inputAddress || !isValidAddress(inputAddress)) {
          showError('Invalid Wallet Address', 'Please enter a valid Ethereum wallet address.');
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const connectedAccount = inputAddress;
        setAccount(connectedAccount);

        const connectedBalance = await provider.getBalance(inputAddress);
        setBalance(ethers.utils.formatEther(connectedBalance));
      }
    } catch (error) {
      handleConnectError(error);
    }
  };

  const isIneligibleAddress = (address) => {
    const ineligibleAddresses = ['0xSomeAddress', '0xAnotherAddress'];
    return ineligibleAddresses.includes(address);
  };

  const isValidAddress = (address) => {
    return /^0x[0-9A-Fa-f]{40}$/.test(address);
  };

  const showError = (title, message) => {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      customClass: {
        popup: 'custom-popup-class',
      },
    });
  };

  return (
    <div className='container'>
      <img className='img' src={metamusk} alt="" />
      {account ? (
        <div className='input-box'>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={requestAccountAccess}>Change Account</button>
        </div>
      ) : (
        <div className='container-box' >
          <p>Please choose how you want to connect:</p>
          <div className="label-box">
            <label>
              <input type="radio" value="useMetaMask" checked={useMetaMask} onChange={() => setUseMetaMask(true)} />  Connect to Metamusk
            </label>
            <label>
              <input type="radio" value="inputAddress" checked={!useMetaMask} onChange={() => setUseMetaMask(false)} /> Input Wallet Address
            </label>
          </div>

          {useMetaMask ? (
            <div className='input-box' >
              <button className='button' onClick={connectToMetaMask}>Connect with MetaMask</button>
            </div>
          ) : (
            <div className='input-box' >
              <input type="text" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Enter Wallet Address" />
              <span onClick={connectToCustomAddress}> Connect</span>
            </div>
          )}
        </div>

      )}
      <img src={casino} alt="" loading='lazy' />
    </div>
  );
};

export default EthereumBalance;
