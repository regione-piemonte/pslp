# Prodotto - Componente

Prodotto PSLP, componente PSLPWCL

# Descrizione della componente

Questa componente è la controparte Angular della web application PSLPBFF, e di fatto costituisce il front-end del prodotto PSLP.

Il progetto è stato generato con [Angular CLI](https://github.com/angular/angular-cli) versione 13.

# Configurazioni iniziali

Per avere un ambiente di sviluppo eseguire `ng serve` su un server di sviluppo.
La URL di default è `http://localhost:4200/`.

La "web application" effettuerà il reload automatico per qualsiasi modifica dei sorgenti.

Nel caso di voglia generare una nuova componente eseguire `ng generate component component-name` (vedi documentazione Angular).

Tutte le configurazioni devono essere impostate nel file `buildfiles/environment.<env>.ts` dove saranno sostituite a "compile time" con `src/environments/environment.ts`.\
Per ogni nuovo "ambiente" che si crea, deve essere aggiunta una corrispondente "entry" nel file `angular.json`, per referenziare il nuovo ambiente.

Queste sono le impostazioni da configurare:
- production = indica se la configurazione ed il file corrispondente è relativa ad un ambiente di produzione o di pre-produzione
- ambiente = il nome del environment
- shibbolethAuthentication = indica se l'integrazione con Shibboleth viene effettivamente usata (...)
- publicPath = la URL a cui risponde l'applicazione
- appBaseHref = il valore del `<base>` tag che specifica il "local path" per gli (iper)riferimenti relativi
- beServerPrefix = il prefisso usato per comporre il "BackEnd service URL" (nel caso sia utile tenerlo separato)
- beService = la "Base URL" del servizio di BackEnd
- shibbolethSSOLogoutURL = la URL di logout dal SSO (Single Sign On)
- onAppExitURL = la URL dove si deve essere rediretti all'uscita dall'applicazione

# Getting Started
Una volta prelevata e portata in locale dal repository la componente ("git clone"), procedere con la modifica dei file di configurazione in base al proprio ambiente di deploy e quindi procedere al build.

Per il build usare il comando `ng build`.
Gli "artefatti" risultanti si troveranno in `dist/`.

Per la versione di esercizio usare il flag `--prod`.

il progetto usa gli script standard di "Angular CLI" (non è necessario installare la "CLI" su tutti gli ambienti, in quanto viene referenziata come una "development dependency").


Per semplificare il "lifecycle" della applicazione sono disponibili alcuni "goal":\
- package-* = scripts that execute the Angular CLI build with a predefied configuration;
- extract-i18n = script that extracts the internationalization strings and adds them to JSON files.

# Prerequisiti di sistema
Questa componente necessita di PSLPBFF per funzionare.
Inoltre prevede la configurazione di un servizio di autenticazione (Shibboleth).

# Installazione

La componente Angular viene solitamente reso disponibile ai client (browser) tramite un web-server di front-end.
La configurazione prevista è la seguente:\
 - viene definito un "virtual host" ed una "location" per il front-end : per esempio PSLP.aaa.bbb.it/pslpwcl ;
 - sulla "location" viene attivata la protezione shibboleth;
 - il web client angular viene "deloyato" in una posizione accessibile dal web server, in modo che venga reso disponibile ai browser che si collegano alla location (protetta da shibboleth).

# Esecuzione dei test 
Eseguire `ng test` per effettuare gli "unit test" tramite [Karma](https://karma-runner.github.io).\

Questa componente è stata oggetto di test di vulnerabilità prima del rilascio.

# Versioning
Per il versionamento del software si usa la tecnica Semantic Versioning (http://semver.org).

# Copyrights

© Copyright Regione Piemonte – 2025


Questo stesso elenco dei titolari del software è anche riportato in Copyrights.txt 

# License
Il prodotto software è sottoposto alla licenza EUPL-1.2 o versioni successive.\
SPDX-License-Identifier: EUPL-1.2-or-later\
Vedere il file EUPL v1_2 IT-LICENSE.txt per i dettagli.

# Community site
Per avere ulteriori informazioni sull'utilizzo di Angular CLI si può usare il comando `ng help` o consultare il [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
