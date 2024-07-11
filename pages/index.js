import {useState, useEffect} from "react"; // import from React, the framework we're using
import {ethers} from "ethers"; // allows us to interact with the Ethereum blockchain
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json"; // file that gets generated when we compile our contract

export default function HomePage() {
  // State variables -- React's way to get and set variables
  const [ethWallet, setEthWallet] = useState(undefined); // stores the Metamask object in our browser's window
  const [account, setAccount] = useState(undefined); // holds the user account in the Metamask wallet
  const [atm, setATM] = useState(undefined); // holds the contract object
  const [balance, setBalance] = useState(undefined); // holds the user's balance
  const [amountD, setAmountD] = useState(0); // holds the amount to deposit
  const [amountW, setAmountW] = useState(0); // holds the amount to withdraw
  const [amountL, setAmountL] = useState(0); // holds the amount to lock
  const [amountU, setAmountU] = useState(0); // holds the amount to unlock
  const [lockedAmount, setLockedAmount] = useState(0); // holds the locked amount

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // address where we deployed smart contract to
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (amountD > 0) {
      await deposit(amountD);
    } else {
      console.log("Please enter a valid amount.")
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (amountW > 0) {
      await withdraw(amountW);
    } else {
      console.log("Please enter a valid amount.")
    }
  }

  const handleLock = async (e) => {
    e.preventDefault();
    if (lockedAmount <= balance) {
      await lock(amountL);
    } else {
      console.log("Please enter a valid amount.")
    }
  }

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (amountU <= lockedAmount) {
      await unlock(amountU);
    } else {
      console.log("Please enter a valid amount.")
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm && amountD > 0) {
      let tx = await atm.deposit(amountD);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm && amountW > 0 && (balance - lockedAmount) >= amountW) {
      let tx = await atm.withdraw(amountW);
      await tx.wait()
      getBalance();
    }
  }

  const lock = async() => {
    if (atm && amountL > 0 && (balance - lockedAmount) >= amountL) {
      let tx = await atm.lock(amountL);
      await tx.wait()
      setLockedAmount(lockedAmount + parseInt(amountL));
      getBalance();
    }
  }

  const unlock = async() => {
    if (atm && amountU > 0 && lockedAmount >= amountU) {
      let tx = await atm.unlock(amountU);
      await tx.wait()
      getBalance();
    }
  }

  // responsible for rendering the on-demand dynamic html of the page
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <h3>Account Address</h3>
        <p>{account}</p>
        <h3>Account Balance</h3>
        <p>Total: {balance} ETH</p>
        <p>Locked: {lockedAmount} ETH</p>
        <p>Unlocked: {balance - lockedAmount} ETH</p>
        <form onSubmit={handleDeposit}>
          <input type="number" value={amountD} onChange={(e) => setAmountD(e.target.value)} placeholder="Enter amount to deposit" min="0"/>
          <button onClick={handleDeposit}>Deposit ETH</button>
        </form>
        <form onSubmit={handleWithdraw}>
          <input type="number" value={amountW} onChange={(e) => setAmountW(e.target.value)} placeholder="Enter amount to withdraw" min="0"/>
          <button onClick={handleWithdraw}>Withdraw ETH</button>
        </form>
        <form onSubmit={handleLock}>
          <input type="number" value={amountL} onChange={(e) => setAmountL(e.target.value)} placeholder="Enter amount to lock" min="0"/>
          <button onClick={handleLock}>Lock ETH</button>
        </form>
        <form onSubmit={handleUnlock}>
          <input type="number" value={amountU} onChange={(e) => setAmountU(e.target.value)} placeholder="Enter amount to unlock" min="0"/>
          <button onClick={handleUnlock}>Unlock ETH</button>
        </form>
      </div>
    )
  }

  // this function is immediately called when the page is first loaded
  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()} 
      <style jsx global>{`
        body {
          background-color: #36393B;
          font-family: 'Inter', sans-serif;
          color: #F0EAD6;
        }
        .container {
          text-align: center;
        }
        header {
          color: #A5D8FF;
          letter-spacing: 1px;
          font-size: 24px;
          padding-top: 50px;
          padding-bottom: 15px;
        }
        h3 {
          font-size: 24px;
          color: #BFB6BB;
        }
        p {
          font-size: 18px;
        }
        button {
          background-color: #A5D8FF;
          font-family: 'Inter', sans-serif;
          color: #36393B;
          border: 1px solid #A5D8FF;
          padding: 10px 20px;
          margin: 10px;
          cursor: pointer;
          border-radius: 5px;
          width: 150px;
        }
        button:hover {
          background-color: #C49799;
          border: 1px solid #C49799;
        }
        input {
          font-family: 'Inter', sans-serif;
          padding: 10px;
          margin: 10px;
          border-radius: 5px;
          border: 1px solid #A5D8FF;}
      `}
      </style>
    </main>
  )
}
