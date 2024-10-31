import { setAccount } from "../store/betting_store"

export const loadAccount = async (account ,dispatch) => {
    // the betting function here.
    const address = account.address;
    dispatch(setAccount(address))

return address;
}