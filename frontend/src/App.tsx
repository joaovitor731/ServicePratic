import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import EquipamentosPage from './pages/EquipamentosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import ServicosPage from './pages/ServicosPage';

function App() {
  const [tab, setTab] = useState<'dashboard' | 'clientes' | 'equipamentos' | 'servicos' | 'ordens'>('dashboard');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">SP</span>
          <div>
            <h1>ServicePratic</h1>
            <p>Gestão operacional</p>
          </div>
        </div>

        <nav className="side-nav" aria-label="Menu principal">
          <button type="button" className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>
            Dashboard
          </button>
          <button type="button" className={tab === 'clientes' ? 'active' : ''} onClick={() => setTab('clientes')}>
            Clientes
          </button>
          <button type="button" className={tab === 'equipamentos' ? 'active' : ''} onClick={() => setTab('equipamentos')}>
            Equipamentos
          </button>
          <button type="button" className={tab === 'servicos' ? 'active' : ''} onClick={() => setTab('servicos')}>
            Serviços
          </button>
          <button type="button" className={tab === 'ordens' ? 'active' : ''} onClick={() => setTab('ordens')}>
            Ordens de Serviço
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>Foco do dia</span>
          <strong>Fluxo simples e rápido</strong>
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <span className="eyebrow">Painel interno</span>
            <h2>
              {tab === 'dashboard'
                ? 'Dashboard'
                : tab === 'clientes'
                  ? 'Clientes'
                  : tab === 'equipamentos'
                    ? 'Equipamentos'
                    : tab === 'servicos'
                      ? 'Serviços'
                    : 'Ordens de Serviço'}
            </h2>
            <p>Escolha um módulo no menu lateral para seguir com o atendimento.</p>
          </div>
        </header>

        {tab === 'dashboard' ? (
          <DashboardPage />
        ) : tab === 'clientes' ? (
          <ClientesPage />
        ) : tab === 'equipamentos' ? (
          <EquipamentosPage />
        ) : tab === 'servicos' ? (
          <ServicosPage />
        ) : (
          <OrdensServicoPage />
        )}
      </main>
    </div>
  );
}

export default App;
