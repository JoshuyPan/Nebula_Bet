import { useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'react-bootstrap';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSignAndExecuteTransaction, useSignTransaction,
 } from '@mysten/dapp-kit';
 import {SUI_CLOCK_OBJECT_ID} from '@mysten/sui/utils'
 import { bcs } from '@mysten/bcs';

import { loadBet, loadRegister } from '../functions/bet_create';


const Bets = () => {
  const tx = new Transaction();
  const wallet = useCurrentAccount();
  const [show, setShow] = useState(true);
  const [digest, setDigest] = useState('');
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionfailed, setTransactionFailed] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const dispatch = useDispatch();
  const walletConnected = useSelector((state) => state.betting.bettingPackage);
  const packageId = useSelector((state) => state.betting.bettingPackage);
  const nebulaPolice = useSelector((state) => state.betting.bettingPolice)
  const provider = useSelector((state) => state.betting.client);  

    const betHandler = async () => {
      const amount = 1; // Your amount as a number
      const bcsAmount = bcs.u64().serialize(amount).toBytes();
      let duration = 60000; // one minute in ms
      const bcsDuration = bcs.u64().serialize(duration).toBytes();
        try{
          console.log("attempting bet")
          tx.moveCall({
            package: `${packageId}`,
            module: "bet",
            function: "create_bet",
            arguments: [tx.pure(bcsAmount, "u64"), tx.pure(bcsDuration, "u64"), tx.object(SUI_CLOCK_OBJECT_ID)], 
            typeArguments: []
          });
          console.log("movecall completed")
          const response = signAndExecuteTransaction({
            transaction: tx,
            chain: 'sui:devnet',
          },
          {
            onSuccess: (response) => {
              console.log('executed transaction', response);
              setDigest(response.digest);
              setTransactionComplete(true);
            },
          },)
        } catch (error) {
          console.error("Error during bet transaction:", error);
          window.alert("Transaction failed.");
        }
        }
      
      const registerHandler = async () => {
        setTransactionComplete(false)
        setTransactionFailed(false)
        try{
          tx.moveCall({
            package: `${packageId}`,
            module: "nebula",
            function: "register",
            arguments: [tx.object(`${nebulaPolice}`)], 
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
              setTransactionComplete(true);
            },
          },)
        } catch {
          setTransactionFailed(true);
        }
        }
      

        return (
          <>
            {walletConnected ? (
              <>
              <Button onClick={registerHandler}> Register</Button><br></br>
              <Button onClick={betHandler}>Create Bet 1SUI</Button>
              </>
            ) : (
              <Button disabled>Please Connect a package</Button>
            )}
            {digest && (
              <Alert variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Transaction Success!</Alert.Heading>
                <p>
                  Transaction Digest: <code>{digest}</code>
                </p>
              </Alert>
            )}
            {transactionfailed && (
              <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! Somethings Not Right!</Alert.Heading>
                <p>
                  There seems to be an issue with executing this transaction... Please try again.
                </p>
              </Alert>
            )}
          </>
        );
      };

export default Bets