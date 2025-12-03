import './App.css';
import { AppRouter } from './router/AppRouter';

export default function App() {
  return (
    <div data-theme="night" className="app-shell app-bg-cyber cyber-grid text-slate-100">
      <AppRouter />
    </div>
  );
}

