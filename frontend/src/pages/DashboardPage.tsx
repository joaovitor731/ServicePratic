function DashboardPage() {
  const cards = [
    { title: 'Clientes', value: 'Cadastro e acompanhamento', hint: 'Acesse o módulo para manter sua base organizada.' },
    { title: 'Equipamentos', value: 'Vínculo com clientes', hint: 'Registre aparelhos, máquinas e detalhes técnicos.' },
    { title: 'Ordens de Serviço', value: 'Fluxo operacional', hint: 'Abra, atualize e acompanhe atendimentos.' },
  ];

  const steps = [
    'Cadastre clientes e seus contatos.',
    'Vincule equipamentos a cada cliente.',
    'Abra ordens de serviço e acompanhe o status.',
  ];

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div className="dashboard-card">
          <span className="eyebrow">Visão geral</span>
          <h3>Seu painel central do ServicePratic</h3>
          <p>
            Um espaço rápido para começar o trabalho do dia, acessar os módulos principais e entender o fluxo da operação.
          </p>
        </div>
        <div className="dashboard-panel">
          <strong>Atalho rápido</strong>
          <p>Use o menu lateral para entrar em clientes, equipamentos ou ordens de serviço.</p>
        </div>
      </div>

      <div className="dashboard-cards">
        {cards.map((card) => (
          <article key={card.title} className="stat-card">
            <span className="stat-label">{card.title}</span>
            <h3>{card.value}</h3>
            <p>{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <h3>Fluxo sugerido</h3>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="dashboard-card">
          <h3>Resumo operacional</h3>
          <ul>
            <li>Acompanhe clientes, equipamentos e OS no mesmo lugar.</li>
            <li>Use o histórico para entender mudanças de status.</li>
            <li>Em breve, relatórios e indicadores poderão entrar aqui.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
