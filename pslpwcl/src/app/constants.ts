/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
export const COD_TIPO_AGENDE = {
    AGENDE: 'S',
    LABORATORI: 'L'
}
export const HTTP_RESPONSE = {
    SATUS: {
        UNKNOW_ERROR: 0,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    }
}

//Da riempire
export const PARAMETRO = {
    PSLP_DISP: {
        COD: "PSLP_DISP",
        ID: 1
    }
}
export const LANG = {
    IT: "it",
    ENG: "eng"
}


export const TYPE_ALERT = {
    SUCCESS: 'S',
    ERROR: 'E',
    WARNING: 'W',
    INFO: 'I',
    VALIDATION: 'V'
};


export const OPERAZIONE_DA_EFFETTUARE = {
  INSERT: "I",
  DELETE: "D",
  MODIFY: "M"
}

export const MOD = {
    INS: "ins",
    EDIT: "edit",
    VIEW: "view"
}

export const CONTROL_STATE = {
    DISABLE: 'disable',
    ENABLE: 'enable'
};

export const NOTIFICHE = {
    TIME_UPDATE: 100000, //100000 millisec = 1 min, 300000 millisec = 5 min;
    AZIONE: {
        LETTURA: "LETTURA",
        ELIMINA: "ELIMINA"
    }
}

