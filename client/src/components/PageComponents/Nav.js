import { Link } from 'react-router-dom'
import React from 'react';
const Nav = () => {
    return (
        <div>
            <nav>
                <ul className="nav">
                    <li className="nav"><Link to="/berkcoin/wallet">Wallet</Link></li>
                    <li className="nav"><Link to="/berkcoin/market">Market</Link></li>
                    <li className="nav"><Link to="/berkcoin/trade">Trade</Link></li>
                    <li className="nav"><Link to="/berkcoin/staking">Staking</Link></li>
                </ul>

            </nav>

        </div>
    )
}

export default Nav