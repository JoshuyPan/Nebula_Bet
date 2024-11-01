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
    const network = useSelector((state) => state.betting.network);
    const tx = new Transaction();
    const currentAccount = useCurrentAccount();
    const devnetRPC = getFullnodeUrl(`${network}`);


    const devnetClient = new SuiClient({ url: devnetRPC });

    const accounts = useAccounts();
    const [account, setAccount] = useState(null);
    const dispatch = useDispatch();

    // Run when currentAccount or network changes
    useEffect(() => {
        const fetchAccount = async () => {
            if (currentAccount) {
                // client setup
                await loadClient(devnetClient, dispatch);
                // account setup
                const account = accounts[0];
                await loadAccount(account, dispatch);
                setAccount(account.address.toString());
                // Add any additional actions here
            }
        };
        fetchAccount();
    }, [currentAccount, network, dispatch]); // Added network to dependency array

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
