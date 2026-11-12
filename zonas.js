// zonas.js - Patron Estrategia para el recargo por zona (R4).
// Cada zona sabe como transformar la tarifa base; calc() ya no decide por cadenas de if.

class EstrategiaZona {
  // Contrato: recibe la tarifa base y devuelve la tarifa con el recargo de la zona.
  aplicar(_tarifa) {
    throw new Error("aplicar() debe implementarse en la estrategia concreta");
  }
}

class ZonaUrbana extends EstrategiaZona {
  aplicar(tarifa) {
    return tarifa; // sin recargo
  }
}

class ZonaConRecargo extends EstrategiaZona {
  constructor(recargo) {
    super();
    this.recargo = recargo; // fraccion, ej. 0.20
  }

  aplicar(tarifa) {
    return tarifa + tarifa * this.recargo;
  }
}

class ZonaRural extends ZonaConRecargo {}

class ZonaNacional extends ZonaConRecargo {}

module.exports = { EstrategiaZona, ZonaUrbana, ZonaConRecargo, ZonaRural, ZonaNacional };
