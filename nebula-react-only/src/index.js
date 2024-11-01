import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// react-redux store components
import { store } from './store/store';
import { Provider } from 'react-redux';

// Import the SuiNetwork component
import SuiNetwork from './networkConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SuiNetwork>
          <App /> {/* App component now rendered within SuiNetwork */}
        </SuiNetwork>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
