# Prodotto
PSLP componente PSLPBFF (Backend For Frontend del webclient angular)


# Descrizione della componente
Questa cartella rappresenta una "unità di installazione" corrispondente alla componente "logica" di backend che espone le API REST per il webclient angular (pslpwcl).

Complessivamente si tratta di una web application che segue il paradigma "Single Page Application (SPA)", esponendo servizi REST alla componente PSLPWCL (Angular).

Si connette al DB (PSLPDB) per la profilazione utenti e le operazioni CRUD.

Si collega ad altri servizi del Sistema Informativo Regionale Lavoro di Regione Piemonte (SILOS/IUP, SILP/SILPREST, BLP), oltre che a servizi di altri sistemi informativi di Regione Piemonte, come il servizio "LOCSI". \
I servizi esterni sono fruiti tramite protocollo HTTP (protetto tramite uno schema di "basic authentication"), e sono per lo più costituiti da API REST.
Utilizza anche servizi esposti dalla piattaforma di collaboration MS Teams.

Questa componente si basa su:
- Java 17 --> AdoptOpenJDK 17
- Framework QUARKUS 3.14.4 o superiore
- Librerie per la realizzazione della persistenza su DB : JPA e Hibernate col supporto della libreria Panache

# Configurazioni iniziali
Fondamentale avere a disposzione un ambiente (Virtual Machine o "container") in cui è installato un JDK ver.17, preferibilmente Adopt OpenJDK.
Da un punto di vista generale, nella fase iniziale occorre adattare i file di properties alla propria configurazione.
Una delle cose principali da configurare è il datasource con i riferimenti del DB che si intende utilizzare (JNDI name).\
Per quanto riguarda le properties da configurare il punto "centrale" è costituito dal file:

 src/main/resources/application.properties

Entrando più in dettaglio, nel seguito si riportano le principali properties da configurare :

- quarkus.http.host=
- quarkus.http.port=
- quarkus.http.root-path=
- quarkus.cxf.path = 
- quarkus.application.name=pslpbff

- quarkus.package.type=
- quarkus.datasource.db-kind=postgresql
- quarkus.datasource.jdbc.max-size=

- quarkus.datasource.username=
- quarkus.datasource.password=
- quarkus.datasource.jdbc.url=jdbc:postgresql://<host>:<porta>/<DB Name> ....

- quarkus.transaction-manager.default-transaction-timeout = <numero secondi>

- user <fruitore>
  - quarkus.security.users.embedded.users.<fruitore>=
  - quarkus.security.users.embedded.roles.<fruitore>=

- Basic auth cfg base
  - quarkus.http.auth.basic=true
  - quarkus.security.users.embedded.enabled=true
  - quarkus.security.users.embedded.plain-text=true


# Getting Started
Una volta prelevata e portata in locale dal repository la componente ("git clone"), procedere con la modifica dei file di configurazione in base al proprio ambiente di deploy e quindi procedere al build.

Le indicazioni principali riportate nel seguito sono quelle seguite in fase di realizzazione della componente.
## implementazoni di default e modalità di sviluppo ##

### sviluppo contract first ###
Il progetto è impostato per lo sviluppo secondo la modalità contract-first. per quanto riguarda l'esposizione di API REST:
* i file derivati dallo scheletro base "openapi.yaml" basati sulla specifica openapi 3, contenenti le definizioni di base e nei quali è possibile aggiungere le definizioni delle risorse specfiche dell'applicativo, sono nella cartella ```src/main/resources/...```
* il pom.xml prevede l'utilizzo del plugin swagger per la generazione delle sole interfacce JAX-RS a partire da tale file di specifiche. La generazione avviene in fase di compilazione (quindi può essere scatenata con il comando ```mvn clean compile```)
* il generatore non genera invece le classi di implementazione delle API, che devono essere definite manualmente ed implementare le interfacce JAX-RS (vedere esempio ```StatusApiServiceImpl```)
* le api sono definite sotto il prefisso ```/api```
* sono predefinite (ed implementate) le seguenti api di base:
  * ```/api/status```, che è un health check ad uso esterno (a differenza delle api standard di health check che non sono esposte all'utente finale)

### altre implementazioni predefinite ###

Non vi sono altre implementazioni predefinite

### api strumentali ###

Il progetto è impostato per esporre una implementazione minimale di default delle API strumentali per:
* health check:
  * liveness: ```/q/health/live```
  * readyness: ```/q/health/ready```
* metrics:  ```/q/metrics```

E' possibile estendere l'implementazione di default a seconda delle esigenze specifiche.

# Prerequisiti di sistema
Occorre per prima cosa predisporre il DB Schema utilizzato da questa componente, e popolarlo con i dati iniziali: si deve quindi prima aver completato installazione e configurazione della componente pslpdb.

Nella directory "csi-lib" sono disponibili le librerie sviluppate da CSI e rese disponibili con le licenze indicate nel BOM.csv .

Occorre inoltre prevedere le opportune sostituzioni dei servizi esterni richiamati.

Per il "build" si è previsto di utilizzare Apache Maven. Nel seguito alcune indicazioni di dettaglio:

Compilazione: mvn clean package .

Nel caso si aggiunga un nuovo profile, esso deve essere referenziato nella sezione `<profiles>` del `pom.xml`.


# Installazione - Deployment

In linea di massima è possibile procedere al deploy secondo le modalità previste per le applicazioni basate su Quarkus.
Nel nostro caso si è scelto di effettuarlo come una "standard java application", ovvero un jar eseguibile con le librerie necessarie nel classpath della JVM.


# Esecuzione dei test

Questa componente è stata sottoposta a vulnerability assessment.

# Versioning

Per il versionamento del software si usa la tecnica Semantic Versioning (http://semver.org).

# Copyrights

© Copyright Regione Piemonte – 2025\

Questo stesso elenco dei titolari del software è anche riportato in Copyrights.txt .

# License
Il prodotto software è sottoposto alla licenza EUPL-1.2 o versioni successive.
SPDX-License-Identifier: EUPL-1.2-or-later

