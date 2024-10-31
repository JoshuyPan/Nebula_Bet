import { setBet } from "../store/betting_store"

export const loadBet = async (dispatch) => {
    let packageString = "bet 1 started";
    dispatch(setBet(packageString.toString()))

return packageString;
}