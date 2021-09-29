// La logique utilisant alpine.js

document.addEventListener('alpine:init', () => {
    Alpine.data('rio', () => RIO);
})

RIO = {
  oo:        '',
  q:         '',
  rrrrrr:    '',
  ccc:       '',

  // getter/setter pour tel
  telnum:    '',
  get tel(){
    return this.telnum
  },
  set tel(newPhone){
    // On normalise le numéro de téléphone pour être de la forme 0XXXXXXXXX.
    this.telnum = newPhone.replace(/[^0-9+]/g, '').replace(/\+330?/g, '0').substr(0,10)
  },
  // getter/setter pour rio
  get rio(){
    return  this.oo + this.q + this.rrrrrr + this.ccc;
  },
  set rio(newRIO) {
    // On normalise le RIO
    newRIO = newRIO.toUpperCase().replace(/\s/g, '').substr(0,12);

    this.oo = newRIO.substr(0,2);
    this.q = newRIO.substr(2,1);
    this.rrrrrr = newRIO.substr(3,6);
    this.ccc = newRIO.substr(9,3);
  },
  // les valaurs calculées
  get okTel() {
    return /^[0-9]{10}$/.test(this.tel);
  },
  get okRio() {
    return /^[A-Z0-9+]{12}$/.test(this.rio);
  },
  get operateur() {
    if (!this.oo) {
      return "";
    }
    return operateurs.filter(o => o.prefix == this.oo).map(o => o.nom).join(", ") || "[inconnu]";
  },
  get type() {
    // on pourrait aussi vérifier si oo[0] > "E"
    if (!this.oo) {
      return "";
    }
    return operateurs.filter(o => o.prefix == this.oo).map(o => o.type)[0] || "[inconnu]";
  },
  get qtype() {
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
  get riotel() {
    if (this.rio.length < 9 || this.tel.length != 10) {
      return "";
    }
    return this.rio.substr(0,9) + this.tel;
  },
  get abc() {
    ordre = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+"; // caractères utilisés pour le codage (37 différents)

    if (this.tel.length != 10 || this.rio.length < 9) {
      return "";
    }
    a = b = c = 0 // initialisation de a, b et c
    for (const ch of this.riotel) {
        position  = ordre.indexOf(ch);
        a = (1 * a + position) % 37;
        b = (2 * b + position) % 37;
        c = (4 * c + position) % 37;
    }
    return ordre[a] + ordre[b] + ordre[c];
  }
}
