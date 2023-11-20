import "./App.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Purchase from "./components/Purchase";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [account, setAccount] = useState("");
    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };

    const loadBlockchainData = async () => {
        const web3 = window.web3;
        // Load account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Network ID
        const networkId = await web3.eth.net.getId();
        if (networkId != 43113) {
            window.alert("Connect to avalanche network");
        }
    };

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    });

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar account={account} />
                <ToastContainer autoClose={5000} />
                <Routes>
                    {/* <Route path="/" render = {(props) => <Purchase account={account} {...props}/>}/>  */}
                    <Route path="/" element={<Purchase account={account} />} />
                    <Route
                        path="/admin"
                        element={<Admin account={account} />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
