// components/modules/FascicoloSanitario.js - Gestione avanzata fascicoli sanitari
import { useState, useEffect } from 'react';
import { assistiti } from '../../data/assistiti';
import Button from '../ui/Button';

export default function FascicoloSanitario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStato, setFiltroStato] = useState('Tutti');
  const [filtroRischio, setFiltroRischio] = useState('Tutti');
  const [sortBy, setSortBy] = useState('nome');
  const [selectedFascicolo, setSelectedFascicolo] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Filtri e ricerca
  const assistitiFiltrati = assistiti
    .filter(assistito => {
      const matchSearch = 
        assistito.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assistito.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assistito.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assistito.diagnosi.principale.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStato = filtroStato === 'Tutti' || 
        (filtroStato === 'Attivi' && assistito.statoAttivo) ||
        (filtroStato === 'Chiusi' && !assistito.statoAttivo);
      
      const rischio = getRiskLevel(assistito);
      const matchRischio = filtroRischio === 'Tutti' || rischio.level === filtroRischio;
      
      return matchSearch && matchStato && matchRischio;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return `${a.nome} ${a.cognome}`.localeCompare(`${b.nome} ${b.cognome}`);
        case 'dataInizio':
          return new Date(b.dataInizioCure) - new Date(a.dataInizioCure);
        case 'rischio':
          const riskA = getRiskLevel(a);
          const riskB = getRiskLevel(b);
          const riskOrder = { 'Alto': 3, 'Medio': 2, 'Basso': 1 };
          return riskOrder[riskB.level] - riskOrder[riskA.level];
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'Non specificato';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getRiskLevel = (assistito) => {
    const highRisks = assistito.rischi?.filter(r => r.livello === 'Alto') || [];
    if (highRisks.length > 0) return { level: 'Alto', color: 'text-red-600 bg-red-100' };
    
    const mediumRisks = assistito.rischi?.filter(r => r.livello === 'Medio') || [];
    if (mediumRisks.length > 0) return { level: 'Medio', color: 'text-yellow-600 bg-yellow-100' };
    
    return { level: 'Basso', color: 'text-green-600 bg-green-100' };
  };

  const getCompletenessScore = (fascicolo) => {
    const campiObbligatori = [
      'nome', 'cognome', 'codiceFiscale', 'dataNascita', 'indirizzo',
      'caregiver.nome', 'caregiver.telefono', 'dataInizioCure',
      'diagnosi.principale', 'consensoInformato.firmato'
    ];
    
    let campiCompilati = 0;
    campiObbligatori.forEach(campo => {
      const valore = campo.includes('.') 
        ? campo.split('.').reduce((obj, key) => obj?.[key], fascicolo)
        : fascicolo[campo];
      if (valore && valore !== '') campiCompilati++;
    });
    
    return Math.round((campiCompilati / campiObbligatori.length) * 100);
  };

  const handleViewFascicolo = (assistito) => {
    setSelectedFascicolo(assistito);
    setShowTimeline(false);
  };

  const handleViewTimeline = (assistito) => {
    setSelectedFascicolo(assistito);
    setShowTimeline(true);
  };

  const generateTimeline = (assistito) => {
    const eventi = [];
    
    // Data inizio cure
    eventi.push({
      data: assistito.dataInizioCure,
      tipo: 'Inizio',
      descrizione: 'Inizio cure domiciliari',
      icon: '🏠',
      color: 'bg-blue-100 text-blue-800'
    });

    // Valutazioni
    assistito.valutazioni?.forEach(val => {
      eventi.push({
        data: val.data,
        tipo: 'Valutazione',
        descrizione: `${val.strumento}: ${val.punteggio}`,
        icon: '📊',
        color: 'bg-purple-100 text-purple-800'
      });
    });

    // Prestazioni recenti
    assistito.prestazioni?.slice(-5).forEach(prest => {
      eventi.push({
        data: prest.data,
        tipo: 'Prestazione',
        descrizione: `${prest.tipo} - ${prest.operatore}`,
        icon: '🩺',
        color: 'bg-green-100 text-green-800'
      });
    });

    // Aggiornamenti piano
    assistito.pianoTrattamento?.aggiornamenti?.forEach(agg => {
      eventi.push({
        data: agg.data,
        tipo: 'Aggiornamento',
        descrizione: agg.descrizione,
        icon: '📝',
        color: 'bg-orange-100 text-orange-800'
      });
    });

    return eventi.sort((a, b) => new Date(b.data) - new Date(a.data));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fascicoli Sanitari Domiciliari</h1>
          <p className="text-gray-600 mt-1">
            Gestione avanzata e compliance normativa
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon="📊" onClick={() => setShowExport(true)}>
            Report Compliance
          </Button>
          <Button variant="primary" icon="➕">
            Nuovo Fascicolo
          </Button>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{assistiti.length}</div>
          <div className="text-sm text-blue-700">Fascicoli Totali</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {assistiti.filter(a => a.statoAttivo).length}
          </div>
          <div className="text-sm text-green-700">Fascicoli Attivi</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {assistiti.filter(a => getRiskLevel(a).level === 'Alto').length}
          </div>
          <div className="text-sm text-red-700">Alto Rischio</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {assistiti.filter(a => getCompletenessScore(a) < 80).length}
          </div>
          <div className="text-sm text-yellow-700">Da Completare</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(assistiti.reduce((sum, a) => sum + getCompletenessScore(a), 0) / assistiti.length)}%
          </div>
          <div className="text-sm text-purple-700">Completezza Media</div>
        </div>
      </div>

      {/* Filtri e Ricerca */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Ricerca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Ricerca
            </label>
            <input
              type="text"
              placeholder="Nome, cognome, CF, diagnosi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro Stato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📋 Stato
            </label>
            <select
              value={filtroStato}
              onChange={(e) => setFiltroStato(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tutti">Tutti</option>
              <option value="Attivi">Attivi</option>
              <option value="Chiusi">Chiusi</option>
            </select>
          </div>

          {/* Filtro Rischio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⚠️ Livello Rischio
            </label>
            <select
              value={filtroRischio}
              onChange={(e) => setFiltroRischio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tutti">Tutti</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Basso">Basso</option>
            </select>
          </div>

          {/* Ordinamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📶 Ordina per
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nome">Nome</option>
              <option value="dataInizio">Data Inizio</option>
              <option value="rischio">Livello Rischio</option>
            </select>
          </div>
        </div>

        {/* Risultati ricerca */}
        <div className="mt-4 text-sm text-gray-600">
          Trovati {assistitiFiltrati.length} fascicoli su {assistiti.length} totali
        </div>
      </div>

      {/* Lista Fascicoli */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paziente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rischio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completezza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Inizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assistitiFiltrati.map((assistito) => {
                const riskLevel = getRiskLevel(assistito);
                const completenessScore = getCompletenessScore(assistito);
                
                return (
                  <tr key={assistito.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assistito.nome} {assistito.cognome}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {assistito.codiceFiscale}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {assistito.diagnosi.principale}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskLevel.color}`}>
                        {riskLevel.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              completenessScore >= 80 ? 'bg-green-600' :
                              completenessScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${completenessScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{completenessScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(assistito.dataInizioCure)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          icon="📋"
                          onClick={() => handleViewFascicolo(assistito)}
                        >
                          Fascicolo
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon="📈"
                          onClick={() => handleViewTimeline(assistito)}
                        >
                          Timeline
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fascicolo Completo */}
      {selectedFascicolo && !showTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Fascicolo Sanitario - {selectedFascicolo.nome} {selectedFascicolo.cognome}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" icon="📄">
                  Esporta PDF
                </Button>
                <Button variant="outline" icon="📧">
                  Invia Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFascicolo(null)}
                  icon="✕"
                >
                  Chiudi
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Completezza fascicolo */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      Completezza Fascicolo: {getCompletenessScore(selectedFascicolo)}%
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Conformità ai requisiti normativi per assistenza domiciliare
                    </p>
                  </div>
                  <div className="w-24 h-24">
                    <div className="relative w-full h-full">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#3b82f6"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${getCompletenessScore(selectedFascicolo) * 2.827} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {getCompletenessScore(selectedFascicolo)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenuto fascicolo (usa il componente esistente) */}
              <div className="space-y-6">
                {/* Dati anagrafici */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">📋 Dati Anagrafici</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nome completo:</span>
                      <p className="font-medium">{selectedFascicolo.nome} {selectedFascicolo.cognome}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Codice Fiscale:</span>
                      <p className="font-medium font-mono">{selectedFascicolo.codiceFiscale}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data di nascita:</span>
                      <p className="font-medium">{formatDate(selectedFascicolo.dataNascita)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Luogo di nascita:</span>
                      <p className="font-medium">{selectedFascicolo.luogoNascita}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Indirizzo:</span>
                      <p className="font-medium">{selectedFascicolo.indirizzo}</p>
                    </div>
                  </div>
                </div>

                {/* Altri sezioni del fascicolo... */}
                {/* (Usa lo stesso contenuto del modal esistente nel modulo Assistiti) */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Timeline */}
      {selectedFascicolo && showTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Timeline - {selectedFascicolo.nome} {selectedFascicolo.cognome}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFascicolo(null)}
                icon="✕"
              >
                Chiudi
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {generateTimeline(selectedFascicolo).map((evento, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== generateTimeline(selectedFascicolo).length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${evento.color}`}>
                              {evento.icon}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {evento.descrizione}
                              </p>
                              <p className="text-sm text-gray-500">{evento.tipo}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(evento.data)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Export Report */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Report Compliance</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="primary" icon="📊" className="h-20 flex-col">
                  <span>Report Completezza</span>
                  <span className="text-xs opacity-75">Fascicoli per compliance</span>
                </Button>
                <Button variant="secondary" icon="⚠️" className="h-20 flex-col">
                  <span>Report Rischi</span>
                  <span className="text-xs opacity-75">Analisi fattori di rischio</span>
                </Button>
                <Button variant="outline" icon="📈" className="h-20 flex-col">
                  <span>Report Statistico</span>
                  <span className="text-xs opacity-75">Dati aggregati e trend</span>
                </Button>
                <Button variant="outline" icon="🏥" className="h-20 flex-col">
                  <span>Report ASL</span>
                  <span className="text-xs opacity-75">Export per enti di controllo</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowExport(false)}>
                Annulla
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
