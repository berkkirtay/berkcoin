import React from 'react'
import { Link } from 'react-router-dom'
export const Footer = ({ account, connect }) => {
    return (
        <div className='footer' style={{ float: "right", }}>
            <span to="/">Wallet Connection Status: {
                account === undefined ?
                    <span onClick={connect} style={{ color: "red" }}>Not Connected</span> :
                    <span style={{ color: "green" }}>Connected</span>
            }
            </span>
        </div>
    )
}
