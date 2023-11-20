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
                do {
                    afterUsers = await GetBlackListedUsers();
                } while (
                    afterUsers.length == 0 &&
                    beforeUsers.length == afterUsers.length
                );

                if (Math.abs(afterUsers.length - beforeUsers.length) > 1) {
                    updateBlackListUser(user, afterUsers).then(() => {
                        if ("error") {
                            toast.error("Error ");
                        } else {
                            toast.success("Blacklist updated");
                        }
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
                do {
                    afterUsers = await GetBlackListedUsers();
                } while (beforeUsers.length == afterUsers.length);

                if (Math.abs(afterUsers.length - beforeUsers.length) > 1) {
                    updateBlackListUser(user, afterUsers).then(() => {
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
