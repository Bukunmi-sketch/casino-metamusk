import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import metamusk from "../assets/download.jpeg"
import casino from "../assets/casino.png"

const EthereumBalance = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [inputAddress, setInputAddress] = useState('');
    const [useMetaMask, setUseMetaMask] = useState(false);

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    useEffect(() => {
        // Connect to MetaMask on component mount
        connectToMetaMask();
    }, []);

    // const connectToMetaMask = () => {
    //     if (window.Ethereum) {
    //         const provider = new ethers.providers.Web3Provider(window.Ethereum)
    //         provider.send("eth_requestAccounts", []).then(async () => {
    //             await accountChangedHandler(provider.getSigner());
    //         })
    //     } else {
    //         showError("Please Install Metamask!!!");
    //     }
    // }

      const connectToMetaMask = async () => {
        // Check if MetaMask is installed
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                setAccount([result[0]]);
                // showError([result[0]])
            })
        //   try {
        //     // Request account access if needed
        //     await window.ethereum.request({ method: 'eth_requestAccounts' });
        //     const provider = new ethers.providers.Web3Provider(window.ethereum);
        //     const signer = provider.getSigner();

        //     // Get the connected account address
        //     const connectedAccount = await signer.getAddress();
        //     setAccount(connectedAccount);

        //     // Get the account balance
        //     const connectedBalance = await signer.getBalance();
        //     setBalance(ethers.utils.formatEther(connectedBalance));
        //   } catch (error) {
        //     showError('Error connecting to MetaMask shit:', error.message);
        //   }
        } else {
          showError('MetaMask not detected! Please install it.');
        }
      };

    // const changeAccount = async () => {
    //     try {
    //         // Request account access if needed
    //         await window.ethereum.request({ method: 'eth_requestAccounts' });
    //         const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         const signer = provider.getSigner();

    //         // Get the new connected account address
    //         const newAccount = await signer.getAddress();
    //         setAccount(newAccount);

    //         // Get the new account balance
    //         const newBalance = await signer.getBalance();
    //         setBalance(ethers.utils.formatEther(newBalance));
    //     } catch (error) {
    //         showError('Error changing account:', error.message);
    //     }
    // };

    const changeAccount = async () => {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      
          // Get the connected account address
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
          if (accounts.length > 0) {
            const newAccount = accounts[0];
            setAccount(newAccount);
      
            // Get the new account balance
            const newBalance = await getBalance(newAccount);
            setBalance(newBalance);
          } else {
            showError('No accounts found after account access.');
          }
        } catch (error) {
          showError(error);
        }
      };


      const getBalance = async (address) => {
        try {
          const result = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest'], // 'latest' for the latest block
          });
      
          // Convert hexadecimal balance to decimal and format in ETH
          const balanceInWei = parseInt(result, 16);
          const balanceInEth = balanceInWei / 1e18; // Convert Wei to ETH
      
          return balanceInEth.toFixed(6); // Adjust the precision as needed
        } catch (error) {
          console.error('Error getting balance:', error.message);
          // You can handle the error or return a default value
          return '0.000000';
        }
      };
      
      

    // const accountChangedHandler = async (newAccount) => {
    //     const address = await newAccount.getAddress();
    //     setDefaultAccount(address);
    //     const balance = await newAccount.getBalance()
    //     setUserBalance(ethers.utils.formatEther(balance));
    //     await getuserBalance(address)
    // }
    // const getuserBalance = async (address) => {
    //     const provider = new ethers.providers.Web3Provider(window.Ethereum)
    //     const balance = await provider.getBalance(address, "latest")
    // }

    const connectToCustomAddress = async () => {
        try {
          // Check if the address is ineligible
          if (isIneligibleAddress(inputAddress)) {
            showError('Ineligible Wallet Address', 'This wallet address is ineligible for use.');
            return;
          }
      
          // Validate the provided wallet address
          if (!inputAddress || !isValidAddress(inputAddress)) {
            showError('Invalid Wallet Address', 'Please enter a valid Ethereum wallet address.');
            return;
          }
      
          // Check if the address has insufficient funds
          // Uncomment and modify the following lines as needed
          // const hasSufficientFunds = await hasSufficientFundsInWallet(inputAddress);
          // if (!hasSufficientFunds) {
          //   showError('Insufficient Funds', 'The wallet address has insufficient funds.');
          //   return;
          // }
      
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      
          // Fetch the account balance for the custom address
          const result = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [inputAddress, 'latest'], // 'latest' for the latest block
          });
      
          // Convert hexadecimal balance to decimal and format in ETH
          const connectedBalanceInWei = parseInt(result, 16);
          const connectedBalanceInEth = connectedBalanceInWei / 1e18;
      
          // Update the state with the connected account and balance
          setAccount(inputAddress);
          setBalance(connectedBalanceInEth.toFixed(6)); // Adjust the precision as needed
        } catch (error) {
          showError('Error connecting to custom address:', error.message);
        }
      };

    // const connectToCustomAddress = async () => {
    //     try {

    //         // Check if the address is ineligible
    //         if (isIneligibleAddress(inputAddress)) {
    //             showError('Ineligible Wallet Address', 'This wallet address is ineligible for use.');
    //             return;
    //         }
    //         // Validate the provided wallet address
    //         if (!inputAddress || !isValidAddress(inputAddress)) {
    //             showError('Invalid Wallet Address', 'Please enter a valid Ethereum wallet address.');
    //             return;
    //         }

    //         // Check if the address has insufficient funds
    //         // const hasSufficientFunds = await hasSufficientFundsInWallet(inputAddress);
    //         // if (!hasSufficientFunds) {
    //         //     showError('Insufficient Funds', 'The wallet address has insufficient funds.');
    //         //     return;
    //         // }


    //         const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         const connectedAccount = inputAddress; // Use the inputAddress directly
    //         setAccount(connectedAccount);

    //         // Get the account balance for the custom address
    //         const connectedBalance = await provider.getBalance(inputAddress);
    //         setBalance(ethers.utils.formatEther(connectedBalance));
    //     } catch (error) {
    //         showError('Error connecting to custom address:', error.message);
    //     }
    // };

    const isIneligibleAddress = (address) => {
        // Check if the address is in the list of ineligible addresses
        const ineligibleAddresses = ['0xSomeAddress', '0xAnotherAddress'];
        return ineligibleAddresses.includes(address);
    };

    // const hasSufficientFundsInWallet = async (address) => {
    //     try {
    //         const provider = new ethers.providers.JsonRpcProvider();
    //         const balance = await provider.getBalance(address);
    //         return balance.gt(ethers.utils.parseEther('0.1')); // Adjust the threshold as needed
    //     } catch (error) {
    //         console.error('Error checking funds:', error);
    //         return false;
    //     }
    // };

    const isValidAddress = (address) => {
        // Check if the address is a valid Ethereum address
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
                    <button onClick={changeAccount}>View Balance</button>
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
                            {/* <button
                style={{ background: defaultAccount ? "#A5CC82" : "#A5CC82" }}
                onClick={connectToMetaMask}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </button> */}
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
