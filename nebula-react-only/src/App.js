import logo from './logo.svg';
import './App.css';
import { loadBet } from './functions/bet_create';
import DropTab from './functions/dropdown';

import {Button} from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
//sui stuff
import { Transaction } from '@mysten/sui/transactions';
import {
	ConnectButton,
	useCurrentAccount,
	useSignTransaction,
  ConnectModal,
} from '@mysten/dapp-kit';

import { toBase64 } from '@mysten/sui/utils';

function App() {
  const networkConnected = useSelector((state) => state.betting.bettingPackage);

  const currentAccount = useCurrentAccount();
  const[account, setAccount] = useState(null);
	const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const connect = async () => {
  await loadBet(dispatch)
  }
  return (
    <div className="App">
      <header className="App-header">
        {currentAccount? (
          <>
      <DropTab/> <hr />
      {networkConnected ? (
        <Button onClick={connect}> bet</Button>
        ) : (
        <Button disabled>Please Connect a package</Button>
        )}
      </>
        ):(
          <>
      <ConnectButton /> <hr></hr>
      </>
        )}        
      </header>
    </div>
  );
}

export default App;
