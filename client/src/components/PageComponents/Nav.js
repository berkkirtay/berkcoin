import { Link } from 'react-router-dom'
import React from 'react';
const Nav = () => {
    return (
        <div>
            <nav>
                <ul className="nav">
                    <li className="nav"><Link to="/wallet">Wallet</Link></li>
                    <li className="nav"><Link to="/market">Market</Link></li>
                    <li className="nav"><Link to="/trade">Trade</Link></li>
                    <li className="nav"><Link to="/staking">Staking</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav