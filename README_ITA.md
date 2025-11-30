# Prodotto

PSLP : Piattaforma Servizi Lavoro Piemonte - Versione 3.0

# Contesto dei sistemi informativi del lavoro della Regione Piemonte

Il Sistema regionale Integrato Servizi Lavoro (SISL) in uso presso i Centri per l’impiego della Regione Piemonte è costituito da un insieme coordinato di sistemi informativi che forniscono supporto ai processi gestionali degli Enti e garantiscono l’interscambio delle informazioni tra i diversi attori del Sistema Lavoro.

Le principali componenti del SISL sono SILP, GECO, PRODIS, PSLP e BLP.

SILP è il sistema gestionale dei Servizi per l'impiego (Centri per l'impiego ed enti accreditati), composto da un modello flessibile di servizi finalizzati a:
- accogliere lavoratori e aziende;
- effettuare la profilazione quantitativa dei soggetti in cerca di occupazione;
- valutare il recupero dei giovani in obbligo formativo, inserendoli in uno dei percorsi istituzionali (scuola, formazione, apprendistato);
- supportare la ricollocazione dei soggetti nel mercato del lavoro tramite programmi, progetti, misure, servizi;
- favorire l'incontro domanda/offerta (matching);
- gestire gli adempimenti amministrativi ed il collocamento mirato.

SILP è inoltre integrato con il Sistema Informativo Unitario (SIU) gestito da ANPAL, che ha centralizzato l’invio e l’aggiornamento della Scheda Anagrafico Professionale (SAP) e la relativa DID (Dichiarazione di immediata disponibilità), la gestione del Reddito di Cittadinanza e della Garanzia Giovani attraverso il canale di cooperazione applicativa e i relativi standard in esercizio.

GECO, invece, è il sistema delle Comunicazioni Obbligatorie del Piemonte e garantisce il trattamento delle comunicazioni obbligatorie inviate dalle imprese per l’attivazione, la modifica o la cessazione di un rapporto di lavoro. Tutti i datori di lavoro sono, infatti, obbligati per legge a dichiarare al Ministero del Lavoro e delle Politiche sociali, in via preventiva, tutte le instaurazioni e le modifiche di un rapporto di lavoro.

PRODIS è un applicativo dedicato alla gestione e all’acquisizione dei prospetti informativi su persone disabili e/o appartenenti alle categorie protette.

La Piattaforma Servizi Lavoro Piemonte (PSLP) è raggiungibile tramite il portale regionale PiemonteTu e consente ai cittadini di espletare le pratiche necessarie al riconoscimento dello status di disoccupato, vincolo imprescindibile per accedere alle politiche attive del lavoro e agli sgravi economici che la Pubblica Amministrazione concede alle persone che non superano la soglia di reddito prevista dalla vigente normativa. Oltre alle pratiche relative al conferimento dello Stato di Disoccupazione (DID), sulla Piattaforma sono disponibili i seguenti servizi:

- gestione Fascicolo del Cittadino: consente di inserire/verificare e aggiornare le informazioni anagrafiche e legate al mondo del lavoro in possesso della Pubblica Amministrazione locale (presenti in SILP) e centrale (presenti sul SIU);
- gestione iscrizione alla Politica del lavoro “Garanzia Giovani” e prenotazione del primo incontro di progetto;
- gestione Iscrizione alle liste del collocamento mirato/ altre categorie protette, ex L. 68/99;
- inserimento, da parte della persona con disabilità, dei dati relativi al reddito annuo e alla composizione del nucleo familiare utili al calcolo del punteggio per l’elaborazione della graduatoria disabili.

La Piattaforma è anche predisposta per la gestione della prenotazione per la presa in carico nell’ambito delle politiche relative al Reddito di Cittadinanza.

BLP – Borsa lavoro Piemonte, infine, è una banca dati, che riceve da SILP candidature e vacancies di lavoratori e aziende che si rivolgono ai Centri per l’impiego.

# Descrizione del prodotto

La piattaforma raccoglie vari servizi legati alle tematiche del Lavoro gestite da Regione Piemonte, e costituisce un punto di accesso comune per essi.
Tali servizi possono essere rivolti sia ai cittadini che agli utenti dei Centri per l'impiego.
Attraverso PSLP, infatti l’operatore dei Centri per l’Impiego potrà gestire l’afflusso al CPI mediante la configurazione di calendari, ed eventualmente sostituirsi al cittadino per fissare un appuntamento.
Al cittadino sono resi disponibili diversi servizi specifici: 
- Fascicolo Cittadino: gestione del proprio "fascicolo" (composto di dati presenti nella SAP ANPAL);
- Prenota Appuntamento: per richiedere/fissare appuntamenti con il CPI;
- Collocamento Mirato: richieste per le graduatorie del "collocamento mirato", inclusa la gestione del reddito e dei famigliari a carico;
- Iscrizione Garanzia Giovani: permette di di gestire le adesioni al piano "Garanzia Giovani"; 
- Dichiarazione di Immediata Disponibilità (DID): gestire la "dichiarazione di disponibilità" per il reinserimento nel mercato del lavoro;
- Gestione Privacy e Minori: gestione delle autorizzazioni al trattamento dei dati personali e informativa sulla privacy;
- Visualizzazione CPI e Sportelli: ricerca e visualizzazione su mappa dell'ubicazione dei CPI e degli sportelli;

La nuova versione del prodotto è frutto di una profonda riprogettazione, sia funzionale che architetturale, ed è stata realizzata nel rispetto dei requisiti amministrativi e funzionali definiti dalla Regione Piemonte.

La riprogettazione è inoltre coerente con la più ampia revisione complessiva delle altre componenti applicative del Sistema Informativo Lavoro, nonché con le modalità di interazione fra di esse (protocolli di comunicazione – REST API) già in uso.

Il sistema è integrato con:
- il sistema SILP per il recupero delle informazioni relative alle richieste di esonero;
- con il sistema BLP - ioLavoro;
- con il sistema SILOS;
- con la piattaforma di autenticazione Shibboleth;
- con il servizio di localizzazione LOCCSI:
- con la piattaforma MS Teams.

Complessivamente l’applicativo prevede moduli di front-end web che interagiscono, tramite API, con moduli di back-end dove risiede la logica di business e che accedono al DB.

Il servizio applicativo è disponibile a questo indirizzo:
https://secure.sistemapiemonte.it/pslphome/

Il prodotto segue quindi il paradigma “SPA – Single Page Application” : la componente di interfaccia Angular ha una corrispondente componente di “BackEnd”, realizzata nel linguaggio Java, e che espone API REST per la componente Angular; il back-end accede al DB.

Il prodotto include le seguenti componenti software:
- [pslpdb](https://github.com/regione-piemonte/pslp/tree/main/pslpdb): 			 script DDL/DML per la creazione ed il popolamento iniziale del DB;
- [pslpwcl](https://github.com/regione-piemonte/pslp/tree/main/pslpwcl): 		 Client Web (Angular) per la piattaforma servizi lavoro piemonte;
- [pslpbff](https://github.com/regione-piemonte/pslp/tree/main/pslpbff): 		 Componente SPA con servizi REST per pslwcl;
- [pslpapi](https://github.com/regione-piemonte/pslp/tree/main/pslpaoi): 		 Esposizione API verso altri Servizi del S.I. Lavoro Piemonte;
	
Questa versione di prodotto sostituisce, a partire dal 2025, la 2.3.2 disponibile qui:
https://github.com/regione-piemonte/pslp-2.3.2

A ciascuna componente del prodotto elencata sopra corisponde una sotto-directory denominata <nome_componente>.\
In ciascuna di queste cartelle di componente si trovano ulteriori informazioni specifiche, incluso il BOM della componente di prodotto.

Nella directory [csi-lib]( https://github.com/regione-piemonte/pslp/tree/main/csi-lib ) si trovano le librerie sviluppate da CSI-Piemonte con licenza OSS, come indicato nei BOM delle singole componenti, ed usate trasversalmente nel prodotto.

## Architettura Tecnologica

Le tecnologie adottate sono conformi agli attuali standard adottati da CSI per lo sviluppo del Sistema informativo di Regione Piemonte, ed in particolare sono orientate alla possibilità di installare il prodotto sw su infrastruttura “a container”, orientata alle moderne architetture a “mini/microservizi”, prediligendo sostanzialmente gli strumenti open-source consolidati a livello internazionale (Linux, Java, Apache…); nel dettaglio tali pile prevedono:

- AdoptOpenJDK 17
- Framework QUARKUS 3.xx
- WS Apache 2.4
- DBMS Postgresql 15
- S.O. Linux 
- Angular 13 (lato client web).

## Linguaggi di programmazione utilizzati

I principali linguaggi utilizzati sono:
-	Java v. 17
-	HTML5
-	Typescript/Javascript
-	XML/JSON
-	SQL

## DB di riferimento

A seguito di valutazione sull’utilizzo di DBMS open-source si è ritenuto che Postgresql garantisca adeguata robustezza e affidabilità tendo conto delle dimensioni previste per il DB e dei volumi annui gestiti.
La versione scelta è la 15, con possibilità di aggiornamento alla versione 17 o superiore.

Per quanto riguarda la struttura del DB, si è optato per un “partizionamento” fra entità di carattere trasversale ed entità specifiche per ciascun adempimento. Tale strutturazione è coerente con la progettazione di piattaforme sw orientate ai "micro-servizi".

## Tecnologie framework e standard individuati
Le tecnologie individuate sono Open Source e lo "stack applicativo" utilizzato rispetta gli standard del SIRe Regione Piemonte. Si basa quindi sull’utilizzo di:

- Quarkus
- Angular
- Jasper report
- librerie sviluppate da CSI e mantenute trasversalmente per la cooperazione applicativa

Quarkus è un framework che aggrega svariate librerie, per assolvere alle differenti finalità. Ad esempio: 
-	Librerie per la realizzazione dei servizi REST viene utilizzata Resteasy
-	Librerie per la realizzazione della persistenza su DB relazionale viene utilizzato JPA e Hibernate col supporto della libreria Panache

# Prerequisiti di sistema

Una istanza DBMS Postgresql (consigliata la verione 15) con utenza avente privilegi per la creazione tabelle ed altri oggetti DB (tramite le istruzioni DDL messe a disposizione nella componente silapdb), ed una ulteriore utenza separata non proprietaria dello schama, per l'esecuzione di istruzioni DML di Create, Readd, Update e Delete sui dati.

Un ambiente (VM o Container) in cui poter installare AdoptOpenJDK: in tale ambiente girerà la JVM configurata con il framework Quarkus.\
Una istanza di web server, consigliato apache web server ( https://httpd.apache.org/ ).\
Per il build è previsto l'uso di Apache Maven ( https://maven.apache.org/ ).\
Per la compilazione/build delle componenti di backend sono rese disponibili nella directory "csi-lib" una serie di librerie predisposte da CSI Piemonte per un uso trasversale nei prodotti realizzati, o per uso specifico in altri prodotti con cui SILAP si interfaccia. Indicazioni più specifiche sono disponibili nella documentazione di ciascuna componente.

Il prodotto è integrato nei servizi del sistema informativo di Regione Piemonte "Lavoro": alcune sue funzionalità sono quindi strettamente legate alla possibilità di accedere a servizi esposti da altre componenti dell'ecosistema "Lavoro" di Regione Piemonte.

Infine, anche per quanto concerne l'autenticazione e la profilazione degli utenti del sistema, SILAP è integrato con servizi trasversali del sistema informativo regionale ("Shibboleth", "IRIDE"), di conseguenza per un utilizzo in un altro contesto occorre avere a disposizione servizi analoghi o integrare moduli opportuni che svolgano analoghe funzionalità.

# Installazione

Creare lo schema del DB, tramite gli script della componente pslpdb.
 
Configurare il datasource nel file application.properties , utilizzato in pslpbff e pslpapi.

Configurare i web server e definire gli opportuni Virtual Host e "location" - per utilizzare il protocollo https occorre munirsi di adeguati certificati SSL.

Nel caso si vogliano sfruttare le funzionalità di invio mail, occorre anche configurare un mail-server.


# Deployment

Dopo aver seguito le indicazioni del paragrafo relativo all'installazione, si può procedere al build dei pacchetti ed al deploy sull'infrastruttura prescelta.


# Versioning

Per la gestione del codice sorgente viene utilizzato Git, ma non vi sono vincoli per l'utilizzo di altri strumenti analoghi.\
Per il versionamento del software si usa la tecnica Semantic Versioning (http://semver.org).


# Copyrights

© Copyright Regione Piemonte – 2025\


# License

SPDX-License-Identifier: EUPL-1.2-or-later .\
Questo software è distribuito con licenza EUPL-1.2 .\
Consultare il file LICENSE.txt per i dettagli sulla licenza.
