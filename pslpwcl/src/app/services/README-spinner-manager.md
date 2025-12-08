# SpinnerManagerService - Guida all'uso

## Problema Risolto
Il `SpinnerManagerService` risolve i conflitti tra lo spinner automatico del `LoadingInterceptor` e gli spinner manuali nei componenti, prevenendo la chiusura prematura dello spinner.

## Come Usare

### 1. Import del Servizio
```typescript
import { SpinnerManagerService } from 'src/app/services/spinner-manager.service';
```

### 2. Iniezione nel Costruttore
```typescript
constructor(
  private spinnerManager: SpinnerManagerService
) {}
```

### 3. Utilizzo Base
```typescript
// Mostra lo spinner per una richiesta specifica
const requestId = this.spinnerManager.generateRequestId();
this.spinnerManager.show(requestId);

// Nasconde lo spinner per quella richiesta specifica
this.spinnerManager.hide(requestId);
```

### 4. Esempio Completo
```typescript
loadData(): void {
  const requestId = this.spinnerManager.generateRequestId();
  this.spinnerManager.show(requestId);
  
  this.dataService.getData().subscribe({
    next: (data) => {
      this.data = data;
    },
    error: (error) => {
      this.spinnerManager.hide(requestId);
      console.error('Errore:', error);
    },
    complete: () => {
      this.spinnerManager.hide(requestId);
    }
  });
}
```

## Vantaggi

1. ** Nessun Conflitto**: Lo spinner si chiude solo quando tutte le richieste sono completate
2. ** Gestione Automatica**: Il servizio gestisce automaticamente lo stato dello spinner
3. ** Tracciamento Richieste**: Ogni richiesta ha un ID univoco
4. ** Compatibilità**: Funziona con il `LoadingInterceptor` esistente

## Migrazione da NgxSpinnerService

### PRIMA (Problematico)
```typescript
this.spinner.show();
this.service.getData().subscribe({
  next: (data) => this.data = data,
  complete: () => this.spinner.hide() // ⚠️ Può chiudere prematuramente
});
```

### DOPO (Corretto)
```typescript
const requestId = this.spinnerManager.generateRequestId();
this.spinnerManager.show(requestId);
this.service.getData().subscribe({
  next: (data) => this.data = data,
  complete: () => this.spinnerManager.hide(requestId) //  Chiusura corretta
});
```

## Metodi Disponibili

- `show(requestId?: string)`: Mostra lo spinner
- `hide(requestId?: string)`: Nasconde lo spinner per una richiesta specifica
- `hideAll()`: Nasconde tutti gli spinner attivi
- `hasActiveRequests()`: Verifica se ci sono richieste attive
- `generateRequestId()`: Genera un ID univoco per le richieste
- `spinnerState$`: Observable per monitorare lo stato dello spinner
