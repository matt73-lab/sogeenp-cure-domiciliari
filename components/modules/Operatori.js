// components/modules/Operatori.js - Versione avanzata con gestione fascicoli
import { useState } from 'react';
import { operatori, getOperatoriByRuolo, getDocumentiInScadenza } from '../../data/operatori';
import Button from '../ui/Button';

export default function Operatori() {
  const [selectedOperatore, setSelectedOperatore] = useState(null);
  const [showDettagli, setShowDettagli] = useState(false);
  const [showFascicolo, setShowFascicolo] = useState(false);
  const [filtroRuolo, setFiltroRuolo] = useState('Tutti');
  const [documentiInScadenza] = useState(getDocumentiInScadenza(30));

  const handleViewDettagli = (operatore) => {
    setSelectedOperatore(operatore);
    setShowDettagli(true);
    setShowFascicolo(false);
  };

  const handleViewFascicolo = (operatore) => {
    setSelectedOperatore(operatore);
    setShowFascicolo(true);
    setShowDettagli(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non specificato';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getStatoDocumento = (dataScadenza) => {
    if (!dataScadenza) return { stato: 'Da verificare', color: 'bg-gray-100 text-gray-800' };
    
    const oggi = new Date();
    const scadenza = new Date(dataScadenza);
    const giorniAllaScadenza = Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
    
    if (giorniAllaScadenza < 0) return { stato: 'Scaduto', color: 'bg-red-100 text-red-800' };
    if (giorniAllaScadenza <= 30) return { stato: 'In scadenza', color: 'bg-yellow-100 text-yellow-800' };
    return { stato: 'Valido', color: 'bg-green-100 text-green-800' };
  };

  const operatoriFiltrati = filtroRuolo === 'Tutti' 
    ? operatori 
    : getOperatoriByRuolo(filtroRuolo);

  const ruoli = ['Tutti', 'Medico', 'Infermiere', 'Fisioterapista', 'OSS', 'Direttore'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Operatori</h1>
          <p className="text-gray-600 mt-1">
            {operatori.filter(o => o.stato === 'Attivo').length} operatori attivi
          </p>
        </div>
        <Button icon="➕" variant="primary">
          Nuovo Operatore
        </Button>
      </div>

      {/* Alert documenti in scadenza */}
      {documentiInScadenza.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">
                Documenti in scadenza ({documentiInScadenza.length})
              </h3>
              <div className="text-red-700 text-sm mt-1">
                {documentiInScadenza.slice(0, 3).map((doc, index) => (
                  <div key={index}>
                    {doc.operatore} - {doc.documento} (scade il {formatDate(doc.dataScadenza)})
                  </div>
                ))}
                {documentiInScadenza.length > 3 && (
                  <div className="text-red-600 font-medium">
                    + altri {documentiInScadenza.length - 3} documenti
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Filtra per ruolo:</span>
          {ruoli.map((ruolo) => (
            <Button
              key={ruolo}
              variant={filtroRuolo === ruolo ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFiltroRuolo(ruolo)}
            >
              {ruolo} {ruolo === 'Tutti' ? `(${operatori.length})` : `(${getOperatoriByRuolo(ruolo).length})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{operatori.length}</div>
          <div className="text-sm text-blue-700">Operatori Totali</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {operatori.reduce((sum, op) => sum + op.assistitiInCarico, 0)}
          </div>
          <div className="text-sm text-green-700">Assistiti in Carico</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {operatori.filter(o => o.ruolo.includes('Medico')).length}
          </div>
          <div className="text-sm text-purple-700">Medici</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {operatori.filter(o => o.ruolo.includes('Infermier')).length}
          </div>
          <div className="text-sm text-orange-700">Infermieri</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{documentiInScadenza.length}</div>
          <div className="text-sm text-red-700">Documenti in Scadenza</div>
        </div>
      </div>

      {/* Lista Operatori */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {operatoriFiltrati.map((operatore) => {
          // Calcola stato fascicolo
          const fascicolo = operatore.fascicolo;
          const documentiScaduti = [
            getStatoDocumento(fascicolo.idoneitaPsicoFisica.dataScadenza),
            getStatoDocumento(fascicolo.formazioneSicurezza.dataScadenza),
            getStatoDocumento(fascicolo.blsd.dataScadenza),
            getStatoDocumento(fascicolo.patente.dataScadenza)
          ].filter(doc => doc.stato === 'Scaduto').length;

          const documentiInScadenzaOp = [
            getStatoDocumento(fascicolo.idoneitaPsicoFisica.dataScadenza),
            getStatoDocumento(fascicolo.formazioneSicurezza.dataScadenza),
            getStatoDocumento(fascicolo.blsd.dataScadenza),
            getStatoDocumento(fascicolo.patente.dataScadenza)
          ].filter(doc => doc.stato === 'In scadenza').length;

          return (
            <div key={operatore.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Header della card */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {operatore.nome} {operatore.cognome}
                    </h3>
                    <p className="text-blue-600 font-medium">{operatore.ruolo}</p>
                    {operatore.livello && (
                      <p className="text-sm text-gray-500">({operatore.livello})</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium text-center">
                      {operatore.stato}
                    </div>
                    {(documentiScaduti > 0 || documentiInScadenzaOp > 0) && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
                        documentiScaduti > 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {documentiScaduti > 0 ? '⚠️ Scaduti' : '📅 In scadenza'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informazioni principali */}
              <div className="p-4 space-y-3">
                {operatore.assistitiInCarico > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assistiti in carico:</span>
                    <span className="font-medium">{operatore.assistitiInCarico}</span>
                  </div>
                )}
                
                <div className="text-sm">
                  <span className="text-gray-500">Competenze principali:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {operatore.competenze.slice(0, 2).map((competenza, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {competenza}
                      </span>
                    ))}
                    {operatore.competenze.length > 2 && (
                      <span className="text-xs text-gray-500">+{operatore.competenze.length - 2}</span>
                    )}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500">Orari di servizio:</span>
                  <p className="font-medium text-xs">{operatore.orariServizio || 'Da definire'}</p>
                </div>

                {/* Stato fascicolo */}
                <div className="text-sm">
                  <span className="text-gray-500">Stato fascicolo:</span>
                  <div className="flex space-x-1 mt-1">
                    {documentiScaduti > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {documentiScaduti} scaduti
                      </span>
                    )}
                    {documentiInScadenzaOp > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        {documentiInScadenzaOp} in scadenza
                      </span>
                    )}
                    {documentiScaduti === 0 && documentiInScadenzaOp === 0 && (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        Da completare
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Azioni */}
              <div className="p-4 border-t bg-gray-50 flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon="👤"
                  onClick={() => handleViewDettagli(operatore)}
                  className="flex-1"
                >
                  Dettagli
                </Button>
                <Button
                  variant={documentiScaduti > 0 ? 'danger' : documentiInScadenzaOp > 0 ? 'warning' : 'secondary'}
                  size="sm"
                  icon="📋"
                  onClick={() => handleViewFascicolo(operatore)}
                  className="flex-1"
                >
                  Fascicolo
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dettagli Operatore */}
      {showDettagli && selectedOperatore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Dettagli Operatore - {selectedOperatore.nome} {selectedOperatore.cognome}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDettagli(false)}
                icon="✕"
              >
                Chiudi
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informazioni personali */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-blue-800">👤 Informazioni Personali</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nome completo:</span>
                    <p className="font-medium">{selectedOperatore.nome} {selectedOperatore.cognome}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ruolo:</span>
                    <p className="font-medium">{selectedOperatore.ruolo}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Livello:</span>
                    <p className="font-medium">{selectedOperatore.livello || 'Dipendente'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Stato:</span>
                    <p className="font-medium">{selectedOperatore.stato}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefono:</span>
                    <p className="font-medium">{selectedOperatore.telefono || 'Da inserire'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedOperatore.email || 'Da inserire'}</p>
                  </div>
                </div>
              </div>

              {/* Competenze */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-green-800">🎓 Competenze e Specializzazioni</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-green-700 font-medium">Competenze:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOperatore.competenze.map((competenza, index) => (
                        <span key={index} className="bg-white border border-green-200 px-2 py-1 rounded text-sm">
                          {competenza}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedOperatore.specializzazioni.length > 0 && (
                    <div>
                      <span className="text-gray-500 text-sm">Data scadenza:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.blsd.dataScadenza)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Livello:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.blsd.livello || 'Da inserire'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Ente formatore:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.blsd.ente || 'Da inserire'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedOperatore.fascicolo.blsd.stato === 'Non richiesto' 
                        ? 'bg-gray-100 text-gray-600' 
                        : getStatoDocumento(selectedOperatore.fascicolo.blsd.dataScadenza).color
                    }`}>
                      {selectedOperatore.fascicolo.blsd.stato === 'Non richiesto' ? 'Non richiesto' : getStatoDocumento(selectedOperatore.fascicolo.blsd.dataScadenza).stato}
                    </span>
                    {selectedOperatore.fascicolo.blsd.stato !== 'Non richiesto' && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" icon="📁">
                          {selectedOperatore.fascicolo.blsd.file ? 'Visualizza' : 'Carica'}
                        </Button>
                        <Button size="sm" variant="secondary" icon="✏️">
                          Aggiorna
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Procedure Interne */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">📋 Formazione Procedure Interne</h3>
                <div className="space-y-3">
                  {selectedOperatore.fascicolo.procedureInterne.length > 0 ? (
                    selectedOperatore.fascicolo.procedureInterne.map((procedura, index) => (
                      <div key={index} className="bg-white p-4 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{procedura.procedura}</p>
                            <p className="text-sm text-gray-600">Formatore: {procedura.formatore}</p>
                            <p className="text-sm text-gray-600">
                              Data: {formatDate(procedura.dataFormazione)} - Ore: {procedura.ore}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" icon="📁">
                            {procedura.file ? 'Visualizza' : 'Carica'}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-4 rounded border text-center text-gray-500">
                      <p>Nessuna formazione su procedure interne registrata</p>
                      <Button size="sm" variant="primary" icon="➕" className="mt-2">
                        Aggiungi Formazione
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Patente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🚗 Patente di Guida</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Numero patente:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.patente.numero || 'Da inserire'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Categoria:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.patente.categoria || 'Da inserire'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Data rilascio:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.patente.dataRilascio)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Data scadenza:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.patente.dataScadenza)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatoDocumento(selectedOperatore.fascicolo.patente.dataScadenza).color}`}>
                      {getStatoDocumento(selectedOperatore.fascicolo.patente.dataScadenza).stato}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon="📁">
                        {selectedOperatore.fascicolo.patente.file ? 'Visualizza' : 'Carica'}
                      </Button>
                      <Button size="sm" variant="secondary" icon="✏️">
                        Aggiorna
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Azioni Fascicolo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-800">Azioni Fascicolo</h3>
                    <p className="text-blue-700 text-sm">Gestione documenti e compliance</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="primary" icon="📥">
                      Esporta Fascicolo PDF
                    </Button>
                    <Button variant="secondary" icon="🔄">
                      Aggiorna Scadenze
                    </Button>
                    <Button variant="outline" icon="📧">
                      Notifica Scadenze
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}text-green-700 font-medium">Specializzazioni:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedOperatore.specializzazioni.map((spec, index) => (
                          <span key={index} className="bg-white border border-green-200 px-2 py-1 rounded text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Servizio */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-purple-800">💼 Informazioni di Servizio</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Data assunzione:</span>
                    <p className="font-medium">{formatDate(selectedOperatore.dataAssunzione)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Orari di servizio:</span>
                    <p className="font-medium">{selectedOperatore.orariServizio}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Assistiti in carico:</span>
                    <p className="font-medium">{selectedOperatore.assistitiInCarico} pazienti</p>
                  </div>
                </div>
              </div>

              {/* Azioni */}
              <div className="flex space-x-3">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    setShowDettagli(false);
                    handleViewFascicolo(selectedOperatore);
                  }}
                >
                  Visualizza Fascicolo
                </Button>
                <Button variant="secondary" className="flex-1">
                  Modifica Dati
                </Button>
                <Button variant="outline" className="flex-1">
                  Storico Prestazioni
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fascicolo Operatore */}
      {showFascicolo && selectedOperatore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Fascicolo Operatore - {selectedOperatore.nome} {selectedOperatore.cognome}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowFascicolo(false)}
                icon="✕"
              >
                Chiudi
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Info Privacy */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3">🔒</div>
                  <div>
                    <h3 className="text-blue-800 font-medium">Fascicolo Personale - Privacy</h3>
                    <p className="text-blue-700 text-sm">
                      Conservato nel rispetto della normativa sul trattamento dei dati personali (Art. 3.1.4.5)
                    </p>
                  </div>
                </div>
              </div>

              {/* Curriculum Formativo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">📚 Curriculum Formativo</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Curriculum e documentazione formativa</p>
                      <p className="text-sm text-gray-600">
                        Ultimo aggiornamento: {formatDate(selectedOperatore.fascicolo.curriculumFormativo.dataAggiornamento)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon="📁">
                        {selectedOperatore.fascicolo.curriculumFormativo.file ? 'Visualizza' : 'Carica'}
                      </Button>
                      <Button size="sm" variant="secondary" icon="✏️">
                        Aggiorna
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formazione Continua */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🎓 Formazione Continua Obbligatoria</h3>
                <div className="space-y-3">
                  {selectedOperatore.fascicolo.formazioneContinua.length > 0 ? (
                    selectedOperatore.fascicolo.formazioneContinua.map((formazione, index) => (
                      <div key={index} className="bg-white p-4 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{formazione.tipologia}</p>
                            <p className="text-sm text-gray-600">Ente: {formazione.ente}</p>
                            <p className="text-sm text-gray-600">
                              Conseguimento: {formatDate(formazione.dataConseguimento)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatoDocumento(formazione.dataScadenza).color}`}>
                              {getStatoDocumento(formazione.dataScadenza).stato}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Scade: {formatDate(formazione.dataScadenza)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-4 rounded border text-center text-gray-500">
                      <p>Nessuna formazione registrata</p>
                      <Button size="sm" variant="primary" icon="➕" className="mt-2">
                        Aggiungi Formazione
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Idoneità Psico-Fisica */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🏥 Idoneità Psico-Fisica</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Data visita:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.idoneitaPsicoFisica.dataVisita)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Data scadenza:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.idoneitaPsicoFisica.dataScadenza)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Medico competente:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.idoneitaPsicoFisica.medicoCompetente || 'Da inserire'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Esito:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.idoneitaPsicoFisica.esito || 'Da inserire'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatoDocumento(selectedOperatore.fascicolo.idoneitaPsicoFisica.dataScadenza).color}`}>
                      {getStatoDocumento(selectedOperatore.fascicolo.idoneitaPsicoFisica.dataScadenza).stato}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon="📁">
                        {selectedOperatore.fascicolo.idoneitaPsicoFisica.file ? 'Visualizza' : 'Carica'}
                      </Button>
                      <Button size="sm" variant="secondary" icon="✏️">
                        Aggiorna
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formazione Sicurezza */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🦺 Formazione Sicurezza sul Lavoro</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Data conseguimento:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.formazioneSicurezza.dataConseguimento)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Data scadenza:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.formazioneSicurezza.dataScadenza)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Ore formazione:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.formazioneSicurezza.ore || 'Da inserire'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Ente formatore:</span>
                      <p className="font-medium">{selectedOperatore.fascicolo.formazioneSicurezza.ente || 'Da inserire'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatoDocumento(selectedOperatore.fascicolo.formazioneSicurezza.dataScadenza).color}`}>
                      {getStatoDocumento(selectedOperatore.fascicolo.formazioneSicurezza.dataScadenza).stato}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon="📁">
                        {selectedOperatore.fascicolo.formazioneSicurezza.file ? 'Visualizza' : 'Carica'}
                      </Button>
                      <Button size="sm" variant="secondary" icon="✏️">
                        Aggiorna
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLSD */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🚨 Certificazione BLSD</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Data conseguimento:</span>
                      <p className="font-medium">{formatDate(selectedOperatore.fascicolo.blsd.dataConseguimento)}</p>
                    </div>
                    <div>
                      <span className="
