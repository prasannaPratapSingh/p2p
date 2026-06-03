import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './app/index.css';
import { Provider } from 'react-redux';
import { store } from './app/store/app.store.ts';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>
)
