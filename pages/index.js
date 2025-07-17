// pages/index.js - App Principale SOGEENP
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Icona semplice
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function HomePage() {
  const [operatori, setOperatori] = useState([]);
  const [assistiti, setAssistiti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('⏳ Connessione...');
  
  // Nuovo assistito form
  const [showForm, setShowForm] = useState(false);
  const [newAssistito, setNewAssistito] = useState({
    nome: '',
    cognome: '',
    codice_fiscale: '',
    telefono_principale: ''
  });

  // Test connessione e caricamento dati
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('🔄 Testando connessione Supabase...');
      
      // Test connessione caricando operatori
      const { data: operatoriData, error: operatoriError } = await supabase
        .from('operatori')
        .select('*')
        .order('level', { ascending: false });
      
      if (operatoriError) throw operatoriError;
      
      setOperatori(operatoriData || []);
      setConnectionStatus('✅ Connesso a Supabase!');
      
      // Carica assistiti
      const { data: assistitiData, error: assistitiError } = await supabase
        .from('assistiti')
        .select('*')
        .order('cognome', { ascending: true });
      
      if (assistitiError) throw assistitiError;
      setAssistiti(assistitiData || []);
      
      console.log('✅ Dati caricati:', {
        operatori: operatoriData?.length || 0,
        assistiti: assistitiData?.length || 0
      });
      
    } catch (error) {
      console.error('❌ Errore connessione:', error);
      setConnectionStatus('❌ Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssistito = async (e) => {
    e.preventDefault();
    
    if (!newAssistito.nome || !newAssistito.cognome || !newAssistito.codice_fiscale) {
      alert('Nome, Cognome e Codice Fiscale sono obbligatori');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('assistiti')
        .insert([{
          nome: newAssistito.nome,
          cognome: newAssistito.cognome,
          codice_fiscale: newAssistito.codice_fiscale.toUpperCase(),
          telefono_principale: newAssistito.telefono_principale,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setAssistiti(prev => [...prev, data]);
      setNewAssistito({ nome: '', cognome: '', codice_fiscale: '', telefono_principale: '' });
      setShowForm(false);
      alert('✅ Assistito aggiunto con successo! I dati sono salvati permanentemente.');
      
    } catch (error) {
      console.error('❌ Errore aggiunta assistito:', error);
      alert('❌ Errore: ' + error.message);
    }
  };

  const handleDeleteAssistito = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo assistito?')) return;

    try {
      const { error } = await supabase
        .from('assistiti')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAssistiti(prev => prev.filter(a => a.id !== id));
      alert('✅ Assistito eliminato');
      
    } catch (error) {
      console.error('❌ Errore eliminazione:', error);
      alert('❌ Errore: ' + error.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '20px', 
          padding: '30px', 
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            🏥 Centrale Operativa SOGEENP
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem', 
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Sistema Gestione Cure Domiciliari - Versione 1.0
          </p>
          
          {/* Status connessione */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '15px', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>
              {connectionStatus}
            </p>
            {!loading && (
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                Database attivo • Operatori: {operatori.length} • Assistiti: {assistiti.length}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Caricamento dati...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            
            {/* Sezione Operatori */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '20px', 
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserIcon />
                Operatori SOGEENP ({operatori.length})
              </h2>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {operatori.map(operatore => (
                  <div key={operatore.id} style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '10px', 
                    padding: '15px', 
                    marginBottom: '10px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                          {operatore.nome} {operatore.cognome}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>
                          {operatore.qualifica} • {operatore.codice_operatore}
                        </p>
                      </div>
                      <div style={{ 
                        background: operatore.level >= 4 ? '#10B981' : operatore.level >= 2 ? '#3B82F6' : '#6B7280',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        L{operatore.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sezione Assistiti */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '20px', 
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  👥 Assistiti ({assistiti.length})
                </h2>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  style={{
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  + Aggiungi
                </button>
              </div>

              {/* Form nuovo assistito */}
              {showForm && (
                <form onSubmit={handleAddAssistito} style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  marginBottom: '20px' 
                }}>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input
                      type="text"
                      placeholder="Nome *"
                      value={newAssistito.nome}
                      onChange={(e) => setNewAssistito(prev => ({ ...prev, nome: e.target.value }))}
                      required
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Cognome *"
                      value={newAssistito.cognome}
                      onChange={(e) => setNewAssistito(prev => ({ ...prev, cognome: e.target.value }))}
                      required
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Codice Fiscale *"
                      value={newAssistito.codice_fiscale}
                      onChange={(e) => setNewAssistito(prev => ({ ...prev, codice_fiscale: e.target.value }))}
                      required
                      maxLength="16"
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Telefono"
                      value={newAssistito.telefono_principale}
                      onChange={(e) => setNewAssistito(prev => ({ ...prev, telefono_principale: e.target.value }))}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" style={{
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        flex: 1
                      }}>
                        ✅ Salva
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} style={{
                        background: '#6B7280',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        flex: 1
                      }}>
                        Annulla
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Lista assistiti */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {assistiti.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'rgba(255,255,255,0.7)', 
                    padding: '40px 20px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '10px'
                  }}>
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>Nessun assistito presente</p>
                    <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>Clicca "Aggiungi" per inserire il primo assistito</p>
                  </div>
                ) : (
                  assistiti.map(assistito => (
                    <div key={assistito.id} style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '10px', 
                      padding: '15px', 
                      marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                            {assistito.nome} {assistito.cognome}
                          </h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>
                            CF: {assistito.codice_fiscale}
                          </p>
                          {assistito.telefono_principale && (
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0', fontSize: '0.8rem' }}>
                              📞 {assistito.telefono_principale}
                            </p>
                          )}
                          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', fontSize: '0.7rem' }}>
                            Inserito: {new Date(assistito.created_at).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteAssistito(assistito.id)}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.9rem'
        }}>
          <p>🚀 Piattaforma sviluppata con Context Engineering</p>
          <p>💾 Dati persistenti su Supabase • 🌐 Deploy automatico Vercel • 📱 Mobile ready</p>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        
        button:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
