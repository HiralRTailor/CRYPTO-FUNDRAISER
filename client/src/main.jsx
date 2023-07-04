import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

//added by Hiral
import { SwitchChainModal } from './components';
import { Sepolia } from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById('root'));

/*commented by Hiral
root.render(
  <ThirdwebProvider desiredChainId={ChainId.Sepolia}> 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)
*/

root.render(
  <ThirdwebProvider activeChain={Sepolia}>
    <Router>
    <StateContextProvider>
      {/*added by Hiral*/}
      <SwitchChainModal />
      <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);