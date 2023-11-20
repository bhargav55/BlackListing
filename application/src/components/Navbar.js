import React from "react";

function Navbar(props) {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow">
            <button className="btn btn-default" style={{ color: "white" }}>
                Token Purchase
            </button>

            <div style={{ color: "white" }}>{props.account}</div>
        </nav>
    );
}
export default Navbar;
