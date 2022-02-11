import React from 'react';
export const Order = ({ order }) => {
    return (
        <li id="order" key={order.orderID}>
            {order.orderType === "buy" &&
                <p><span>Amount: {order.amount}</span><span style={{ float: "right", color: "green" }}>Offer: {order.offer}</span></p>
            }
            {order.orderType === "sell" &&
                <p><span>Amount: {order.amount}</span><span style={{ float: "right", color: "red" }}>Offer: {order.offer}</span></p>
            }
        </li>
    )
}
