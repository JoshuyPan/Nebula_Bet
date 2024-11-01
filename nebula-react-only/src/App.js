
import './App.css';

import DropTab from './functions/dropdown';
import Bets from './pages/bets';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
// Sui imports
import { Transaction } from '@mysten/sui/transactions';
import {
	ConnectButton,
	useCurrentAccount,
	useSignTransaction,
  ConnectModal,
  useAccounts,
} from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

import { toBase64 } from '@mysten/sui/utils';
import { loadAccount, loadClient } from './functions/account';


function App() {
  const tx = new Transaction();
	const currentAccount = useCurrentAccount();
  const devnetRPC = getFullnodeUrl('devnet');
  const mainnetRPC = getFullnodeUrl('mainnet');

  const mainnetClient = new SuiClient({ url: mainnetRPC });
  const devnetClient = new SuiClient({ url: devnetRPC });

  const accounts = useAccounts();
	const [account, setAccount] = useState(null);
	const dispatch = useDispatch();

	// Run only once when currentAccount changes and is set
	useEffect(() => {
		const fetchAccount = async () => {
			if (currentAccount) {
        // client setup
        await loadClient(devnetClient, dispatch)
        //account setup
        const account = accounts[0]
        await loadAccount(account, dispatch)
        setAccount(account.address.toString())
				// Add any additional actions here
			}
		};
		fetchAccount();
	}, [currentAccount, dispatch]);

	return (
		<div className="App">
			<header className="App-header">
				{currentAccount ? (
					<>
						<DropTab /> <hr />
						<Bets />
            <p>your address: {account}</p>
            
					</>
				) : (
					<>
						<ConnectButton /> <hr />
					</>
				)}
			</header>
		</div>
	);
}

export default App;
