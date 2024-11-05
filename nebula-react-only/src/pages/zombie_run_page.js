import { useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'react-bootstrap';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSignAndExecuteTransaction, useSignTransaction,
 } from '@mysten/dapp-kit';
 import {SUI_TYPE_ARG, SUI_DECIMALS } from '@mysten/sui/utils'
 import { DEVNET_ZOMBIE_POOL } from "../package_info/packages";
 import { bcs } from '@mysten/bcs';
 import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';



const Zombie_run = () => {
  const tx = new Transaction();
  const [show, setShow] = useState(null);
  const [digest, setDigest] = useState('');
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionfailed, setTransactionFailed] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const dispatch = useDispatch();
  const network = useSelector((state) => state.betting.network)
  const walletConnected = useSelector((state) => state.betting.bettingPackage);
  const packageId = useSelector((state) => state.betting.bettingPackage);
  const nebulaPolice = useSelector((state) => state.betting.bettingPolice)
  const account = useSelector((state) => state.betting.account)

  const RPC = getFullnodeUrl(`devnet`);
  const Client = new SuiClient({ url: RPC });

      
      const play_button = async () => {
        setTransactionComplete(false)
        setTransactionFailed(false)
        const amount = 1000000000;// o.1 sui token
        const bet_amount = bcs.u64().serialize(amount).toBytes();
        const distance = 60; // one minute in ms
        const bet_distance = bcs.u64().serialize(distance).toBytes();
        console.log("account", account);
        const gasBudget = 100000000
        const account_string = account.toString();
        const coin_data = await Client.getCoins({owner: account_string,
            limit: 1
        });
        const coin = coin_data.data[0].coinObjectId;
        console.log("coin", coin);

        try{
            //tx.setGasBudget(gasBudget);
          tx.moveCall({
            package: `${packageId}`,
            module: "zombie_run",
            function: "play_zombie_run",
            arguments: [tx.pure(bet_distance, "u64"), tx.pure(bet_amount, "u64"), tx.object(coin), tx.object(`${DEVNET_ZOMBIE_POOL}`)], 
            typeArguments: []
          });
          const response = signAndExecuteTransaction({
            transaction: tx,
            chain: `sui:${network}`,
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
              <Button onClick={play_button}>Play Zombie Run / Bet 1 Sui</Button>
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

export default Zombie_run