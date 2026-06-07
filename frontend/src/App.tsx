import { useState } from 'react';
import ClientesPage from './pages/ClientesPage';
import OrdensServicoPage from './pages/OrdensServicoPage';

function App() {
  const [tab, setTab] = useState<'clientes' | 'ordens'>('clientes');

  return (
    <div className="app-shell">
      <header>
        <h1>ServicePratic</h1>
        <p>Gestão de clientes e ordens de serviço</p>
      </header>
      <nav className="top-nav">
        <button type="button" className={tab === 'clientes' ? 'active' : ''} onClick={() => setTab('clientes')}>
          Clientes
        </button>
        <button type="button" className={tab === 'ordens' ? 'active' : ''} onClick={() => setTab('ordens')}>
          Ordens de Serviço
        </button>
      </nav>
      <main>{tab === 'clientes' ? <ClientesPage /> : <OrdensServicoPage />}</main>
    </div>
  );
}

export default App;
