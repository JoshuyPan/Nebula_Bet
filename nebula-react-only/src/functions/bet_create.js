import { setBet } from "../store/betting_store"

export const loadRegister = async (dispatch) => {
    // the withdrawing  function here.
    //let packageString = "bet 1 started";
    //dispatch(setBet(packageString.toString()))

return ;
}

export const loadBet = async (dispatch) => {
    // the betting function here.
    let packageString = "bet 1 started";
    dispatch(setBet(packageString.toString()))

return packageString;
}

export const loadWithdraw = async (dispatch) => {
    // the withdrawing  function here.
    let packageString = "bet 1 started";
    dispatch(setBet(packageString.toString()))

return packageString;
}
