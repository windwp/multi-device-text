import React from "react";
import "./shimmer.css";
const Shimmer: React.FC<{ className: string }> = props => {
  return (
    <div className={`shimmer ${props.className}`}>
      <div className="card br">
        <div className="wrapper">
          <div className="comment br animate w80"></div>
          <div className="comment br animate"></div>
          <div className="comment br animate"></div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
