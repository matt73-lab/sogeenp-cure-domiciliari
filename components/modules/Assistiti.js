// data/assistiti.js - Database struttura per fascicoli sanitari domiciliari

// Struttura dati per un assistito completo
export const assistitoTemplate = {
  id: null,
  
  // Dati anagrafici
  nome: "",
  cognome: "",
  codiceFiscale: "",
  dataNascita: "",
  luogoNascita: "",
  indirizzo: "",
  telefono: "",
  
  // Caregiver
  caregiver: {
    nome: "",
    parentela: "",
    telefono: "",
    email: "",
    presente24h: false,
    orariDisponibilita: ""
  },

  // Cure domiciliari
  dataInizioCure: "",
  dataChiusura: null,
  motivazioneChiusura: null,
  statoAttivo: true,

  // Operatori di riferimento
  operatori: [
    // {
    //   nome: "",
    //   ruolo: "",
    //   telefono: ""
    // }
  ],

  // Diagnosi
  diagnosi: {
    principale: "",
    secondarie: [],
    codiciICD: []
  },

  // Elementi di rischio
  rischi: [
    // {
    //   tipo: "", // "Allergia", "Caduta", "Altro"
    //   descrizione: "",
    //   livello: "", // "Alto", "Medio", "Basso"
    //   dataRilevazione: ""
    // }
  ],

  // Consenso informato
  consensoInformato: {
    firmato: false,
    dataFirma: "",
    tipologie: []
  },

  // Strumenti di valutazione
  valutazioni: [
    // {
    //   strumento: "",
    //   punteggio: null,
    //   data: "",
    //   valutatore: ""
    // }
  ],

  // Piano di trattamento
  pianoTrattamento: {
    obiettivi: [],
    interventi: [
      // {
      //   descrizione: "",
      //   frequenza: "",
      //   responsabile: ""
      // }
    ],
    aggiornamenti: [
      // {
      //   data: "",
      //   descrizione: "",
      //   responsabile: ""
      // }
    ]
  },

  // Prestazioni erogate
  prestazioni: [
    // {
    //   data: "",
    //   tipo: "",
    //   operatore: "",
    //   esito: "",
    //   durata: ""
    // }
  ],

  // Ausili e presidi
  ausili: [
    // {
    //   tipo: "",
    //   fornitore: "",
    //   dataConsegna: "",
    //   statoFunzionamento: ""
    // }
  ],

  // Verifiche
  verifiche: [
    // {
    //   data: "",
    //   tipo: "",
    //   esito: "",
    //   prossima: ""
    // }
  ],

  // Risultati raggiunti
  risultati: [
    // {
    //   obiettivo: "",
    //   raggiunto: false,
    //   note: "",
    //   dataRaggiungimento: ""
    // }
  ]
};

// Database iniziale vuoto
export const assistiti = [];

// Funzioni helper
export const getAssistitoById = (id) => {
  return assistiti.find(assistito => assistito.id === parseInt(id));
};

export const getAssistitiAttivi = () => {
  return assistiti.filter(assistito => assistito.statoAttivo);
};

export const addAssistito = (nuovoAssistito) => {
  const id = assistiti.length > 0 ? Math.max(...assistiti.map(a => a.id)) + 1 : 1;
  const assistitoCompleto = {
    ...assistitoTemplate,
    ...nuovoAssistito,
    id: id
  };
  assistiti.push(assistitoCompleto);
  return assistitoCompleto;
};

export const updateAssistito = (id, datiAggiornati) => {
  const index = assistiti.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    assistiti[index] = { ...assistiti[index], ...datiAggiornati };
    return assistiti[index];
  }
  return null;
};

export const deleteAssistito = (id) => {
  const index = assistiti.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    return assistiti.splice(index, 1)[0];
  }
  return null;
};
