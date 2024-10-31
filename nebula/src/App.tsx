import './App.css'

import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

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
        <OwnedObjects address={account.address} />
      </div>
   )

}

function OwnedObjects({ address }: { address: string }){
  const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address
  }
);

  if(!data) {
    return null;
  }

  data.data.forEach((object, index) => {
    console.log(`Object ${index + 1} type:`, object.data?.type || object);
  });
  
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
