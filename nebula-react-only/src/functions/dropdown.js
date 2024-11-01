import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loadPackagesDevnet, loadPackagesMainnet, loadPackagesTestnet } from "./package_select";

const DropTab = () => {
    const dispatch = useDispatch();
    const [selectedNetwork, setSelectedNetwork] = useState(null);

    const selectDevnet = async () => {
        await loadPackagesDevnet(dispatch);
        setSelectedNetwork('devnet');
    };

    const selectMainnet = async () => {
        await loadPackagesMainnet(dispatch);
        setSelectedNetwork('mainnet');
    };

    const selectTestnet = async () => {
        // Adjust this to use a proper testnet loading function if available
        await loadPackagesTestnet(dispatch);
        setSelectedNetwork('testnet');
    };

    const renderToggleText = () => {
        if (!selectedNetwork) {
            return "Choose your package";
        }
        return `${selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Package Selected`;
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {renderToggleText()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={selectDevnet}>- Devnet Package</Dropdown.Item>
                <Dropdown.Item onClick={selectMainnet}>- Mainnet Package</Dropdown.Item>
                <Dropdown.Item onClick={selectTestnet}>- Testnet Package</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropTab;
