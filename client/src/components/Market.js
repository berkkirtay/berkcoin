import { useState, useEffect } from "react";
import React from 'react';
import { Order } from "./Order";
import { useNavigate } from "react-router-dom";

const Trade = ({ orders, balance }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/wallet');
    }, [])

    if (orders === undefined) {
        navigate('/wallet');
        return (<div></div>);
    }
    return (
        <div id="trade">
            <h2>Orders</h2>
            <div id="trade-child">
                <h3>Bids:</h3>
                <ul>
                    {orders.slice(0).reverse().filter(orders => orders.orderType === "buy").map((order) => (
                        <Order order={order} />
                    ))}
                </ul>
            </div>
            <div id="trade-child">
                <h3>Offers:</h3>
                <ul>
                    {orders.slice(0).reverse().filter(orders => orders.orderType === "sell").map((order) => (
                        <Order order={order} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Trade