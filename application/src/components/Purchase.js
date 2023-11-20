import "../App.css";
import React, { useState, useEffect } from "react";
import { PurchaseToken, getTokenPrice } from "../contractHandlers";
import { toast } from "react-toastify";
import { SpinnerCircular } from "spinners-react";

function Purchase(props) {
    const [buyAmount, setBuyAmount] = useState("");
    const [tokenPrice, setTokenPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);

        let payInEth = buyAmount * tokenPrice;
        PurchaseToken(props.account, buyAmount, payInEth).then(() => {
            toast.success("Successfully purchased");
            setLoading(false);
        });
    };
    useEffect(() => {
        getTokenPrice(props.account).then(price => {
            setTokenPrice(price);
        });
    }, [tokenPrice]);
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
                            <b className=" form-group col-lg-1 solid ">BUY</b>
                            <b className=" form-group col-lg-10 solid ">
                                Token Price: {tokenPrice} AVAX
                            </b>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-10"></div>
                        </div>

                        <div className="row">
                            <div className=" form-group col-lg-8">
                                <input
                                    id="Enter Amount"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Amount to Buy"
                                    value={buyAmount}
                                    required
                                    onChange={ev => {
                                        setBuyAmount(ev.target.value);
                                        ev.preventDefault();
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                >
                                    Purchase
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Purchase;
