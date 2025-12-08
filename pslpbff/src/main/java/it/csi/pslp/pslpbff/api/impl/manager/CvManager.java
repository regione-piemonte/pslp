/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import it.csi.pslp.pslpbff.api.dto.blp.*;
import it.csi.pslp.pslpbff.api.dto.blp.AbilitazionePosseduta;
import it.csi.pslp.pslpbff.api.dto.blp.Candidatura;
import it.csi.pslp.pslpbff.api.dto.silpapi.*;
import it.csi.pslp.pslpbff.api.dto.silpapi.Albi;
import it.csi.pslp.pslpbff.api.dto.silpapi.AltriCorsiCV;
import it.csi.pslp.pslpbff.api.dto.silpapi.CertifCorso;
import it.csi.pslp.pslpbff.api.dto.silpapi.Comune;
import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitae;
import it.csi.pslp.pslpbff.api.dto.silpapi.Decodifica;
import it.csi.pslp.pslpbff.api.dto.silpapi.GradoConInf;
import it.csi.pslp.pslpbff.api.dto.silpapi.GradoConLin;
import it.csi.pslp.pslpbff.api.dto.silpapi.Informatica;
import it.csi.pslp.pslpbff.api.dto.silpapi.InformaticaDett;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagrafica;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagraficaAlbi;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagraficaAlbiPK;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavCorsoForm;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavCorsoFormAltro;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavInformatica;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavLingua;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavTitoloStudio;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavTitoloStudioAltro;
import it.csi.pslp.pslpbff.api.dto.silpapi.Lingua;
import it.csi.pslp.pslpbff.api.dto.silpapi.ModApprLin;
import it.csi.pslp.pslpbff.api.dto.silpapi.Nazione;
import it.csi.pslp.pslpbff.api.dto.silpapi.Studio;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoliStudioCV;
import it.csi.pslp.pslpbff.api.dto.silpapi.Toponimo;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import jakarta.enterprise.context.Dependent;

import java.util.ArrayList;
import java.util.List;

@Dependent
public class CvManager extends BaseApiServiceImpl {

    /*
    *
    private Long idSilLavAnagrafica;
    private Long idCVBlp;
    */
    public CurriculumVitaeRequest costruisciRequestCv(Candidatura cv){

        CurriculumVitaeRequest req = new CurriculumVitaeRequest();
        CurriculumVitae curriculumVitae=new CurriculumVitae();
        curriculumVitae.setIdSilLavAnagrafica(cv.getIdLavAnagrafica().getIdSilLavAnagrafica());
        curriculumVitae.setIdCVBlp(cv.getId());


        List<LavLingua> lingueStraniere = new ArrayList<>();
        List<LavInformatica> conoscenzeInformatiche = new ArrayList<>();
        List<Decodifica> patenti = new ArrayList<>();
        List<Decodifica> patentini = new ArrayList<>();
        List<LavAnagraficaAlbi> albi = new ArrayList<>();
        List<TitoliStudioCV> titoliDiStudio = new ArrayList<>();
        List<AltriCorsiCV> altriCorsi = new ArrayList<>();

        cv.getLinguaDichList().stream().forEach(
            l->{
                LavLingua tmp = linguaDichToSilpModel(l, curriculumVitae.getIdSilLavAnagrafica());
                lingueStraniere.add(tmp);
            }
        );

        cv.getInformaticaDichList().stream().forEach(
            informaticaDich -> {
                LavInformatica tmp=infoDichToSilpModel(informaticaDich);
                if(informaticaDich.getLivelloConoscenza()!=null){
                    GradoConInf gradoConInf =new GradoConInf();
                    if("S".equals(informaticaDich.getLivelloConoscenza()))
                        gradoConInf.setId("E");
                    else
                        gradoConInf.setId("U");
                    tmp.setSilTGradoConInf(gradoConInf);
                }

                conoscenzeInformatiche.add(tmp);
            }
        );


        cv.getAbilitazionePossedutaList().stream().forEach(
             abilitazionePosseduta -> {
                 Decodifica tmp=new Decodifica();
                 tmp.setId(abilitazionePosseduta.getIdTipoAbilitazione().getIdTipoAbilitazione());
                 patentini.add(tmp);
             }
        );

        cv.getPatentePossedutaList().stream().forEach(
             patentePosseduta -> {
                 Decodifica tmp=new Decodifica();
                 tmp.setId(patentePosseduta.getIdTipoPatente().getIdTipoPatente());
                 patenti.add(tmp);
             }
        );

        cv.getIscrizioneAlboDichList().stream().forEach(
             iscrizioneAlboDich -> {
                LavAnagraficaAlbi tmp=alboToSilpModel(iscrizioneAlboDich, curriculumVitae.getIdSilLavAnagrafica());
                albi.add(tmp);
             }
        );

        cv.getFormazioneList().stream().filter(formazione -> !"S".equals(formazione.getFlgFormazionePiemontese())).forEach(
                formazione -> {
                    AltriCorsiCV  tmp=formazioneToSilpModel(formazione);
                    altriCorsi.add(tmp);
                }
        );


        cv.getIstruzioneDichList().stream().forEach(
                istruzioneDich -> {
                    TitoliStudioCV tmp=istruzioneDichtoSilpModel(istruzioneDich);
                    titoliDiStudio.add(tmp);
                }
        );

        curriculumVitae.setAlbi(albi);
        curriculumVitae.setPatenti(patenti);
        curriculumVitae.setPatentini(patentini);
        curriculumVitae.setLingueStraniere(lingueStraniere);
        curriculumVitae.setAltriCorsi(altriCorsi);
        curriculumVitae.setConoscenzeInformatiche(conoscenzeInformatiche);
        curriculumVitae.setTitoliDiStudio(titoliDiStudio);

        req.setCurriculumVitae(curriculumVitae);
        return req;
    }

    private AltriCorsiCV formazioneToSilpModel(Formazione formazione){
        AltriCorsiCV altriCorsiCV = new AltriCorsiCV();
        LavCorsoForm lavCorsoForm=new LavCorsoForm();
        LavCorsoFormAltro lavCorsoFormAltro=new LavCorsoFormAltro();
        //AltroCorsoForm altroCorsoForm=new AltroCorsoForm();

        lavCorsoFormAltro.setIdSilLavCorsoForm(formazione.getIdSilLavCorsoForm());
        lavCorsoFormAltro.setDsDenominazioneEnteErog(formazione.getDenominazioneAziendaFormazione());
        lavCorsoFormAltro.setDsIndirizzoEnteErog(formazione.getIndirizzoSedeCorso());
        lavCorsoFormAltro.setDsNumCivicoEnteErog(formazione.getNumCivicoSedeCorso());

        lavCorsoFormAltro.setDurataCorso(formazione.getDurata());
        lavCorsoFormAltro.setFlgStageFinale(formazione.getFlgTirocinioCurriculare());//Sarà corretto? mah al prossimo che mi dice di
                                                                                        // chiedere risponderò di scrivermi un'analisi su questo abominio
        if(formazione.getIdToponimoSedeCorso()!=null){
            Toponimo toponimo=new Toponimo();
            toponimo.setIdSilTToponimo(formazione.getIdToponimoSedeCorso().getIdToponimo());
            lavCorsoFormAltro.setSilTToponimoEnteErog(toponimo);
        }
        if(formazione.getIdAttestazione()!=null){
            CertifCorso certifCorso=new CertifCorso();
            certifCorso.setIdSilTCertifCorso(formazione.getIdAttestazione().getCodAttestazioneMin());
            lavCorsoFormAltro.setSilTCertifCorso(certifCorso);
        }

        if(formazione.getIdComuneSedeCorso()!=null){
            Comune comuneErog=new Comune();
            comuneErog.setId(formazione.getIdComuneSedeCorso().getIdComune());
            lavCorsoFormAltro.setSilTComuneEnteErog(comuneErog);
        }

        if(formazione.getIdNazioneSedeCorso()!=null){
            Nazione nazioneErog=new Nazione();
            nazioneErog.setIdSilTNazione(formazione.getIdNazioneSedeCorso().getIdNazione());
            lavCorsoFormAltro.setSilTNazioneEnteErog(nazioneErog);
        }

        if(formazione.getIdUnitaMisuraDurata()!=null){
            lavCorsoFormAltro.setCodTipologiaDurataCorso(formazione.getIdUnitaMisuraDurata().getIdUnitaMisuraDurata());
        }


        lavCorsoForm.setIdSilLavCorsoForm(formazione.getIdSilLavCorsoForm());
        lavCorsoForm.setDInizioCorso(formazione.getDInizio());
        lavCorsoForm.setDFineCorso(formazione.getDFine());
        lavCorsoForm.setDsQualifica(formazione.getDsQualificaAcquisita());

        altriCorsiCV.setIdFormazione(formazione.getId());
        altriCorsiCV.setLavCorsoForm(lavCorsoForm);
        altriCorsiCV.setLavCorsoFormAltro(lavCorsoFormAltro);

        return altriCorsiCV;
    }

    
    private TitoliStudioCV istruzioneDichtoSilpModel(IstruzioneDich istruzioneDich){

        TitoliStudioCV titoliStudioCV=new TitoliStudioCV();
        LavTitoloStudio titoloStudio = new LavTitoloStudio();
        LavTitoloStudioAltro lavTitoloStudioAltro=new LavTitoloStudioAltro();
        titoloStudio.setDsVoto(istruzioneDich.getVotazioneConseguita());
        titoloStudio.setFlgCompletato("S".equals(istruzioneDich.getFlgInCorso())?"N":"S");
        titoloStudio.setFlgRiconosciutoItalia(istruzioneDich.getFlgConseguitoInItalia());//anche qui sarà giusto? boh


        Studio silTStudio= new Studio();
        silTStudio.setId(istruzioneDich.getIdTitoloStudio().getIdTitoloStudio());
        titoloStudio.setSilTStudio(silTStudio);
        titoloStudio.setDsVoto(istruzioneDich.getVotazioneConseguita());

        lavTitoloStudioAltro.setDsDenominazioneIst(istruzioneDich.getNomeIstituto());
        lavTitoloStudioAltro.setDsIndirizzoIst(istruzioneDich.getIndirizzoIstituto());
        lavTitoloStudioAltro.setFlgStageFinale(istruzioneDich.getFlgStagePcto());
        lavTitoloStudioAltro.setDsNumCivicoIst(istruzioneDich.getNumCivicoIstituto());

        if(istruzioneDich.getIdToponimoIstituto()!=null){
            Toponimo toponimo=new Toponimo();
            toponimo.setIdSilTToponimo(istruzioneDich.getIdToponimoIstituto().getIdToponimo());
            lavTitoloStudioAltro.setSilTToponimoIst(toponimo);
        }
        if(istruzioneDich.getIdComuneSedeIstituto()!=null){
            Comune comuneIst=new Comune();
            comuneIst.setId(istruzioneDich.getIdComuneSedeIstituto().getIdComune());
            lavTitoloStudioAltro.setSilTComuneIst(comuneIst);
        }

        if(istruzioneDich.getIdNazioneSedeIstituto()!=null){
            Nazione nazioneIst=new Nazione();
            nazioneIst.setIdSilTNazione(istruzioneDich.getIdNazioneSedeIstituto().getIdNazione());
            lavTitoloStudioAltro.setSilTNazioneIst(nazioneIst);
        }

        titoliStudioCV.setLavTitoloStudio(titoloStudio);
        titoliStudioCV.setLavTitoloStudioAltro(lavTitoloStudioAltro);
        return titoliStudioCV;
    }

    private LavInformatica infoDichToSilpModel(InformaticaDich informaticaDich ){
        LavInformatica lavInformatica = new LavInformatica();
        GradoConInf gradoConInf = new GradoConInf();
        gradoConInf.setId(("S".equals(informaticaDich.getLivelloConoscenza())) ? "E" : "U");
        lavInformatica.setSilTGradoConInf(gradoConInf);

        InformaticaDett informaticaDett= new InformaticaDett();
        Informatica informatica= new Informatica();
        informatica.setId(informaticaDich.getIdConoscenzaSpecifica().getIdInformatica().getId());
        informaticaDett.setInformatica(informatica);
        informaticaDett.setId(informaticaDich.getIdConoscenzaSpecifica().getIdInformaticaDett());

        lavInformatica.setSilTInformaticaDett(informaticaDett);
        return lavInformatica;
    }

    private LavAnagraficaAlbi alboToSilpModel(IscrizioneAlboDich albo, Long idSilLavAnagrafica){
        LavAnagraficaAlbi lavAnagraficaAlbi=new LavAnagraficaAlbi();
        LavAnagraficaAlbiPK pk=new LavAnagraficaAlbiPK();

        pk.setIdSilLavAnagrafica(idSilLavAnagrafica);
        Albi albi=new Albi();
        albi.setId(albo.getIdAlbo().getId());

        pk.setSilTAlbi(albi);
        lavAnagraficaAlbi.setId(pk);
        return lavAnagraficaAlbi;
    }

    private LavLingua linguaDichToSilpModel(LinguaDich linguaDich, Long idSilLavAnagrafica){
        LavLingua lavLingua=new LavLingua();

        Lingua lingua=new Lingua();
        lingua.setId(linguaDich.getCodLingua().getCodLingua());
        lavLingua.setSilTLingua(lingua);

        if(linguaDich.getIdModApprLingua()!=null) {
            ModApprLin modApprLin = new ModApprLin();
            modApprLin.setId(linguaDich.getIdModApprLingua().getIdModApprLingua());
            lavLingua.setSilTModApprLin(modApprLin);
        }
        GradoConLin gradoConLin=new GradoConLin();
        gradoConLin.setId(linguaDich.getCodGradoConLingua().getCodGradoConLingua());
        lavLingua.setGradoConLinL(gradoConLin);
        lavLingua.setSilTGradoConLinP(gradoConLin);
        lavLingua.setSilTGradoConLinS(gradoConLin);

        LavAnagrafica lavAnagrafica=new LavAnagrafica();
        lavAnagrafica.setIdSilLavAnagrafica(idSilLavAnagrafica);
        lavLingua.setSilLavAnagrafica(lavAnagrafica);

        lavLingua.setFlgCertificato(linguaDich.getFlgCertificazioneAcquisita());

        return lavLingua;
    }

    private LavAnagSilTTipoP patenteToSilpModel(PatentePosseduta patentePosseduta, Long idSilLavAnagrafica){
        LavAnagSilTTipoP patente=new LavAnagSilTTipoP();
        LavAnagSilTTipoPPK pk=new LavAnagSilTTipoPPK();
        pk.setIdSilLavAnagrafica(idSilLavAnagrafica);

        TipoPatente tipoPatente=new TipoPatente();
        tipoPatente.setId(patentePosseduta.getIdTipoPatente().getIdTipoPatente());
        pk.setSilTTipoPatente(tipoPatente);

        patente.setId(pk);
        return patente;
    }

    private LavAnagSilTTipoP abilitazioneToSilpModel(AbilitazionePosseduta patentePosseduta, Long idSilLavAnagrafica){
        LavAnagSilTTipoP patente=new LavAnagSilTTipoP();
        LavAnagSilTTipoPPK pk=new LavAnagSilTTipoPPK();
        pk.setIdSilLavAnagrafica(idSilLavAnagrafica);

        TipoPatente tipoPatente=new TipoPatente();
        tipoPatente.setId(patentePosseduta.getIdTipoAbilitazione().getIdTipoAbilitazione());
        pk.setSilTTipoPatente(tipoPatente);

        patente.setId(pk);
        return patente;
    }


}
