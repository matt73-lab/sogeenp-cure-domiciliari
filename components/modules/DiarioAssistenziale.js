// components/modules/DiarioAssistenziale.js - Diario con compliance e firma digitale
import { useState, useEffect } from 'react';
import { assistiti } from '../../data/assistiti';
import { operatori } from '../../data/operatori';
import Button from '../ui/Button';

export default function DiarioAssistenziale() {
  const [selectedAssistito, setSelectedAssistito] = useState('');
  const [showNuovaPrestazione, setShowNuovaPrestazione] = useState(false);
  const [prestazioni, setPrestazioni] = useState([]);
  const [filtroData, setFiltroData] = useState('oggi');
  const [filtroOperatore, setFiltroOperatore] = useState('tutti');
  const [showFirmaDigitale, setShowFirmaDigitale] = useState(false);

  // Form nuova prestazione
  const [formData, setFormData] = useState({
    assistitoId: '',
    operatoreId: '',
    data: new Date().toISOString().split('T')[0],
    oraInizio: '',
    oraFine: '',
    tipoPrestazione: '',
    descrizione: '',
    parametriVitali: {
      pressione: '',
      battiti: '',
      temperatura: '',
      saturazione: '',
      glicemia: ''
    },
    farmaci: [],
    note: '',
    presenza: {
      paziente: true,
      caregiver: false,
      altriPresenti: ''
    },
    firmaOperatore: '',
    firmaCaregiver: '',
    allegati: []
  });

  // Tipi di prestazione predefiniti
  const tipiPrestazione = [
    'Controllo parametri vitali',
    'Somministrazione farmaci',
    'Medicazione',
    'Igiene personale',
    'Fisioterapia',
    'Prelievo ematico',
    'Controllo glicemia',
    'Valutazione generale',
    'Educazione sanitaria',
    'Supporto psicologico',
    'Altro'
  ];

  // Farmaci comuni
  const farmaciComuni = [
    'Insulina',
    'Cardioaspirina',
    'Ramipril',
    'Metformina',
    'Furosemide',
    'Paracetamolo',
    'Ibuprofene',
    'Omeprazolo'
  ];

  useEffect(() => {
    // Carica prestazioni filtrate
    const prestazioniTutti = assistiti.flatMap(assistito => 
      (assistito.prestazioni || []).map(prestazione => ({
        ...prestazione,
        assistitoId: assistito.id,
