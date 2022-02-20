import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

const LoadingTriangle = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", margin: "10%" }}>
            <BallTriangle color="#00BFFF" height={200} width={200} />
        </div>
    )
}

export default LoadingTriangle