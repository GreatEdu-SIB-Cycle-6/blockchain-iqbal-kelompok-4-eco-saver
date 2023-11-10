import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThirdwebProvider
    activeChain="binance-testnet"
    desiredChainId={ChainId.BinanceSmartChainTestnet}
    clientId="4a2a27a5009f2d0594836ea88b8d3bf2"
  >
    <Router>
      <App />
    </Router>
  </ThirdwebProvider>
);
