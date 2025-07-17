-- =====================================================
-- SCHEMA COMPLETO DATABASE SOGEENP - CURE DOMICILIARI
-- =====================================================

-- Abilita estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. TABELLA OPERATORI
-- =====================================================
CREATE TABLE operatori (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dati anagrafici
    codice_operatore VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    
    -- Qualifica professionale
    qualifica VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    specializzazioni TEXT[],
    
    -- Stato lavorativo
    data_assunzione DATE,
    stato VARCHAR(20) DEFAULT 'attivo' CHECK (stato IN ('attivo', 'sospeso', 'cessato')),
    
    -- Fascicolo personale (JSON per flessibilità)
    fascicolo_personale JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. TABELLA ASSISTITI
-- =====================================================
CREATE TABLE assistiti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dati anagrafici
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    codice_fiscale VARCHAR(16) UNIQUE NOT NULL,
    data_nascita DATE,
    luogo_nascita VARCHAR(100),
    sesso CHAR(1) CHECK (sesso IN ('M', 'F')),
    
    -- Contatti
    telefono_principale VARCHAR(20),
    telefono_secondario VARCHAR(20),
    email VARCHAR(255),
    
    -- Indirizzo
    indirizzo_completo TEXT,
    cap VARCHAR(5),
    citta VARCHAR(100),
    provincia VARCHAR(2),
    
    -- Dati sanitari base
    tessera_sanitaria VARCHAR(20),
    medico_curante JSONB,
    
    -- Stato assistenza
    stato_assistenza VARCHAR(20) DEFAULT 'attivo' CHECK (stato_assistenza IN ('attivo', 'sospeso', 'concluso')),
    data_presa_carico DATE DEFAULT CURRENT_DATE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. FASCICOLI SANITARI DOMICILIARI
-- =====================================================
CREATE TABLE fascicoli_sanitari_domiciliari (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistito_id UUID REFERENCES assistiti(id) ON DELETE CASCADE,
    
    -- Caregiver
    caregiver_principale JSONB,
    caregivers_secondari JSONB[],
    
    -- Inizio cure
    data_inizio_cure DATE NOT NULL,
    modalita_accesso VARCHAR(100),
    provenienza TEXT,
    
    -- Operatori di riferimento
    medico_responsabile UUID REFERENCES operatori(id),
    coordinatore_assistenziale UUID REFERENCES operatori(id),
    operatori_equipe UUID[],
    
    -- Diagnosi
    diagnosi_principale TEXT NOT NULL,
    diagnosi_secondarie TEXT[],
    gravita_clinica VARCHAR(50),
    
    -- Rischi
    allergie_farmacologiche TEXT[],
    allergie_alimentari TEXT[],
    rischio_cadute BOOLEAN DEFAULT FALSE,
    rischio_lesioni_pressione BOOLEAN DEFAULT FALSE,
    rischio_nutrizionale BOOLEAN DEFAULT FALSE,
    altri_rischi TEXT[],
    note_rischi TEXT,
    
    -- Consensi
    consenso_informato JSONB,
    
    -- Valutazioni
    valutazioni_utilizzate JSONB,
    
    -- Piano trattamento
    obiettivi_assistenziali TEXT[],
    frequenza_accessi VARCHAR(100),
    durata_prevista_mesi INTEGER,
    
    -- Prestazioni e ausili
    tipologie_prestazioni TEXT[],
    ausili_necessari JSONB[],
    presidi_medici JSONB[],
    
    -- Verifiche
    periodicita_verifiche VARCHAR(50) DEFAULT 'trimestrale',
    ultima_verifica DATE,
    prossima_verifica DATE,
    responsabile_verifiche UUID REFERENCES operatori(id),
    
    -- Risultati
    soddisfazione_utente INTEGER CHECK (soddisfazione_utente BETWEEN 1 AND 10),
    soddisfazione_caregiver INTEGER CHECK (soddisfazione_caregiver BETWEEN 1 AND 10),
    obiettivi_raggiunti TEXT[],
    
    -- Chiusura
    data_chiusura DATE,
    motivo_chiusura VARCHAR(100),
    
    -- Stato
    stato VARCHAR(20) DEFAULT 'attivo' CHECK (stato IN ('attivo', 'sospeso', 'chiuso')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES operatori(id)
);

-- =====================================================
-- 4. ACCESSI DOMICILIARI (Diario Assistenziale)
-- =====================================================
CREATE TABLE accessi_domiciliari (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistito_id UUID REFERENCES assistiti(id) ON DELETE CASCADE,
    fascicolo_id UUID REFERENCES fascicoli_sanitari_domiciliari(id) ON DELETE CASCADE,
    
    -- Data e ora (OBBLIGATORIO)
    data_accesso DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME,
    durata_effettiva INTEGER, -- minuti
    
    -- Operatori (OBBLIGATORIO)
    operatore_principale UUID REFERENCES operatori(id) NOT NULL,
    operatori_secondari UUID[],
    operatori_nomi TEXT[], -- Cache per performance
    
    -- Prestazioni (OBBLIGATORIO)
    prestazioni_svolte TEXT[] NOT NULL,
    note_prestazioni TEXT,
    
    -- Parametri vitali
    parametri_vitali JSONB,
    condizioni_generali TEXT,
    
    -- Criticità
    criticita_rilevate TEXT[],
    necessita_interventi BOOLEAN DEFAULT FALSE,
    
    -- Geolocalizzazione
    coordinate_accesso POINT,
    
    -- Firme digitali (OBBLIGATORIO)
    firma_operatore_hash TEXT NOT NULL,
    firma_operatore_timestamp TIMESTAMP NOT NULL,
    firma_paziente_hash TEXT,
    firma_caregiver_hash TEXT,
    firma_caregiver_nome VARCHAR(255),
    
    -- Stato
    stato VARCHAR(20) DEFAULT 'completato' CHECK (stato IN ('programmato', 'in_corso', 'completato', 'annullato')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completato_at TIMESTAMP,
    
    -- Vincoli
    CONSTRAINT check_firma_paziente_o_caregiver 
        CHECK (firma_paziente_hash IS NOT NULL OR firma_caregiver_hash IS NOT NULL)
);

-- =====================================================
-- 5. DOCUMENTI (Modulo Documentazione)
-- =====================================================
CREATE TABLE categorie_documentazione (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codice_categoria VARCHAR(50) UNIQUE NOT NULL,
    nome_categoria VARCHAR(255) NOT NULL,
    descrizione TEXT,
    colore_interfaccia VARCHAR(7) DEFAULT '#3B82F6',
    abilita_ai_training BOOLEAN DEFAULT FALSE,
    attiva BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documenti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES categorie_documentazione(id) NOT NULL,
    
    -- Identificazione
    codice_documento VARCHAR(100) UNIQUE NOT NULL,
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT,
    versione VARCHAR(20) NOT NULL DEFAULT '1.0',
    
    -- File
    nome_file_originale VARCHAR(255) NOT NULL,
    url_file TEXT NOT NULL,
    dimensione_kb INTEGER,
    
    -- Contenuto per AI
    contenuto_estratto TEXT,
    argomenti_principali TEXT[],
    
    -- Validità
    data_pubblicazione DATE DEFAULT CURRENT_DATE,
    data_scadenza DATE,
    
    -- Stato
    stato VARCHAR(20) DEFAULT 'pubblicato' CHECK (stato IN ('bozza', 'pubblicato', 'archiviato')),
    pubblico BOOLEAN DEFAULT TRUE,
    utilizzabile_per_training BOOLEAN DEFAULT FALSE,
    
    -- Statistiche
    download_count INTEGER DEFAULT 0,
    visualizzazioni_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES operatori(id) NOT NULL
);

-- =====================================================
-- 6. TEST AI FORMAZIONE
-- =====================================================
CREATE TABLE test_documenti_ai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id UUID REFERENCES documenti(id) ON DELETE CASCADE,
    
    -- Configurazione
    titolo VARCHAR(255) NOT NULL,
    numero_domande INTEGER NOT NULL,
    difficolta VARCHAR(20) CHECK (difficolta IN ('base', 'intermedio', 'avanzato')),
    tempo_stimato INTEGER, -- minuti
    
    -- Contenuto (generato da AI)
    domande JSONB NOT NULL,
    modello_ai VARCHAR(100),
    
    -- Stato
    attivo BOOLEAN DEFAULT TRUE,
    validato BOOLEAN DEFAULT FALSE,
    
    -- Statistiche
    utilizzi_count INTEGER DEFAULT 0,
    punteggio_medio DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    generated_by UUID REFERENCES operatori(id) NOT NULL
);

-- =====================================================
-- 7. RISULTATI TEST
-- =====================================================
CREATE TABLE risultati_test_documenti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES test_documenti_ai(id) ON DELETE CASCADE,
    operatore_id UUID REFERENCES operatori(id) ON DELETE CASCADE,
    
    -- Esecuzione
    data_inizio TIMESTAMP NOT NULL,
    data_completamento TIMESTAMP,
    tempo_impiegato INTEGER, -- secondi
    
    -- Risultati
    risposte JSONB NOT NULL,
    punteggio_totale DECIMAL(5,2),
    percentuale DECIMAL(5,2),
    domande_corrette INTEGER,
    domande_totali INTEGER,
    
    -- Certificazione
    superato BOOLEAN DEFAULT FALSE,
    certificato_generato BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INSERIMENTO DATI INIZIALI
-- =====================================================

-- Categorie documentazione
INSERT INTO categorie_documentazione (codice_categoria, nome_categoria, descrizione, colore_interfaccia, abilita_ai_training) VALUES
('PROC_ASSIST', 'Procedure Assistenziali', 'Procedure operative per assistenza domiciliare', '#10B981', true),
('LINEE_GUIDA', 'Linee Guida', 'Linee guida cliniche e assistenziali', '#3B82F6', true),
('PROTOCOLLI', 'Protocolli', 'Protocolli operativi e di sicurezza', '#F59E0B', true),
('MODULISTICA', 'Modulistica', 'Moduli e documenti amministrativi', '#6366F1', false),
('FORMAZIONE', 'Materiale Formativo', 'Materiali per formazione e aggiornamento', '#EC4899', true);

-- Operatori SOGEENP (dati reali dall'organigramma)
INSERT INTO operatori (codice_operatore, nome, cognome, qualifica, level, email) VALUES
-- DIREZIONE
('DIR001', 'Cecilia', 'Matta', 'Direttore', 5, 'cecilia.matta@sogeenp.it'),
('VD001', 'Federica', 'Pastorino', 'Vice-Direttore e RQ', 4, 'federica.pastorino@sogeenp.it'),
('MED001', 'Lorenzo', 'GRECU', 'Medico Responsabile', 4, 'lorenzo.grecu@sogeenp.it'),

-- COORDINAMENTO  
('CI001', 'Pasquale', 'Milena', 'Coordinatore Infermieristico', 3, 'pasquale.milena@sogeenp.it'),
('CM001', 'Cristina', 'Bovone', 'Case Manager', 3, 'cristina.bovone@sogeenp.it'),

-- STAFF
('RF001', 'Matteo', 'Vannucci', 'Responsabile Formazione', 3, 'matteo.vannucci@sogeenp.it'),
('SEG001', 'Nadia', 'Vuovolo', 'Segreteria - Call Center', 2, 'nadia.vuovolo@sogeenp.it'),

-- INFERMIERI
('INF001', 'Ghita', 'Dumitra', 'Infermiere', 2, 'ghita.dumitra@sogeenp.it'),
('INF002', 'Sasu', 'Roxana', 'Infermiere', 2, 'sasu.roxana@sogeenp.it'),

-- FISIOTERAPISTI
('FT001', 'Andrea', 'Corradini', 'Fisioterapista', 2, 'andrea.corradini@sogeenp.it'),
('FT002', 'Emanuele', 'Pisoni', 'Fisioterapista', 2, 'emanuele.pisoni@sogeenp.it'),

-- OSS
('OSS001', 'Lucia', 'Ferrarotti', 'OSS', 1, 'lucia.ferrarotti@sogeenp.it'),
('OSS002', 'Anna', 'Conzatti', 'OSS', 1, 'anna.conzatti@sogeenp.it'),
('OSS003', 'Sabrina', 'Tononi', 'OSS', 1, 'sabrina.tononi@sogeenp.it'),
('OSS004', 'Anna Tiziana', 'Romano', 'OSS', 1, 'anna.romano@sogeenp.it'),
('OSS005', 'Eugenia', 'Marella', 'OSS', 1, 'eugenia.marella@sogeenp.it');

-- =====================================================
-- INDICI PER PERFORMANCE
-- =====================================================

CREATE INDEX idx_operatori_qualifica ON operatori(qualifica);
CREATE INDEX idx_assistiti_stato ON assistiti(stato_assistenza);
CREATE INDEX idx_fascicoli_assistito ON fascicoli_sanitari_domiciliari(assistito_id);
CREATE INDEX idx_accessi_data ON accessi_domiciliari(data_accesso);
CREATE INDEX idx_documenti_categoria ON documenti(categoria_id);
CREATE INDEX idx_test_documento ON test_documenti_ai(documento_id);

-- =====================================================
-- ROW LEVEL SECURITY (Sicurezza)
-- =====================================================

ALTER TABLE operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistiti ENABLE ROW LEVEL SECURITY;
ALTER TABLE fascicoli_sanitari_domiciliari ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessi_domiciliari ENABLE ROW LEVEL SECURITY;
ALTER TABLE documenti ENABLE ROW LEVEL SECURITY;

-- Policy di base: tutti possono leggere (personalizzare in base alle esigenze)
CREATE POLICY "Lettura pubblica operatori" ON operatori FOR SELECT USING (true);
CREATE POLICY "Lettura pubblica assistiti" ON assistiti FOR SELECT USING (true);
CREATE POLICY "Lettura pubblica fascicoli" ON fascicoli_sanitari_domiciliari FOR SELECT USING (true);
CREATE POLICY "Lettura pubblica accessi" ON accessi_domiciliari FOR SELECT USING (true);
CREATE POLICY "Lettura pubblica documenti" ON documenti FOR SELECT USING (pubblico = true);

-- =====================================================
-- FINE SCHEMA DATABASE
-- =====================================================

-- Verifica creazione tabelle
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
