// pages/index.js - Dashboard Principale SOGEENP
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// === ICONE MODULI ===
const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const FileTextIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const HeartIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
  </svg>
);

const BookOpenIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const StethoscopeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
  </svg>
);

const FolderIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
  </svg>
);

const GraduationCapIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const ShieldAlertIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
  </svg>
);

// === COMPONENTE CARD MODULO ===
const ModuleCard = ({ title, description, icon, count, status, color, onClick, disabled = false }) => {
  const cardStyle = {
    background: disabled ? 'rgba(100, 100, 100, 0.1)' : 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '25px',
    border: disabled ? '1px solid rgba(100, 100, 100, 0.2)' : '1px solid rgba(255,255,255,0.2)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1
  };

  const hoverStyle = !disabled ? {
    transform: 'translateY(-5px)',
    background: 'rgba(255,255,255,0.15)'
  } : {};

  return (
    <div 
      style={cardStyle}
      onClick={!disabled ? onClick : null}
      onMouseEnter={(e) => !disabled && Object.assign(e.target.style, hoverStyle)}
      onMouseLeave={(e) => !disabled && Object.assign(e.target.style, cardStyle)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          background: `${color}20`, 
          borderRadius: '15px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </div>
        {count !== undefined && (
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: color
          }}>
            {count}
          </div>
        )}
      </div>
      
      <h3 style={{ 
        color: 'white', 
        fontSize: '1.3rem', 
        fontWeight: 'bold', 
        marginBottom: '8px' 
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: '0.9rem', 
        marginBottom: '12px',
        lineHeight: '1.4'
      }}>
        {description}
      </p>
      
      {status && (
        <div style={{ 
          display: 'inline-block',
          background: disabled ? '#6B7280' : status === 'Attivo' ? '#10B981' : '#F59E0B',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {disabled ? 'Prossimamente' : status}
        </div>
      )}
    </div>
  );
};

// === COMPONENTE PRINCIPALE ===
export default function Dashboard() {
  const [stats, setStats] = useState({
    operatori: 0,
    assistiti: 0,
    fascicoli: 0,
    accessi: 0,
    documenti: 0
  });
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('⏳ Caricamento...');

  // === CARICAMENTO DATI ===
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setConnectionStatus('🔄 Caricamento statistiche...');

      // Carica conteggi da tutte le tabelle
      const [operatoriRes, assistitiRes, fascicoliRes, accessiRes] = await Promise.all([
        supabase.from('operatori').select('id', { count: 'exact' }),
        supabase.from('assistiti').select('id', { count: 'exact' }),
        supabase.from('fascicoli_sanitari_domiciliari').select('id', { count: 'exact' }),
        supabase.from('accessi_domiciliari').select('id', { count: 'exact' })
      ]);

      setStats({
        operatori: operatoriRes.count || 0,
        assistiti: assistitiRes.count || 0,
        fascicoli: fascicoliRes.count || 0,
        accessi: accessiRes.count || 0,
        documenti: 0 // TODO: implementare tabella documenti
      });

      setConnectionStatus('✅ Dashboard aggiornata');
    } catch (error) {
      console.error('❌ Errore caricamento dashboard:', error);
      setConnectionStatus('❌ Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // === NAVIGAZIONE MODULI ===
  const handleModuleClick = (moduleId) => {
    alert(`🚧 Modulo "${moduleId}" in sviluppo.\nProssimamente implementeremo la navigazione completa!`);
    // TODO: Implementare routing tra moduli
  };

  // === DEFINIZIONE MODULI ===
  const modules = [
    {
      id: 'assistiti',
      title: 'Assistiti',
      description: 'Gestione anagrafica e stato assistiti in carico alla centrale operativa.',
      icon: <UserIcon />,
      count: stats.assistiti,
      status: 'Attivo',
      color: '#3B82F6',
      disabled: false
    },
    {
      id: 'fascicolo',
      title: 'Fascicolo Sanitario',
      description: 'Fascicoli sanitari domiciliari completi con valutazioni e piani di cura.',
      icon: <FileTextIcon />,
      count: stats.fascicoli,
      status: 'Attivo',
      color: '#10B981',
      disabled: false
    },
    {
      id: 'diario',
      title: 'Diario Assistenziale', 
      description: 'Registrazione accessi domiciliari con firme digitali e parametri vitali.',
      icon: <BookOpenIcon />,
      count: stats.accessi,
      status: 'Attivo',
      color: '#F59E0B',
      disabled: false
    },
    {
      id: 'operatori',
      title: 'Operatori',
      description: 'Gestione équipe operatori con fascicoli personali e formazione ECM.',
      icon: <StethoscopeIcon />,
      count: stats.operatori,
      status: 'Attivo',
      color: '#8B5CF6',
      disabled: false
    },
    {
      id: 'documentazione',
      title: 'Documentazione',
      description: 'Repository procedure, linee guida e protocolli con storage file integrato.',
      icon: <FolderIcon />,
      count: stats.documenti,
      status: 'In Sviluppo',
      color: '#EF4444',
      disabled: true
    },
    {
      id: 'formazione',
      title: 'Formazione',
      description: 'Sistema formazione automatizzato con test AI generati dai documenti.',
      icon: <GraduationCapIcon />,
      count: 0,
      status: 'In Sviluppo',
      color: '#EC4899',
      disabled: true
    },
    {
      id: 'rischio',
      title: 'Rischio Clinico',
      description: 'Gestione eventi avversi, near miss e sistema qualità per compliance.',
      icon: <ShieldAlertIcon />,
      count: 0,
      status: 'In Sviluppo',
      color: '#06B6D4',
      disabled: true
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* === HEADER DASHBOARD === */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '25px', 
          padding: '40px', 
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '15px'
          }}>
            🏥 Centrale Operativa SOGEENP
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.4rem', 
            marginBottom: '25px'
          }}>
            Dashboard Gestione Cure Domiciliari - MVP v1.0
          </p>
          
          {/* Status e KPI rapidi */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '20px', 
            borderRadius: '15px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                {connectionStatus}
              </p>
            </div>
            
            {!loading && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3B82F6', fontSize: '2rem', fontWeight: 'bold' }}>{stats.operatori}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Operatori Attivi</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#10B981', fontSize: '2rem', fontWeight: 'bold' }}>{stats.assistiti}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Assistiti in Carico</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#F59E0B', fontSize: '2rem', fontWeight: 'bold' }}>{stats.fascicoli}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Fascicoli Aperti</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#8B5CF6', fontSize: '2rem', fontWeight: 'bold' }}>{stats.accessi}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Accessi Registrati</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* === GRIGLIA MODULI === */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Caricamento moduli...
          </div>
        ) : (
          <>
            <h2 style={{ 
              color: 'white', 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              📋 Moduli Sistema
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '25px' 
            }}>
              {modules.map(module => (
                <ModuleCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  count={module.count}
                  status={module.status}
                  color={module.color}
                  disabled={module.disabled}
                  onClick={() => handleModuleClick(module.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* === FOOTER TECNICO === */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '50px', 
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.9rem'
        }}>
          <p>🚀 Sviluppato con Context Engineering • React + Supabase + Vercel</p>
          <p>💾 Database persistente • 🔄 Deploy automatico • 📱 Mobile responsive</p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')} • Versione MVP 1.0
          </p>
        </div>
      </div>

      {/* === CSS ANIMATIONS === */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
