import { createRoot } from 'react-dom/client';
import App from './components/App';

// NOTE: upgrading to avoid using ReactDOM which is deprecated

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
