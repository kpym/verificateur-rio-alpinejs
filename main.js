// La logique utilisant alpine.js

document.addEventListener('alpine:init', () => {
    Alpine.data('rio', () => RIO);
})

RIO = {
  tel:       '',
  rio:       '',
  oo:        '',
  q:         '',
  rrrrrr:    '',
  ccc:       '',

  normalisePhone(){
    // On normalise le numéro de téléphone pour être de la forme 0XXXXXXXXX.
    this.tel = this.tel.replace(/[^0-9+]/g, '').replace(/\+330?/g, '0').substr(0,10)
  },
  toRIO(){
    this.rio = this.oo + this.q + this.rrrrrr + this.ccc;
  },
  fromRIO(){
    // On normalise le RIO
    this.rio = this.rio.toUpperCase().replace(/\s/g, '').substr(0,12);

    this.oo = this.rio.substr(0,2);
    this.q = this.rio.substr(2,1);
    this.rrrrrr = this.rio.substr(3,6);
    this.ccc = this.rio.substr(9,3);
  },
  okTel() {
    return /^[0-9]{10}$/.test(this.tel);
  },
  okRio() {
    return /^[A-Z0-9+]{12}$/.test(this.rio);
  },
  operateur() {
    if (this.oo) {
      return operateurs.filter(o => o.prefix == this.oo).map(o => o.nom).join(", ") || "[inconnu]";
    }
    return "";
  },
  type() {
    // on pourrait aussi vérifier si oo[0] > "E"
    if (this.oo) {
      return operateurs.filter(o => o.prefix == this.oo).map(o => o.type)[0] || "[inconnu]";
    }
    return "";
  },
  qtype() {
    if (!this.q) {
      return "";
    }
    switch (this.q) {
      case 'E':
        return "entreprise";
      case 'P':
        return "particulier";
      default:
        return "[inconnu]";
    }
  },
  riotel() {
    if (this.rio.length < 9 || this.tel.length != 10) {
      return "";
    }
    return this.rio.substr(0,9) + this.tel;
  },
  abc() {
    ordre = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+"; // caractères utilisés pour le codage (37 différents)

    if (this.tel.length != 10 || this.rio.length < 9) {
      return "";
    }
    a = b = c = 0 // initialisation de a, b et c
    for (const ch of this.riotel()) {
        position  = ordre.indexOf(ch);
        a = (1 * a + position) % 37;
        b = (2 * b + position) % 37;
        c = (4 * c + position) % 37;
    }
    return ordre[a] + ordre[b] + ordre[c];
  }
}
