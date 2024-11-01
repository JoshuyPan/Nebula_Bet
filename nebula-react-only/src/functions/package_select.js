
import { setPackage, setNebulaPolice, setNetwork } from '../store/betting_store';
import { DEVNET_PACKAGE, MAINNET_PACKAGE,
    DEVNET_NEBULA_POLICE, MAINNET_NEBULA_POLICE,
    TESTNET_NEBULA_POLICE, TESTNET_PACKAGE
 } from "../package_info/packages"

export const loadPackages = async (dispatch) => {
    let packageString = "pass";
    dispatch(setPackage(packageString.toString()))

return packageString;
}

export const loadPackagesDevnet = async (dispatch) => {
    dispatch(setNetwork("devnet"))
    dispatch(setPackage(DEVNET_PACKAGE))
    dispatch(setNebulaPolice(DEVNET_NEBULA_POLICE))

return [DEVNET_PACKAGE, DEVNET_NEBULA_POLICE];
}

export const loadPackagesMainnet = async (dispatch) => {
    dispatch(setNetwork("mainnet"))
    dispatch(setPackage(MAINNET_PACKAGE));
    dispatch(setNebulaPolice(MAINNET_NEBULA_POLICE))

return [MAINNET_PACKAGE, MAINNET_NEBULA_POLICE];
}

export const loadPackagesTestnet = async (dispatch) => {
    dispatch(setNetwork("testnet"))
    dispatch(setPackage(TESTNET_PACKAGE));
    dispatch(setNebulaPolice(TESTNET_NEBULA_POLICE))

return [TESTNET_PACKAGE, TESTNET_NEBULA_POLICE];
}