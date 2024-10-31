
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
  useAccounts
} from '@mysten/dapp-kit';

import { toBase64 } from '@mysten/sui/utils';
import { loadAccount } from './functions/account';


function App() {
	const currentAccount = useCurrentAccount();
  const accounts = useAccounts();
	const [account, setAccount] = useState(null);
	const dispatch = useDispatch();

	// Run only once when currentAccount changes and is set
	useEffect(() => {
		const fetchAccount = async () => {
			if (currentAccount) {
        const account = accounts[0]
        await loadAccount(account, dispatch)
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
