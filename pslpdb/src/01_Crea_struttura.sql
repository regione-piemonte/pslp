/* ---------------------------------------------------------------------- */
/* Add sequences                                                          */
/* ---------------------------------------------------------------------- */

create sequence seq_pslp_t_utente increment 1 minvalue 1 start 1;

create sequence seq_pslp_r_utente_privacy increment 1 minvalue 1 start 1;

create sequence seq_pslp_t_delega increment 1 minvalue 1 start 1;

create sequence seq_pslp_t_delega_otp increment 1 minvalue 1 start 1;

create sequence seq_csi_log_audit increment 1 minvalue 1 start 1;

/* ---------------------------------------------------------------------- */
/* Add tables                                                             */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_ruolo"                                               */
/* ---------------------------------------------------------------------- */

create table pslp_d_ruolo (
    id_ruolo numeric(7) not null,
    ds_ruolo character varying(60) not null,
    nome_ruolo character varying(80) not null,
    constraint pk_pslp_d_ruolo primary key (id_ruolo)
);

comment on table pslp_d_ruolo is 'Tabella dei ruoli possibili per pslp';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_t_utente"                                              */
/* ---------------------------------------------------------------------- */

create table pslp_t_utente (
    id_utente numeric(10) not null,
    cf_utente character varying(16) not null,
    cognome character varying(70) not null,
    nome character varying(70) not null,
    identificativo_sap character varying(11),
    id_sil_lav_anagrafica numeric,
    cf_utente_old character varying(16),
    cod_user_inserim character varying(16) not null,
    d_inserim timestamp not null,
    cod_user_aggiorn character varying(16) not null,
    d_aggiorn timestamp not null,
    constraint pk_pslp_t_utente primary key (id_utente)
);

create unique index ak_pslp_t_utente_01 on pslp_t_utente (cf_utente);

create index ie_pslp_t_utente_01 on pslp_t_utente (id_sil_lav_anagrafica);
create index ie_pslp_t_utente_02 on pslp_t_utente (identificativo_sap);
create index ie_pslp_t_utente_03 on pslp_t_utente (cf_utente_old);

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_funzione"                                            */
/* ---------------------------------------------------------------------- */

create table pslp_d_funzione (
    id_funzione numeric(7) not null,
    titolo_funzione character varying(100) not null,
    sottotitolo_funzione character varying(200),
    icona_funzione character varying(50),
    ds_note_funzione character varying(200),
    ordinamento numeric,
    flg_attiva character varying(1),
    constraint pk_pslp_d_funzione primary key (id_funzione)
);

comment on table pslp_d_funzione is 'Tabella elenco funzioni';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_r_utente_ruolo"                                        */
/* ---------------------------------------------------------------------- */

create table pslp_r_utente_ruolo (
    id_utente numeric(10) not null,
    id_ruolo numeric(7) not null,
    flg_operatore_silp character varying(1),
    email character varying(256),
    d_inizio timestamp not null,
    d_fine timestamp,
    constraint pk_pslp_r_utente_ruolo primary key (id_utente, id_ruolo),
    constraint chk_pslp_r_utente_ruolo_01 check (flg_operatore_silp = 's')
);

create index ie_pslp_r_utente_ruolo_01 on pslp_r_utente_ruolo (id_ruolo);

comment on table pslp_r_utente_ruolo is 'Tabella di relazione utente e ruolo';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_r_ruolo_funzione"                                      */
/* ---------------------------------------------------------------------- */

create table pslp_r_ruolo_funzione (
    id_ruolo numeric(7) not null,
    id_funzione numeric(7) not null,
    d_inizio timestamp not null,
    d_fine timestamp,
    flg_write character varying(1),
    constraint pk_pslp_r_ruolo_funzione primary key (id_ruolo, id_funzione)
);

create index ie_pslp_r_ruolo_funzione_01 on pslp_r_ruolo_funzione (id_funzione);

comment on table pslp_r_ruolo_funzione is 'Tabella di relazione tra ruolo e funzione';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_privacy"                                             */
/* ---------------------------------------------------------------------- */

create table pslp_d_privacy (
    id_privacy numeric(10) not null,
    cod_privacy character varying(7) not null,
    ds_testata character varying(500) not null,
    ds_sunto character varying(3000) not null,
    ds_dettaglio character varying(8000),
    id_funzione numeric(7),
    d_inizio timestamp not null,
    d_fine timestamp,
    desc_privacy character varying(20),
    constraint pk_pslp_d_privacy primary key (id_privacy)
);

create unique index ak_pslp_d_privacy_01 on pslp_d_privacy (cod_privacy,coalesce(d_fine, timestamp '2999-12-31'));

comment on table pslp_d_privacy is 'Contiene i testi delle privacy; ogni privacy ha 3 testi: Testata, sunto e dettaglio';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_tipo_responsabilita"                                 */
/* ---------------------------------------------------------------------- */

create table pslp_d_tipo_responsabilita (
    cod_tipo_responsabilita character varying(4) not null,
    descr_tipo_responsabilita character varying(100) not null,
    flg_minorenne character varying(1),
    d_inizio timestamp not null,
    d_fine timestamp,
    constraint pk_pslp_d_tipo_responsabilita primary key (cod_tipo_responsabilita),
    constraint chk_pslp_d_tipo_responsabilita_01 check (flg_minorenne = 'S')
);

/* ---------------------------------------------------------------------- */
/* Add table "pslp_r_utente_privacy"                                      */
/* ---------------------------------------------------------------------- */

create table pslp_r_utente_privacy (
    id_utente_privacy numeric(10) not null,
    id_utente numeric(10) not null,
    id_privacy numeric(10) not null,
    id_utente_delegante numeric(10),
    d_presa_visione timestamp not null,
    cod_user_inserim character varying(16) not null,
    d_inserim timestamp not null,
    cod_user_aggiorn character varying(16) not null,
    d_aggiorn timestamp not null,
    constraint pk_pslp_r_utente_privacy primary key (id_utente_privacy)
);

create index ie_pslp_r_utente_privacy_01 on pslp_r_utente_privacy (id_utente,id_privacy);
create index ie_pslp_r_utente_privacy_02 on pslp_r_utente_privacy (id_utente_delegante);

comment on table pslp_r_utente_privacy is 'Contiene le privacy per ogni singolo utente. Nel caso in cui lutente operi per un delegante sono presenti le privacy di ogni coppia.';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_t_delega"                                              */
/* ---------------------------------------------------------------------- */

create table pslp_t_delega (
    id_delega numeric(10) not null,
    id_utente_delegato numeric(10) not null,
    id_utente_delegante numeric(10),
    cod_tipo_responsabilita character varying(4) not null,
    num_cellulare character varying(20),
    d_inizio timestamp not null,
    d_fine timestamp,
    cod_user_inserim character varying(16) not null,
    d_inserim timestamp not null,
    cod_user_aggiorn character varying(16) not null,
    d_aggiorn timestamp not null,
    constraint pk_pslp_t_delega primary key (id_delega)
);

create index ie_pslp_t_delega_01 on pslp_t_delega (id_utente_delegato);
create index ie_pslp_t_delega_02 on pslp_t_delega (id_utente_delegante);

comment on column pslp_t_delega.id_utente_delegante is 'E il minore o il maggiorenne senza SPID';

/* ---------------------------------------------------------------------- */
/* Add table "pslp_t_delega_otp"                                              */
/* ---------------------------------------------------------------------- */

create table pslp_t_delega_otp (
    id_delega_otp numeric(10) not null default nextval('seq_pslp_t_delega_otp'),
    codice_fiscale character varying(16),
    otp_generato numeric(10),
    otp_inserito numeric(10),
    data_invio timestamp,
    cod_user_aggiorn character varying(255),
    cod_user_inserim character varying(255),
    d_aggiorn timestamp,
    d_inserim timestamp,
    constraint pk_pslp_t_delega_otp primary key (id_delega_otp)
);

comment on table pslp_t_delega_otp is 'Tabella per la gestione delle deleghe OTP';

/* ---------------------------------------------------------------------- */
/* Add table "csi_log_audit"                                              */
/* ---------------------------------------------------------------------- */

create table csi_log_audit (
    id_audit integer not null,
    data_ora timestamp not null,
    ip_address character varying(40) not null,
    id_app character varying(100) not null,
    key_oper character varying(500),
    ogg_oper character varying(4000) not null,
    operazione character varying(50),
    utente character varying(100),
    constraint pk_csi_log_audit primary key (id_audit)
);

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_parametro"                                           */
/* ---------------------------------------------------------------------- */

create table pslp_d_parametro (
    id_parametro integer not null,
    cod_parametro character varying(20) not null,
    descr_parametro character varying(200) not null,
    valore_parametro character varying(1000),
    valore_parametro_ext text,
    d_inizio timestamp not null,
    d_fine timestamp,
    constraint pk_pslp_d_parametro primary key (id_parametro)
);

create index ie_pslp_d_parametro_01 on pslp_d_parametro (cod_parametro);

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_tipo_messaggio"                                      */
/* ---------------------------------------------------------------------- */

create table pslp_d_tipo_messaggio (
    cod_tipo_messaggio character varying(2) not null,
    descr_tipo_messaggio character varying(50) not null,
    constraint pk_pslp_d_tipo_messaggio primary key (cod_tipo_messaggio)
);

/* ---------------------------------------------------------------------- */
/* Add table "pslp_d_messaggio"                                           */
/* ---------------------------------------------------------------------- */

create table pslp_d_messaggio (
    id_messaggio integer not null,
    cod_messaggio character varying(5) not null,
    descr_messaggio character varying(200) not null,
    cod_tipo_messaggio character varying(2) not null,
    intestazione character varying(200),
    testo text,
    d_inizio timestamp not null,
    d_fine timestamp,
    constraint pk_pslp_d_messaggio primary key (id_messaggio)
);

/* ---------------------------------------------------------------------- */
/* Add foreign key constraints                                            */
/* ---------------------------------------------------------------------- */

alter table pslp_r_utente_ruolo add constraint fk_pslp_t_utente_01 
    foreign key (id_utente) references pslp_t_utente (id_utente);

alter table pslp_r_utente_ruolo add constraint fk_pslp_d_ruolo_01 
    foreign key (id_ruolo) references pslp_d_ruolo (id_ruolo);

alter table pslp_r_ruolo_funzione add constraint fk_pslp_d_ruolo_02 
    foreign key (id_ruolo) references pslp_d_ruolo (id_ruolo);

alter table pslp_r_ruolo_funzione add constraint fk_pslp_d_funzione_01 
    foreign key (id_funzione) references pslp_d_funzione (id_funzione);

alter table pslp_d_privacy add constraint fk_pslp_d_funzione_02 
    foreign key (id_funzione) references pslp_d_funzione (id_funzione);

alter table pslp_r_utente_privacy add constraint fk_pslp_t_utente_02 
    foreign key (id_utente) references pslp_t_utente (id_utente);

alter table pslp_r_utente_privacy add constraint fk_pslp_d_privacy_01 
    foreign key (id_privacy) references pslp_d_privacy (id_privacy);

alter table pslp_r_utente_privacy add constraint fk_pslp_t_utente_03 
    foreign key (id_utente_delegante) references pslp_t_utente (id_utente);

alter table pslp_t_delega add constraint fk_pslp_t_utente_04 
    foreign key (id_utente_delegato) references pslp_t_utente (id_utente);

alter table pslp_t_delega add constraint fk_pslp_t_utente_05 
    foreign key (id_utente_delegante) references pslp_t_utente (id_utente);

alter table pslp_t_delega add constraint fk_pslp_d_tipo_responsabilita_01 
    foreign key (cod_tipo_responsabilita) references pslp_d_tipo_responsabilita (cod_tipo_responsabilita);

alter table pslp_d_messaggio add constraint fk_pslp_d_tipo_messaggio_01 
    foreign key (cod_tipo_messaggio) references pslp_d_tipo_messaggio (cod_tipo_messaggio);


/* ---------------------------------------------------------------------- */
/* Insert decodifiche                                                     */
/* ---------------------------------------------------------------------- */

SET client_encoding = 'UTF8'; 

insert into pslp_d_ruolo (id_ruolo,ds_ruolo,nome_ruolo) 
values
  (0,'CIT','Cittadino'),
  (1,'SUPERUSER','Utente di sistema'),
  (2,'APL','Agenzia Piemonte Lavoro'),
  (3,'APL Master','Agenzia Piemonte Lavoro: Master'),
  (7,'ContCent','Contact Center');

insert into pslp_d_funzione (id_funzione,titolo_funzione,sottotitolo_funzione,icona_funzione,ds_note_funzione,ordinamento,flg_attiva) 
values
  (1,'Gestione privacy e deleghe','<p>Informativa e autorizzazione al trattamento dei tuoi dati personali e dei dati come responsabile di minori o delegato di un maggiorenne.</p>','shield.png',NULL,1,'S'),
  (2,'Fascicolo cittadino','<p>Vuoi Inserire o modificare i dati del <strong>tuo Fascicolo Personale</strong> ?</p>','fascicolo.png',NULL,2,'S'),
  (3,'Dichiarazione immediata disponibilità','<p>Sei disoccupato/a o hai ricevuto una comunicazione di licenziamento?</p>','did.png',NULL,3,'S'),
  (4,'Incontro Domanda Offerta','Incontro domanda offerta','incontro.png',NULL,4,'S'),
  (5,'Documenti','<p>Vuoi Inserire o verificare le tue  <strong>richieste di documentazione</strong> ?</p>','documenti.png',NULL,5,'S');

insert into pslp_r_ruolo_funzione (id_ruolo,id_funzione,d_inizio,d_fine,flg_write) 
values
  (0,1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (0,2,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (0,3,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (0,4,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (0,5,TIMESTAMP '2025-01-02 00:00:00.000',NULL,'S'),
  (1,1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (1,2,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (1,3,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (1,4,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (1,5,TIMESTAMP '2025-01-02 00:00:00.000',NULL,'S'),
  (2,1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (2,2,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (2,3,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (2,4,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (2,5,TIMESTAMP '2025-01-02 00:00:00.000',NULL,'S'),
  (3,1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (3,2,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (3,3,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (3,4,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (3,5,TIMESTAMP '2025-01-02 00:00:00.000',NULL,'S'),
  (7,4,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'S'),
  (7,2,TIMESTAMP '2025-07-01 00:00:00.000',NULL,'S');

insert into pslp_d_privacy (id_privacy,cod_privacy,ds_testata,ds_sunto,ds_dettaglio,id_funzione,d_inizio,d_fine,desc_privacy) 
values
  (1,'PRV','<p align="center"><span style="font-size: xx-large;"><strong style="font-size: x-large;">Presa visione della Privacy per Fascicolo</strong></span></p>
<p align="center"></p>','<p style="text-align: left;" align="center"><strong>Informativa generale</strong></p>
<p>La gestione dei dati del portale Servizi Lavoro Piemonte avviene secondo le disposizioni previste dal D.P.R. 28 dicembre 2000, n. 445, "Testo unico delle disposizioni legislative regolamentari in materia di documentazione amministrativa" e ss.mm.ii.</p>
<p></p>','<p style="text-align: left;" align="center"><strong>Informativa sul trattamento dei dati personali ad uso dei responsabili esterni, ai sensi dell''art. 13 e 14 GDPR 2016/679</strong></p>
<p></p>
<p>Gentile Utente,</p>
<p>La informiamo che i dati personali da Lei forniti alla Direzione Coesione sociale della Regione Piemonte o acquisiti tramite altri sistemi informativi della Pubblica Amministrazione (Sistema delle Comunicazioni Obbligatorie, Sistemi Informativi Lavoro, ecc.), saranno trattati secondo quanto previsto dal "Regolamento (UE) 2016/679 relativo alla protezione delle persone fisiche con riguardo al trattamento dei dati personali, nonche'' alla libera circolazione di tali dati e che abroga la direttiva 95/46/CE (Regolamento Generale sulla Protezione dei Dati, di seguito GDPR)".</p>
<p></p>
<p>La informiamo, inoltre, che:</p>
<ul>
<li>- I dati personali a Lei riferiti verranno raccolti e trattati nel rispetto dei principi di correttezza, liceita'' e tutela della riservatezza, con modalit'' informatiche ed esclusivamente nell''ambito dell''erogazione dei servizi di politica del lavoro. Il trattamento e'' finalizzato all''espletamento delle funzioni istituzionali definite nella normativa di riferimento (Regolamenti UE n. 1303/2013, n. 1304/2013 del Parlamento Europeo e del Consiglio del 17 dicembre 2013, Decisione C (2014) 4969 della Commissione Europea e ss.mm.ii.; D.Lgs. 150/15, D.Lgs. 4/2019, D.Lgs 13/2013 e ss.mm.ii; L.R. 34/2008, L.R. 63/1995 e ss.mm.ii.);</li>
<li>- I dati acquisiti a seguito della presente informativa saranno utilizzati esclusivamente per le finalita'' relative alle politiche per le quali vengono comunicati;</li>
<li>- L''acquisizione dei Suoi dati ed il relativo trattamento sono obbligatori in relazione alle finalita'' sopradescritte; ne consegue che l''eventuale rifiuto a fornirli potra'' determinare l''impossibilita'' del Titolare del trattamento di erogare il servizio richiesto;</li>
<li>- I dati di contatto del Responsabile della protezione dati (DPO) sono: <a href="mailto:dpo@regione.piemonte.it">dpo@regione.piemonte.it</a>;</li>
<li>- Il Titolare del trattamento dei dati personali e'' la Giunta regionale, il Delegato al trattamento dei dati e'' il Direttore "pro tempore" della Direzione Coesione Sociale della Regione Piemonte;</li>
<li>- Il Responsabile (esterno) del trattamento e'':
<ul>
<li>_ il Consorzio per il Sistema Informativo Piemonte (CSI), ente strumentale della Regione Piemonte, pec: <a href="mailto:protocollo@cert.csi.it">protocollo@cert.csi.it</a>;</li>
</ul>
</li>
<li>- I suoi dati personali saranno trattati esclusivamente da soggetti incaricati e Responsabili (esterni) individuati dal Titolare o da soggetti incaricati individuati dal Responsabile (esterno), autorizzati ed istruiti in tal senso, adottando tutte quelle misure tecniche ed organizzative adeguate per tutelare i diritti, le liberta'' e i legittimi interessi che Le sono riconosciuti per legge in qualita'' di Interessato;</li>
<li>- I Suoi dati, resi anonimi, potranno essere utilizzati anche per finalita'' statistiche (D.Lgs. 281/1999 e s.m.i.);</li>
<li>- I Suoi dati personali sono conservati per il periodo di 10 anni a partire dalla chiusura delle attivita'' connesse alle finalita'' per i quali sono stati conseguiti, salvo i casi in cui la conservazione dei dati sia richiesta da norme di legge od altri fini (contabili, fiscali, di conservazione di attestazioni e certificati, ecc.);</li>
<li>- I Suoi dati personali non saranno in alcun modo oggetto di trasferimento in un Paese terzo extraeuropeo, ne'' di comunicazione a terzi fuori dai casi previsti dalla normativa in vigore;</li>
<li>- I Suoi dati personali non saranno in alcun modo oggetto di trasferimento in un Paese terzo extraeuropeo, ne'' di comunicazione a terzi fuori dai casi previsti dalla normativa in vigore;</li>
<li>- I Suoi dati personali saranno oggetto di processi decisionali automatizzati, compresa la profilazione, per conoscere il suo livello personale di occupabilita'', cosi'' come stabilito dal D.lgs. 150/2015 Art. 19, ovvero la sua distanza dal mercato del lavoro, per poterle offrire servizi di accompagnamento e inserimento nel mercato del lavoro, in base alle sue specifiche caratteristiche, secondo quanto previsto dal Decreto Direttoriale del Ministero del Lavoro e Politiche Sociali - Direzione Generale per le Politiche Attive, i Servizi per il Lavoro e la Formazione, nr. 10 del 23 gennaio 2015;</li>
<li>- I Suoi dati personali potranno essere comunicati ai seguenti soggetti:
<ul>
<li>_ Autorita'' con finalita'' ispettive o di vigilanza o Autorita'' giudiziaria nei casi previsti dalla legge;</li>
<li>_ ANPAL, Divisione 3 - Autorita'' di gestione della Misura; Ministero del lavoro e delle politiche sociali, Segretariato Generale - Autorita'' di Audit della Misura; ANPAL, Divisione 6 - Autorita'' di Certificazione della Misura;</li>
<li>_ Autorita'' di Audit e di Certificazione del POR FSE 2014-2020 della Regione Piemonte;</li>
<li>_ Soggetti pubblici, in attuazione delle proprie funzioni previste per legge (ad es. in adempimento degli obblighi di certificazione o in attuazione del principio di leale cooperazione istituzionale, ai sensi dell''art. 22, c. 5 della L. 241/1990);</li>
<li>_ Altre Direzioni/Settori della Regione Piemonte per gli adempimenti di legge o per lo svolgimento delle attivita'' istituzionali di competenza.</li>
</ul>
</li>
</ul>
<p>Si precisa che, con riferimento ai file temporanei o permanenti di sessione (cookies) non viene fatto uso di cookies per la trasmissione di informazioni di carattere personale.</p>
<p>Ogni Interessato potra''esercitare i diritti previsti dagli artt. da 15 a 22 del Regolamento (UE) 2016/679, quali: la conferma dell''esistenza o meno dei suoi dati personali e la loro messa a disposizione in forma intellegibile; avere la conoscenza delle finalita'' su cui si basa il trattamento; ottenere la cancellazione, la trasformazione in forma anonima, la limitazione o il blocco dei dati trattati in violazione di legge, nonche'' l''aggiornamento, la rettifica o, se vi e'' interesse, l''integrazione dei dati; opporsi, per motivi legittimi, al trattamento stesso, rivolgendosi al Titolare, al Responsabile della protezione dati (DPO) o al Responsabile del trattamento, tramite i contatti di cui sopra o il diritto di proporre reclamo all''Autorita'' di controllo competente.</p>',2,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'Privacy Fascicolo'),
  (2,'PRV_MIN','<p align="center"><span style="font-size: xx-large;"><strong style="font-size: x-large;">Presa visione della Privacy sulla responsabilita'' genitoriale per Fascicolo</strong></span></p>
<p align="center"></p>','<p style="text-align: left;" align="center"><strong>Informativa generale</strong></p>
<p>La compilazione del presente modulo rientra nelle responsabilita'' genitoriali regolamentate dal codice civile (Titolo IX Della responsabilita''  genitoriale e dei diritti e doveri del figlio), ove si prevede - salvo non diversamente stabilito - che le decisioni di maggiore interesse per i figli siano esercitate da entrambi i genitori.</p>
<p></p>','',1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'Privacy Minori'),
  (3,'PRV_MAG','<p align="center"><span style="font-size: xx-large;"><strong style="font-size: x-large;">Presa visione della Privacy sulla delega di un maggiorenne per Fascicolo</strong></span></p>
<p align="center"></p>','<p style="text-align: left;" align="center"><strong>Informativa generale</strong></p>
<p><strong> > > >   IN ATTESA DEL TESTO DA PROPORRE   < < < </strong></p>
<p></p>','',1,TIMESTAMP '2024-01-04 00:00:00.000',NULL,'Privacy Maggiorenni');

insert into pslp_d_tipo_responsabilita (cod_tipo_responsabilita,descr_tipo_responsabilita,flg_minorenne,d_inizio,d_fine) 
values
  ('TUT','Tutore','S',TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  ('GEN','Genitore','S',TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  ('DEL','Delegato',NULL,TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  ('AFF','Affidatario','S',TIMESTAMP '2024-01-01 00:00:00.000',NULL);

insert into pslp_d_parametro (id_parametro,cod_parametro,descr_parametro,valore_parametro,valore_parametro_ext,d_inizio,d_fine) 
values
  (1,'PSLP_DISP','Applicazione disponibile. Assume valore S o N.','S',NULL,TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  (2,'DOMIC_PIEMONTE_FLG','Fascicolo: indica se il Domicilio della SAP deve essere obbligatoriamente in Piemonte. Assume valore S o N.','S',NULL,TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  (3,'MINORE_ETA','Fascicolo - Minore: eta'' minima per inserire la SAP','0',NULL,TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  (4,'MINORE_ETA_ESP_LAV','Fascicolo - Minore: eta'' minima per inserire Esperienza di Lavoro SAP','15',NULL,TIMESTAMP '2024-01-01 00:00:00.000',NULL),
  (5,'GG_DELE','Numero di giorni di validità di una delega ','30',NULL,TIMESTAMP '2023-04-04 00:00:00.000',NULL),
  (6,'DATA_COM_ESP_LAV','Data comunicazione entro la quale visualizzare rapporti di lavoro ','2008/03/01',NULL,TIMESTAMP '2023-04-04 00:00:00.000',NULL),
  (7,'GG_DID','Intervallo entro il quale non deve esserci una DID INPS','180',NULL,TIMESTAMP '2023-04-04 00:00:00.000',NULL);

insert into pslp_d_tipo_messaggio (cod_tipo_messaggio,descr_tipo_messaggio) 
values
  ('E','Errore'),
  ('W','Warning'),
  ('S','Successo'),
  ('T','Tooltip campo'),
  ('V','Validator campo inline'),
  ('C','Conferma'),
  ('I','Info');

insert into pslp_d_messaggio (id_messaggio,cod_messaggio,descr_messaggio,cod_tipo_messaggio,intestazione,testo,d_inizio,d_fine) 
values
  (1,'I1','Accesso','I','Benvenuto nel Portale Servizi al Lavoro della Regione Piemonte (PSLP)','<p style="text-align: center;"><span style="font-size: medium;"><strong>Benvenuto nel Portale Servizi al Lavoro&nbsp;della regione Piemonte (PSLP).</strong></span></p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (2,'I2','Privacy Fascicolo','I','Presa visione della Privacy per Fascicolo','Informativa generale. La gestione dei dati del portale ...',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (3,'E1','Certificato non valido','E',NULL,'Il certificato selezionato non è valido ',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (4,'E2','Applicativo non disponibile','E',NULL,'Applicativo non disponibile',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (5,'E3','CF senza profili','E',NULL,'Si informa che per il proprio codice fiscale non si riscontrano profili associati, utili per operare sul sistema. Per le procedure di accreditamento, consultare la Guida Accreditamento.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (6,'E4','Autenticazione fallita','E',NULL,'Autenticazione Fallita. Ti invitiamo a riprovare.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (7,'C1','Eliminazione delega','C',NULL,'Vuoi eliminare la delega?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (8,'E5','Verifica CF minorenne','E',NULL,'Il codice fiscale non corrisponde ad un minorenne',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (9,'E6','Verifica CF maggiorenne','E',NULL,'Il codice fiscale non corrisponde ad un maggiorenne',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (10,'E7','Non esiste il CF su SILP e su MSLP','E','','Il soggetto {COGNOME}  {NOME}  ({CODICE FISCALE} ) NON RISULTA CORRETTAMENTE CENSITO. PER PROSEGUIRE CON L''OPERATIVITÀ, È NECESSARIO CONTATTARE IL CENTRO PER L''IMPIEGO DI COMPETENZA',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (11,'E8','Mancanza numero di cellulare','E',NULL,'Il soggetto {Cognome}  {Nome}  ({codice fiscale} ) non risulta correttamente censito. Per proseguire con l''operatività, è necessario contattare il Centro per l''Impiego di competenza',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (12,'E9','Mancata ricezione OTP','E',NULL,'I dati non sono corretti, si prega di contattare il CPI di competenza.”',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (13,'C2','Conferma operare per delegante','C',NULL,'VUOI OPERARE PER IL SOGGETTO SELEZIONATO?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (14,'E10','OTP errato','E',NULL,'IL CODICE OTP NON E’ CORRETTO',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (15,'E15','Soggetto non domiciliato in Piemonte','E',NULL,'Non è possibile inserire la DID per {COGNOME}  {NOME}  ({CODICE FISCALE} )perché non domiciliato in Piemonte',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (16,'E11','Mancanza di rapporti di lavoro aperti','E',NULL,'Non è possibile inserire la DID per {COGNOME}  {NOME}  ({CODICE FISCALE} ) perché  sono presenti rapporti di lavoro aperti',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (17,'E12','E'' presente una DID aperta','E',NULL,'Non è possibile inserire la DID per {COGNOME}  {NOME}  ({CODICE FISCALE} ), in quanto è presente una DID aperta, con  data {data DID} in stato {Stato DID}  dal   {data stato DID} ',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (18,'E13','E'' presente una politica A02 aperta con tipo progetto DID','E',NULL,'Non è possibile inserire la DID per  {COGNOME}  {NOME}  ({CODICE FISCALE} ), in quanto è in essere una politica attiva. (Patto di attivazione). Si consiglia di contattare il centro per l’impiego.”',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (19,'E14','Soggetto di età < 15 anni','E',NULL,'Non è possibile inserire la DID per  {COGNOME}  {NOME}  ({CODICE FISCALE} ), in quanto il cittadino deve avere almeno 15 anni.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (20,'E18','DID sospesa','E',NULL,'Per proseguire con l''operatività, è necessario contattare il Centro per l''Impiego di competenza.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (21,'E16','Rapporti di lavoro in corso','E',NULL,'Risultano dei rapporti di lavoro in corso. Non è permesso di inserire la DID. Se questa situazione non corrisponde alla tua reale condizione, ti invitiamo a contattare il CpI di competenza (in base al proprio domicilio',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (22,'E17','Comunicazioni obbligatorie non prese in carico','E',NULL,'Risultano delle comunicazioni obbligatorie che non state presa in carico da CPI. Non è permesso di inserire la DID. Se questa situazione non corrisponde alla tua reale condizione, ti invitiamo a contattare il CpI di competenza (in base al proprio domicilio',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (23,'E19','Dati con silp disallineati ','E',NULL,'Per proseguire con l''operatività, è necessario contattare il Centro per l''Impiego di competenza.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (24,'I3','Privacy minori','I','Privacy minori','<p align="center"><span style="font-size: xx-large;"><strong style="font-size: x-large;">Presa visione della Privacy sulla responsabilita'' genitoriale per  Fascicolo</strong></span></p>
<p align="center">&nbsp;</p>
<p style="text-align: left;" align="center"><strong>Informativa generale<br /></strong></p>
<p>La compilazione del presente modulo rientra nelle responsabilita'' genitoriali regolamentate dal codice civile (Titolo IX Della responsabilita''  genitoriale e dei diritti e doveri del figlio), ove si prevede - salvo non diversamente stabilito &ndash; che le decisioni di maggiore interesse per i figli siano esercitate da entrambi i genitori.</p>
<p>&nbsp;</p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (25,'E20','Delegante già presente','E',NULL,'Questa delega è già presente!',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (26,'I4','Riepilogo Fascicolo','I','Riepilogo Fascicolo','<p class="InfoBlue"> Il fascicolo contiene i tuoi dati anagrafici, amministrativi, lavorativi e curriculari.</p><p> Se hai attivato le deleghe e confermato la privacy potrai inserire e aggiornare le stesse informazioni in nome e per conto dei soggetti di cui hai attivato la delega e confermato la specifica privacy </strong>.</p><p> Per accedere ai dati del fascicolo dei soggetti di cui hai la delega accedi a Gestione privacy e deleghe e dopo aver selezionato la delega attraverso la funzione seleziona la delega, disponibile in corrispondenza della colonna azioni accedi al fascicolo, accedi al fascicolo.</p><p> Per aggiungere un soggetto minorenne o maggiorenne alle proprie deleghe attiva il pulsante Aggiungi Minore o Aggiungi Maggiorenne.</p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (27,'E21','Errore generico','E',NULL,'<p>Si sono verificati dei problemi che non permettono di proseguire con l''operativita''.</p>
<p>Per poter operare con la funzionalita'', e'' necessario contattare il Centro per l''Impiego di competenza.</p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (28,'E22','Fascicolo non presente','E',NULL,'Non è presente un fascicolo. Non è possibile inserire la DID.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (29,'E23','Codice Fiscale incongruente con nome e cognome','E','','Il Codice Fiscale è incongruente con nome e cognome',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (30,'E24','Dati disallineati con SILP','E',NULL,'Non è possibile accedere alle funzionalità della Piattaforma Servizi Lavoro Piemonte. Contattare il CpI di riferimento indicando errore sull’identificativo lavoratore',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (31,'I5','Riepilogo CV','I','Gestione Curriculum Vitae','Crea il tuo CV personalizzato utilizzando i dati memorizzati all’interno del fascicolo. <p><p>Puoi creare un CV in automatico in base ai tuoi dati. <p><p>Il CV è composto da un insieme di sezioni: Dati generali, Dati anagrafici, Esperienze di lavoro, Istruzione, Formazione professionale, Conoscenze linguistiche, Abilitazioni/Patenti, Ulteriori informazioni, Professione desiderata, Riepilogo. <p><p>Gli stati di un CV possono assumere uno tra i seguenti stati: bozza, valido, scaduto, annullato. <p><p>La validità del CV è di 12 mesi dalla data dell’ultimo aggiornamento, ad eccezione di quelli delle persone iscritte alla L. 68/99 art. 1, che non scadono mai.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (32,'E26','Errore di sistema','E',NULL,'I servizi non sono momentaneamente disponibili. Riprovare più tardi o contattare l''amministratore di sistema',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (33,'T1','SMS Codice OTP','T',NULL,'Digitare  {codice}   per autorizzare il delegato ',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (34,'E27','Iscrizione collocamento mirato','E',NULL,'Non è possibile inserire la DID perchè iscritto al collocamento mirato',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (35,'I6','IDO','I','','Il cittadino può accedere alla funzionalità di  Gestione del Curriculum Vitae, di Consultazione annunci, di Ricerca personale per assistenza familiare e visualizzare le sue candidature',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (36,'I7','Curriculum Vitae','I',NULL,'Gestisci il tuo Curriculum',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (37,'I8','Consulta Annunci','I','Annunci','Vuoi rispondere ad un annuncio di ricerca personale?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (38,'C3','Cancella CV','C',NULL,'Vuoi eliminare il CV ?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (39,'E28','Collocamento mirato in provincia diversa ','E',NULL,'Il cittadino {COGNOME}  {NOME}  {CODICE FISCALE} risulta iscritto al collocamento mirato nella provincia di {PROVINCIA}.  Non è possibile variare il comune di domicilio in una provincia diversa da quella dell’iscrizione.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (40,'I9','Nuovo soggetto','I',NULL,'Il soggetto non è presente. Inserire  Nome e Cognome',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (41,'I10','Stampa CV','I',NULL,'Autorizzo il trattamento dei miei dati personali presenti nel cv ai sensi del Decreto Legislativo 30 giugno 2003, n. 196 “Codice in materia di protezione dei dati personali” e del GDPR (Regolamento UE 2016/679).',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (42,'E29','Fascicolo non presente ','E',NULL,'Non è presente un fascicolo. Non è possibile inserire il CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (43,'I11','Gestione Privacy e Deleghe','I',NULL,'<p class="InfoBlue"> Benvenuto nel Portale Servizi al Lavoro della regione Piemonte (PSLP).</p><p>Per accedere ai servizi offerti dalla piattaforma, al primo accesso, prendi visione dell’informativa sulla privacy. </p><p>Solo dopo aver fornito il tuo consenso potrai accedere ai servizi attivi. <p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (44,'.','Gestione Deleghe','I',NULL,'<p class="InfoBlue"> Presentazione</p><p>Attraverso le deleghe puoi accedere ai servizi per conto di Minori dei quali hai la responsabilità come genitore, affidatario o tutore oppure di un soggetto maggiorenne di cui avrai richiesto la delega. </p><p>Anche per le persone di cui hai la delega viene richiesta la presa visione della Privacy, quindi prima di accedere ai servizi, conferma la presa visione sulla Privacy; solo avendola fornita, potrai accedere ai servizi a loro nome.<p>',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (45,'I13','Gestione Dichiarazione Immediata Disponibilita'' (DID)','I','Gestione Dichiarazione Immediata Disponibilita'' (DID)','Se sei disoccupato  puoi presentare la Dichiarazione di Immediata disponibilità (DID) e accedere ai servizi di politica attiva del lavoro offerti dai CpI e dalla rete degli Operatori accreditati.<br>Per richiedere la DID non devono risultare rapporti di lavoro aperti. Se al contrario, esistono rapporti di lavoro in essere ma hai ricevuto una lettera di licenziamento, recati presso il tuo CpI di competenza.<br>Quando non esiste la DID oppure è in Stato Revocata o Annullata,  potrai inserire una DID mediante il pulsante NUOVA DID.<br>Se invece la DID è già Inserita o Confermata non potrai inserirne una nuova.<br>Il tasto STAMPA ATTESTATO ISCRIZIONE ti permette di generare e scaricare il documento che certifica la tua condizione di disoccupato, ed è attivo  quando lo Stato della DID è INSERITA o CONFERMATA.<br> Prima di attivare l''inserimento della DID, è necessario confermare la Privacy che trovi nella relativa sezione. ',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (46,'I14','Inserimento','I',NULL,'Dati inseriti correttamente',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (47,'I15','Eliminazione','I',NULL,'Eliminazione avvenuta con successo ...',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (48,'I16','Modifica','I',NULL,'Dati modificati correttamente',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (49,'E30','DID non stampabile','E',NULL,'La situazione della DID non permette di stampare l''Attestato di disoccupazione',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (50,'E31','Cellulare non presente','E',NULL,'Manca il numero di cellulare',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (51,'E32','Non domiciliato in Piemonte','E',NULL,'Il soggetto non è domiciliato in Piemonte. Non è possibile inserire il CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (52,'I17','Appartenente alle categorie di persone con disabilità (L.68/99)','I',NULL,'Appartenente alle categorie di persone con disabilità (L.68/99)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (53,'I18','Autorizzo il trattamento dei miei dati personali','I',NULL,'Autorizzo il trattamento dei miei dati personali presenti nel cv ai sensi del Decreto Legislativo 30 giugno 2003, n. 196 “Codice in materia di protezione dei dati personali” e del GDPR (Regolamento UE 2016/679).',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (54,'E33','DID non inseribile','E',NULL,'Non è possibile inserire la DID',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (55,'C4','CV Validato','C',NULL,'Il CV è stato validato',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (56,'I19','No dati per CV','I',NULL,'Non si sono nuovi dati nel fascicolo da riportare nel CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (57,'I20','Esp. prof. no CV','I',NULL,'ELENCO ESPERIENZE PROFESSIONALI ESTRATTE DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (58,'I21','Rapp. Lav.CV','I',NULL,'ELENCO RAPPORTI DI LAVORO DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (59,'I22','Tit. Studio no CV','I',NULL,'ELENCO TITOLI DI STUDIO ESTRATTI DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (60,'I23','Tit. Studio CV','I',NULL,'ELENCO TITOLI DI STUDIO DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (61,'I24','Corsi no CV ','I',NULL,'ELENCO CORSI DI FORMAZIONE ESTRATTI DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (62,'I25','Corsi CV ','I',NULL,'ELENCO CORSI DI FORMAZIONE DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (63,'I26','Lingue no CV','I',NULL,'ELENCO CONOSCENZE LINGUISTICHE ESTRATTE DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (64,'I27','Lingue CV ','I',NULL,'ELENCO CONOSCENZE LINGUISTICHE DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (65,'I28','Con. Info no CV ','I',NULL,'ELENCO CONOSCENZE INFORMATICHE ESTRATTE DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (66,'I29','Con. Info  CV ','I',NULL,'ELENCO CONOSCENZE INFORMATICHE DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (67,'I30','Patenti no CV ','I',NULL,'ELENCO PATENTI ESTRATTE DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (68,'I31','Patenti CV ','I',NULL,'ELENCO PATENTI DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (69,'I32','Patentini no CV ','I',NULL,'ELENCO PATENTINI ESTRATTI DAL FASCICOLO (Non presenti nel CV)',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (70,'I33','Albi no CV ','I',NULL,'ELENCO ALBI ESTRATTI DAL FASCICOLO (Non presenti nel CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (71,'I34','Albi  CV ','I',NULL,'ELENCO ALBI DA INSERIRE nel CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (72,'I35','Ult. Info no CV ','I',NULL,'ULTERIORI INFORMAZIONI',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (73,'I36','Prof. Des. ','I',NULL,'PROFESSIONE DESIDERATA',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (74,'I37','Patentini CV. ','I',NULL,'ELENCO PATENTINI DA INSERIRE NEL CV',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (75,'I38','Mancanza professione desiderata ','I',NULL,'Per poter procedere con la validazione è necessario inserire almeno una professione desiderata. ',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (76,'C5','Conferma validazione CV','C',NULL,'Sei sicuro di voler validare questo curriculum?''',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (77,'I39','Duplicazione CV','I',NULL,'Il CV era stato validato e la modifica ha prodotto la duplicazione del CV. L’eliminazione di una o più informazioni presenti anche nel fascicolo, dovranno essere eliminate anche dal fascicolo se non più valide.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (79,'C6','Conferma ','C','','Si conferma il salvataggio dei dati ?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (80,'C7','Eliminazione','C',NULL,'Confermi l''eliminazione?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (81,'C8','Inserimento DID','C',NULL,'Si vuole procedere con l''inserimento DID per il cittadino  {COGNOME}  {NOME}  ({CODICE FISCALE} ) ?',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (82,'E34','Patto attivazione di regione diversa da domicilio','E',NULL,'"E’ in corso un patto di attivazione presso una regione diversa da quella del domicilio. Si consiglia di contattare il CPI di competenza',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (83,'E35','Impossibilità variare comune domicilio  in provincia diversa da collocamento mirato','E',NULL,'Il cittadino {COGNOME} {NOME} ({CODICEFISCALE})  risulta iscritto al collocamento mirato nella provincia di {PROVINCIA} . Non è possibile variare il comune di domicilio in una provincia diversa da quella dell’iscrizione.',TIMESTAMP '2024-01-05 00:00:00.000',NULL),
  (85,'I40','Richieste di documentazione','I',NULL,'il servizio ti permette di richiedere al Centro per l’Impiego il rilascio di alcuni documenti, tra cui lo stato di disoccupazione e l’elenco dei rapporti di lavoro disponibile sui sistemi regionali e sulla banca dati Ministeriale.
Per ogni documento richiesto visualizzerai la data di emissione, il tipo di documentazione richiesta, lo stato della richiesta, la data di aggiornamento dello stato e le azioni possibili.
I documenti autorizzati potranno essere visualizzati e scaricati in qualsiasi momento.
Per ogni richiesta riceverai una notifica via mail e app IO con l’esito.',TIMESTAMP '2025-03-01 00:00:00.000',NULL),
  (86,'E36','Soggetto non domiciliato in Piemonte','E',NULL,'Il soggetto non è domiciliato in Piemonte. Non è possibile inviare la richiesta',TIMESTAMP '2025-03-01 00:00:00.000',NULL),
  (87,'I41','Documentazione stampabile','I',NULL,'La documentazione richiesta è stampabile',TIMESTAMP '2025-04-01 00:00:00.000',NULL),
  (88,'E37','Fascicolo non presente','E',NULL,'Non è presente un fascicolo. Non è possibile richiedere documentazione',TIMESTAMP '2025-05-01 00:00:00.000',NULL),
  (89,'I42','Gestione agende appuntamenti','I','Inserimento prenotazione','Inserimento di una prenotazione da parte del cittadino/Contact Center',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (90,'I43','Gestione agende appuntamenti','I','Spostamento prenotazione','Spostamento di una prenotazione da parte del cittadino/Contact Center',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (91,'I44','Gestione agende appuntamenti','I','Visualizzazione prenotazione','Visualizzazione di una prenotazione da parte del cittadino/Contact Center',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (92,'I45','Gestione agende appuntamenti','I','Ricerca prenotazioni','Ricerca prenotazioni da parte del cittadino/Contact Center',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (93,'I46','Prenotazione: confermi inserimento ?','I','Prenotazione: confermi inserimento ?','<p>Premendo <strong>SI</strong>, il sistema procede con l''<strong>inserimento prenotazione</strong> del <strong>Servizio {0}</strong>, in <strong>data {1} ed ora {2}</strong>, con <strong>modalita'' di erogazione {3)</strong>.</p>
{4}
{5}
<p>Inoltre, il sistema inviera'' al cittadino: {6}.</p>
<p></p>
<p>Mentre, con <strong>NO</strong>, rimane nella pagina, per eventualmente modificare i dati o uscire, senza procedere con inserimento.</p>
<p></p>
<p>Si desidera quindi confermare l''operazione con <strong>SI</strong>? </p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (94,'I47','Prenotazione: confermi inserimento prenotazione? [Usato in ID msg I46/I49/I50 per place holder {4}]','I',NULL,'<p>L''indirizzo dell''incontro e'' presso: {0}</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (95,'I48','Prenotazione: confermi inserimento prenotazione? [Usato in ID msg I46/I49/I50 per place holder {5}]','I',NULL,'<p>E per raggiungere la sede dell''incontro: {0}</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (96,'I49','Prenotazione: confermi spostamento ?','I','Prenotazione: confermi spostamento ?','<p>Premendo <strong>SI</strong>, il sistema procede con lo <strong>spostamento prenotazione</strong> del <strong>Servizio {0}</strong>, in <strong>data {1} ed ora {2}</strong>, con <strong>modalita'' di erogazione {3)</strong>.</p>
{4}
{5}
<p>Inoltre, il sistema inviera'' al cittadino: {6}.</p>
<p></p>
<p>Mentre, con <strong>NO</strong>, rimane nella pagina, per eventualmente modificare i dati o uscire, senza procedere con lo spostamento.</p>
<p></p>
<p>Si desidera quindi confermare l''operazione con <strong>SI</strong>? </p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (97,'I50','Prenotazione: confermi annullamento ?','I','Prenotazione: confermi annullamento ?','<p>Premendo <strong>SI</strong>, il sistema procede con l''<strong>annulamento prenotazione</strong> del <strong>Servizio {0}</strong>, in <strong>data {1} ed ora {2}</strong>, con <strong>modalita'' di erogazione {3)</strong>.</p>
{4}
<p>Inoltre, il sistema inviera'' al cittadino: {6}.</p>
<p></p>
<p>Mentre, con <strong>NO</strong>, rimane nella pagina, per eventualmente modificare i dati o uscire, senza procedere con l''annullamento.</p>
<p></p>
<p>Si desidera quindi confermare l''operazione con <strong>SI</strong>? </p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (98,'I51','Prenotazione: confermi l''uscita dalla funzione ?','I','Prenotazione: confermi l''uscita dalla funzione ?','<p>Premendo <strong>SI</strong>, il sistema procede con l''<strong>uscita dalla funzione corrente senza salvare i dati.</strong>Tutti i dati digitati verranno persi. Si vuole procedere ?</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (99,'I52','Gestione agende appuntamenti','I','Prenotazione: mancanza di disponibilita''','<p>Non sono state riscontrate date disponibili alla prenotazione del servizio {0}, in base ai filtri di ricerca indicati.</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (100,'I53','Gestione agende appuntamenti','I','Prenotazione: mancanza di disponibilita''','<p>Non sono stati individuati operatori disponibili in data {0} ore {1} alla prenotazione del servizio {2}, in base ai filtri di ricerca indicati.</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (101,'E38','Gestione agende appuntamenti','E','Prenotazione: disponibilita'' nel frattempo prenotata','<p>Attenzione: non e'' piu'' possibile procedere con la prenotazione del Servizio {0}, con data {1}, orario {2}, presso il Centro per l''Impiego selezionato, in quanto la disponibilita'' e'' stata nel frattempo prenotata per un altro cittadino.</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (102,'E39','Gestione agende appuntamenti','E','Prenotazione: sovrapposizione di data ed orario','<p>Attenzione: non e'' possibile procedere con la prenotazione del Servizio {0}, con data {1} ed orario {2}, in quanto risulta sovrapposta ad una precedente prenotazione, ancora da erogare.</p>
<p>Si consiglia di cambiare data o orario della prenotazione.</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (103,'E40','Gestione agende appuntamenti','E','Prenotazione: esiste una prenotazione da erogare per lo stesso Servizio','<p>Attenzione: non e'' possibile procedere con la prenotazione del Servizio {0}, con data {1} ed orario {2}, in quanto esiste una precedente prenotazione, per il medesimo Servizio, ancora da erogare.</p>',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (104,'E41','Gestione agende appuntamenti','E','Prenotazione: cittadino con vincoli','Attenzione, non e'' possibile prenotare, in quanto sono presenti delle anomalie sul cittadino per il servizio selezionato.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (105,'E42','Gestione agende appuntamenti','E','Prenotazione non permessa','Attenzione, non e'' possibile prenotare, il cittadino non e'' domiciliato in Piemonte.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (106,'E43','Gestione agende appuntamenti','E','Prenotazione non permessa','Attenzione, non e'' possibile prenotare, il cittadino ha eta'' inferiore a 15 anni.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (107,'E44','Gestione agende appuntamenti','E','Prenotazione non permessa','Attenzione, non e'' possibile prenotare, il cittadino ha 15 anni ma non ha terminato l''obbligo formativo.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (108,'T2','Gestione agende appuntamenti','T','Prenotazione: Modalita'' erogazione','Attenzione per fruire del servizio è necessario disporre di un dispositivo adatto per videoconferenza (smartphone, tablet, pc)',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (109,'E45','Gestione agende appuntamenti','E','Prenotazione non permessa','Attenzione, non e'' possibile prenotare, il cittadino presenta un profilo mancante del numero di cellulare e/o indirizzo email, il sistema non puo'' inviargli comunicazioni.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (111,'I55','Intestazione IDO Annunci','I','Consultazione annunci','Il cittadino può consultare gli annunci e candidarsi',TIMESTAMP '2025-06-01 00:00:00.000',NULL),
  (112,'I54','Gestione agende appuntamenti','I','Ricerca Prenotazione','Per i criteri di ricerca inseriti non sono state reperite prenotazioni.Ripetere la ricerca cambiando i criteri.',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (113,'E46','Non sei autenticato','E','Non sei autenticato','Per procedere alla candidatura devi essere autenticato. Verrai reindirizzato alla pagina di autenticazione',TIMESTAMP '2025-06-13 00:00:00.000',NULL),
  (114,'I56','Intestazione IDO Annunci','I','Intestazione IDO Annunci Profili','Il cittadino può consultare gli annunci ricercandoli per profilo e candidarsi',TIMESTAMP '2025-06-30 00:00:00.000',NULL),
  (115,'I57','Intestazione IDO Annunci','I','Intestazione IDO Annunci Eures','Il cittadino può consultare gli annunci Eures e candidarsi',TIMESTAMP '2025-06-30 00:00:00.000',NULL),
  (116,'I58','Intestazione IDO Annunci','I','Le mie candidature','Il cittadino può consultare l''elenco degli annunci a cui si è candidato',TIMESTAMP '2025-06-30 00:00:00.000',NULL),
  (117,'I59','Intestazione IDO Annunci','I','Ricerca personale per assistenza familiare','Il cittadino può consultare le candidature di un annuncio di ricerca personale per assistenza familiare',TIMESTAMP '2025-06-30 00:00:00.000',NULL);

SET client_encoding = 'WIN1252'; 

commit;
