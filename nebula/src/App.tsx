import './App.css'

import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

//0x10588dc3b1dc6a32f90eeea8f00b8795570632843ade879656afe8e7599a8808

function App() {
  return (
    <>
      <h1>Nebula Bet</h1>
      <ConnectButton></ConnectButton>
      <ConnectedAccount />
    </>
  )
}

function ConnectedAccount() {
   const account = useCurrentAccount();

   if(!account){
    return null;
   }

   return (
      <div>
        <div>Connected to {account.address}</div>
        <button onClick={register}>Register</button>
      </div>
   )

}

function register() {
  const tbx = new TransactionBlock();
  const police = tbx.object('0x0912f89b02934d52b810725337abc42c1693ab68d126567a667b0eae74f55d27');

  
  tbx.moveCall({
    target: "0x10588dc3b1dc6a32f90eeea8f00b8795570632843ade879656afe8e7599a8808::nebula::register",
    arguments: [ police ],
  })

  console.log("Success")
}

function OwnedObjects({ address }: { address: string }){
  const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address
  }
);

  if(!data) {
    return null;
  }

  console.log(data.data)

  return(
    <ul>
      {data.data.map((object) => (
        <li key={object.data?.objectId}>
            <a href={`https://testnet.suivision.xyz/object/${object.data?.objectId}`}>
              {object.data?.objectId}
            </a>
        </li>
      ))}
    </ul>
  )
}


export default App
