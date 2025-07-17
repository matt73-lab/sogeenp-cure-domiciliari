// data/assistiti.js - Database simulato per fascicoli sanitari domiciliari

export const assistiti = [
  {
    id: 1,
    // Dati anagrafici
    nome: "Maria",
    cognome: "Bianchi",
    codiceFiscale: "BNCMRA45A01H501K",
    dataNascita: "1945-01-01",
    luogoNascita: "Roma",
    indirizzo: "Via Roma, 123 - Roma",
    telefono: "06-12345678",
    
    // Caregiver
    caregiver: {
      nome: "Giuseppe Bianchi",
      parentela: "Figlio",
      telefono: "339-1234567",
      email: "giuseppe.bianchi@email.com",
      presente24h: false,
      orariDisponibilita: "8:00-20:00"
    },

    // Cure domiciliari
    dataInizioCure: "2024-01-15",
    dataChiusura: null,
    motivazioneChiusura: null,
    statoAttivo: true,

    // Operatori di riferimento
    operatori: [
      {
        nome: "Dr. Mario Rossi",
        ruolo: "Medico di base",
        telefono: "06-98765432"
      },
      {
        nome: "Infermiera Anna Verdi",
        ruolo: "Infermiere domiciliare", 
        telefono: "339-8765432"
      }
    ],

    // Diagnosi
    diagnosi: {
      principale: "Diabete mellito tipo 2 scompensato",
      secondarie: ["Ipertensione arteriosa", "Cardiopatia ischemica"],
      codiciICD: ["E11.9", "I10", "I25.9"]
    },

    // Elementi di rischio
    rischi: [
      {
        tipo: "Allergia",
        descrizione: "Penicillina - reazione cutanea grave",
        livello: "Alto",
        dataRilevazione: "2024-01-15"
      },
      {
        tipo: "Caduta",
        descrizione: "Instabilità motoria, usa deambulatore",
        livello: "Medio",
        dataRilevazione: "2024-02-01"
      }
    ],

    // Consenso informato
    consensoInformato: {
      firmato: true,
      dataFirma: "2024-01-15",
      tipologie: ["Trattamento dati", "Cure domiciliari", "Emergenze"]
    },

    // Strumenti di valutazione
    valutazioni: [
      {
        strumento: "Scala di Barthel",
        punteggio: 65,
        data: "2024-01-15",
        valutatore: "Dr. Mario Rossi"
      },
      {
        strumento: "Mini Mental State",
        punteggio: 24,
        data: "2024-01-20",
        valutatore: "Dr. Mario Rossi"
      }
    ],

    // Piano di trattamento
    pianoTrattamento: {
      obiettivi: [
        "Controllo glicemico",
        "Prevenzione complicanze diabetiche",
        "Mantenimento autonomia"
      ],
      interventi: [
        {
          descrizione: "Controllo glicemia 2 volte/die",
          frequenza: "Quotidiano",
          responsabile: "Caregiver + controllo infermiere"
        },
        {
          descrizione: "Somministrazione insulina",
          frequenza: "2 volte/die",
          responsabile: "Infermiere domiciliare"
        }
      ],
      aggiornamenti: [
        {
          data: "2024-03-01",
          descrizione: "Aggiustamento dosaggio insulina",
          responsabile: "Dr. Mario Rossi"
        }
      ]
    },

    // Prestazioni erogate
    prestazioni: [
      {
        data: "2024-07-15",
        tipo: "Controllo glicemia",
        operatore: "Infermiera Anna Verdi",
        esito: "Glicemia 145 mg/dl - nella norma",
        durata: "30 min"
      },
      {
        data: "2024-07-14",
        tipo: "Somministrazione insulina",
        operatore: "Infermiera Anna Verdi", 
        esito: "Somministrata regolarmente",
        durata: "15 min"
      }
    ],

    // Ausili e presidi
    ausili: [
      {
        tipo: "Deambulatore",
        fornitore: "ASL Roma 1",
        dataConsegna: "2024-01-20",
        statoFunzionamento: "Buono"
      },
      {
        tipo: "Glucometro",
        fornitore: "Farmacia Centrale",
        dataConsegna: "2024-01-15",
        statoFunzionamento: "Buono"
      }
    ],

    // Verifiche
    verifiche: [
      {
        data: "2024-06-15",
        tipo: "Verifica trimestrale",
        esito: "Miglioramento controllo glicemico",
        prossima: "2024-09-15"
      }
    ],

    // Risultati raggiunti
    risultati: [
      {
        obiettivo: "Controllo glicemico",
        raggiunto: true,
        note: "HbA1c ridotta da 9.5% a 7.2%",
        dataRaggiungimento: "2024-06-01"
      }
    ]
  },

  {
    id: 2,
    nome: "Giuseppe",
    cognome: "Verdi", 
    codiceFiscale: "VRDGPP38B15F205L",
    dataNascita: "1938-02-15",
    luogoNascita: "Milano",
    indirizzo: "Via Milano, 45 - Milano",
    telefono: "02-87654321",
    
    caregiver: {
      nome: "Elena Verdi",
      parentela: "Figlia",
      telefono: "338-9876543",
      email: "elena.verdi@email.com",
      presente24h: true,
      orariDisponibilita: "24/7"
    },

    dataInizioCure: "2024-02-01",
    dataChiusura: null,
    motivazioneChiusura: null,
    statoAttivo: true,

    operatori: [
      {
        nome: "Dr.ssa Laura Neri",
        ruolo: "Geriatra",
        telefono: "02-11223344"
      }
    ],

    diagnosi: {
      principale: "Demenza di Alzheimer",
      secondarie: ["Ipertensione arteriosa"],
      codiciICD: ["F03.9", "I10"]
    },

    rischi: [
      {
        tipo: "Wandering",
        descrizione: "Tendenza alla fuga, sorveglianza continua",
        livello: "Alto",
        dataRilevazione: "2024-02-01"
      }
    ],

    consensoInformato: {
      firmato: true,
      dataFirma: "2024-02-01",
      tipologie: ["Trattamento dati", "Cure domiciliari"]
    },

    valutazioni: [
      {
        strumento: "MMSE",
        punteggio: 12,
        data: "2024-02-01",
        valutatore: "Dr.ssa Laura Neri"
      }
    ],

    pianoTrattamento: {
      obiettivi: [
        "Rallentamento declino cognitivo",
        "Mantenimento dignità personale",
        "Supporto caregiver"
      ],
      interventi: [
        {
          descrizione: "Stimolazione cognitiva quotidiana",
          frequenza: "Quotidiano", 
          responsabile: "Caregiver + supervisione psicologo"
        }
      ],
      aggiornamenti: []
    },

    prestazioni: [
      {
        data: "2024-07-16",
        tipo: "Visita geriatrica",
        operatore: "Dr.ssa Laura Neri",
        esito: "Condizioni stabili, continuare terapia",
        durata: "45 min"
      }
    ],

    ausili: [
      {
        tipo: "Sensori movimento",
        fornitore: "Tecnologie Assistive",
        dataConsegna: "2024-02-10",
        statoFunzionamento: "Ottimo"
      }
    ],

    verifiche: [
      {
        data: "2024-05-01",
        tipo: "Verifica quadrimestrale",
        esito: "Stabilità clinica mantenuta",
        prossima: "2024-09-01"
      }
    ],

    risultati: [
      {
        obiettivo: "Mantenimento dignità",
        raggiunto: true,
        note: "Paziente sereno, buon rapporto con caregiver",
        dataRaggiungimento: "2024-05-01"
      }
    ]
  },

  {
    id: 3,
    nome: "Anna",
    cognome: "Rossi",
    codiceFiscale: "RSSNNA55C20H501M",
    dataNascita: "1955-03-20",
    luogoNascita: "Napoli",
    indirizzo: "Via Napoli, 67 - Napoli",
    telefono: "081-55667788",
    
    caregiver: {
      nome: "Marco Rossi",
      parentela: "Marito",
      telefono: "339-5566778",
      email: "marco.rossi@email.com",
      presente24h: false,
      orariDisponibilita: "7:00-22:00"
    },

    dataInizioCure: "2024-03-10",
    dataChiusura: null,
    motivazioneChiusura: null,
    statoAttivo: true,

    operatori: [
      {
        nome: "Dr. Paolo Blu",
        ruolo: "Oncologo",
        telefono: "081-99887766"
      },
      {
        nome: "Fisioterapista Sara Verde",
        ruolo: "Fisioterapista",
        telefono: "339-9988776"
      }
    ],

    diagnosi: {
      principale: "Carcinoma mammario in trattamento",
      secondarie: ["Linfedema arto superiore dx"],
      codiciICD: ["C50.9", "I89.0"]
    },

    rischi: [
      {
        tipo: "Immunodepressione",
        descrizione: "Da chemioterapia, rischio infezioni",
        livello: "Alto",
        dataRilevazione: "2024-03-10"
      }
    ],

    consensoInformato: {
      firmato: true,
      dataFirma: "2024-03-10",
      tipologie: ["Trattamento dati", "Cure oncologiche", "Fisioterapia"]
    },

    valutazioni: [
      {
        strumento: "Karnofsky Performance Status",
        punteggio: 70,
        data: "2024-03-10",
        valutatore: "Dr. Paolo Blu"
      }
    ],

    pianoTrattamento: {
      obiettivi: [
        "Supporto durante chemioterapia",
        "Gestione linfedema",
        "Mantenimento qualità vita"
      ],
      interventi: [
        {
          descrizione: "Fisioterapia per linfedema",
          frequenza: "3 volte/settimana",
          responsabile: "Fisioterapista Sara Verde"
        },
        {
          descrizione: "Monitoraggio effetti collaterali",
          frequenza: "Settimanale",
          responsabile: "Dr. Paolo Blu"
        }
      ],
      aggiornamenti: [
        {
          data: "2024-05-15",
          descrizione: "Riduzione frequenza fisioterapia per miglioramento",
          responsabile: "Fisioterapista Sara Verde"
        }
      ]
    },

    prestazioni: [
      {
        data: "2024-07-17",
        tipo: "Fisioterapia linfodrenaggio",
        operatore: "Fisioterapista Sara Verde",
        esito: "Riduzione circonferenza braccio di 1cm",
        durata: "60 min"
      }
    ],

    ausili: [
      {
        tipo: "Bendaggio compressivo",
        fornitore: "Sanitaria Centrale",
        dataConsegna: "2024-03-15",
        statoFunzionamento: "Da sostituire"
      }
    ],

    verifiche: [
      {
        data: "2024-06-10",
        tipo: "Verifica oncologica",
        esito: "Buona risposta alla terapia",
        prossima: "2024-09-10"
      }
    ],

    risultati: [
      {
        obiettivo: "Gestione linfedema",
        raggiunto: true,
        note: "Riduzione edema del 40%",
        dataRaggiungimento: "2024-06-01"
      }
    ]
  }
];

export const getAssistitoById = (id) => {
  return assistiti.find(assistito => assistito.id === parseInt(id));
};

export const getAssistitiAttivi = () => {
  return assistiti.filter(assistito => assistito.statoAttivo);
};
