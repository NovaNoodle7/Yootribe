import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Routes from './routes/routes';

import AppProvider from './context/AppContext.js';
import ModalProvider from './context/ModalContext.js';
import ToastProvider from './context/ToastContext.js';

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <AppProvider>
          <ToastProvider>
            <ModalProvider>
              <Routes />
            </ModalProvider>
          </ToastProvider>
        </AppProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
