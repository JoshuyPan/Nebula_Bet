
import { setPackage, setNebulaPolice } from '../store/betting_store';
import { DEVNET_PACKAGE, MAINNET_PACKAGE,
    DEVNET_NEBULA_POLICE, MAINNET_NEBULA_POLICE
 } from "../package_info/packages"

export const loadPackages = async (dispatch) => {
    let packageString = "pass";
    dispatch(setPackage(packageString.toString()))

return packageString;
}

export const loadPackagesDevnet = async (dispatch) => {

    dispatch(setPackage(DEVNET_PACKAGE))
    dispatch(setNebulaPolice(DEVNET_NEBULA_POLICE))

return [DEVNET_PACKAGE, DEVNET_NEBULA_POLICE];
}

export const loadPackagesMainnet = async (dispatch) => {

    dispatch(setPackage(MAINNET_PACKAGE));
    dispatch(setNebulaPolice(MAINNET_NEBULA_POLICE))

return [MAINNET_PACKAGE, MAINNET_NEBULA_POLICE];
}