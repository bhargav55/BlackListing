import "../App.css";
import React, { useState } from "react";
import {
    BlackListUser,
    WhiteListUser,
    GetBlackListedUsers,
    updateBlackListUser,
} from "../contractHandlers";
import { toast } from "react-toastify";
import { SpinnerCircular } from "spinners-react";
import { SLIP44_ECDSA_ETH_PATH } from "@hashgraph/sdk";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Admin(props) {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    let user = props.account;
    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);
        let beforeUsers = await GetBlackListedUsers();

        if (event.nativeEvent.submitter.name == "blackList")
            BlackListUser(user, address).then(async () => {
                let afterUsers = beforeUsers;
                let count = 0;
                await sleep(5000);
                do {
                    await sleep(5000);

                    afterUsers = await GetBlackListedUsers();
                    count++;
                    console.log("before users length", beforeUsers.length);
                    console.log("after users length", afterUsers.length);
                    console.log("count:", count);
                } while (
                    afterUsers.length == 0 &&
                    beforeUsers.length == afterUsers.length &&
                    count < 5
                );
                console.log("before users length", beforeUsers.length);
                console.log("after users length", afterUsers.length);
                console.log("count:", count);

                if (Math.abs(afterUsers.length - beforeUsers.length) > 1) {
                    updateBlackListUser(user, afterUsers, true).then(() => {
                        toast.success("Blacklist updated");
                        setLoading(false);
                    });
                } else {
                    toast.success("Blacklist updated");
                    setLoading(false);
                }
            });
        else
            WhiteListUser(user, address).then(async () => {
                let afterUsers = beforeUsers;
                let count = 0;
                await sleep(5000);

                do {
                    await sleep(5000);
                    afterUsers = await GetBlackListedUsers();
                    count++;
                    console.log("before users length", beforeUsers.length);
                    console.log("after users length", afterUsers.length);
                    console.log("count:", count);
                } while (beforeUsers.length == afterUsers.length && count < 5);
                console.log("before users length", beforeUsers.length);
                console.log("after users length", afterUsers.length);
                console.log("count:", count);

                if (Math.abs(afterUsers.length - beforeUsers.length) > 1) {
                    let finalUsers = [];
                    for (let i = 0; i < beforeUsers.length; i++) {
                        let found = false;
                        for (let j = 0; j < afterUsers.length; j++) {
                            if (afterUsers[j] == beforeUsers[i]) {
                                found = true;
                            }
                        }
                        if (!found) finalUsers.push(beforeUsers[i]);
                    }
                    console.log("finalUsers:", finalUsers);
                    updateBlackListUser(user, finalUsers, false).then(() => {
                        toast.success("Blacklist updated");
                        setLoading(false);
                    });
                } else {
                    toast.success("Blacklist updated");
                    setLoading(false);
                }
            });
    };

    return (
        <div id="centerDivNoBorder">
            {loading ? (
                <SpinnerCircular style={{ color: "#145DA0" }} />
            ) : (
                <div id="centerDiv">
                    <form
                        className="container-fluid mt-5"
                        onSubmit={handleSubmit.bind(this)}
                    >
                        <div className="row">
                            <b className=" form-group col-lg-3 solid ">
                                Blacklist wallet
                            </b>
                        </div>
                        <div className="row">
                            <div className=" form-group col-lg-12">
                                <input
                                    id="Enter"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Address"
                                    value={address}
                                    required
                                    onChange={ev => {
                                        setAddress(ev.target.value);
                                        ev.preventDefault();
                                    }}
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="form-group col-lg-3">
                                <button
                                    className="btn btn-primary btn-block"
                                    name="blackList"
                                >
                                    BlackList
                                </button>
                            </div>
                            <div className="form-group col-lg-5"></div>
                            <div className="form-group col-lg-3">
                                <button
                                    className="btn btn-primary btn-block"
                                    name="whiteList"
                                >
                                    WhiteList
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Admin;
