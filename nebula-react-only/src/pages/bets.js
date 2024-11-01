import { useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSignAndExecuteTransaction, useSignTransaction,
 } from '@mysten/dapp-kit';
 import { bcs } from '@mysten/sui/bcs';
 import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';


import { loadBet, loadRegister } from '../functions/bet_create';

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';



const Bets = () => {
  const tx = new Transaction();
  const keypair = new Ed25519Keypair();
  const wallet = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();

  const devnetRPC = getFullnodeUrl('devnet');


  const devnetClient = new SuiClient({ url: devnetRPC });

  const [digest, setDigest] = useState('');
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const dispatch = useDispatch();
  const walletConnected = useSelector((state) => state.betting.bettingPackage);
  const packageId = useSelector((state) => state.betting.bettingPackage);
  const nebulaPolice = useSelector((state) => state.betting.bettingPolice)
  const provider = useSelector((state) => state.betting.client);  

    const sendBet = async () => {
        await loadBet(dispatch)
        }
      
      const registerHandler = async () => {
        const nebulaObject =  await devnetClient.getObject({id: nebulaPolice, options: { showContent: true }})
        console.log(nebulaObject.data);

        tx.moveCall({
          package: `0x8461793422a28e6c16f3ed76bc0116bdce5d49c15e628f6a627506ba204a757b`,
          module: "nebula",
          function: "register",
          arguments: [tx.object(`${nebulaPolice}`)], // do we need pure?
          typeArguments: []
        });

        const response = signAndExecuteTransaction({
          transaction: tx,
          chain: 'sui:devnet',
        },
        {
          onSuccess: (response) => {
            console.log('executed transaction', response);
            setDigest(response.digest);
          },
        },)
        }
      

  return (
    <>
    {walletConnected ? (
        <Button onClick={registerHandler}> Register</Button>
        ) : (
        <Button disabled>Please Connect a package</Button>
        )}
        </>
  )
}

export default Bets