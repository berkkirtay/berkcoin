import React from 'react'
export const Header = ({ account, connect }) => {
    return (
        <div className='header'>
            <span style={{ float: "left" }}>Wallet Connection Status: {
                account === undefined ?
                    <span onClick={connect} style={{ color: "red" }}>Not Connected</span> :
                    <span style={{ color: "green" }}>Connected</span>
            }
            </span>
        </div>
    )
}
