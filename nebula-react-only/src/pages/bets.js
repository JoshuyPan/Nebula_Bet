import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

import { loadBet } from '../functions/bet_create';


const Bets = () => {
    const dispatch = useDispatch();
  const walletConnected = useSelector((state) => state.betting.bettingPackage);

    const sendBet = async () => {
        await loadBet(dispatch)
        }

  return (
    <>
    {walletConnected ? (
        <Button onClick={sendBet}> bet</Button>
        ) : (
        <Button disabled>Please Connect a package</Button>
        )}
        </>
  )
}

export default Bets