// ======================
// UBAH KE HURUF BESAR
// ======================

function kapital(teks) {

  return String(teks || "")
    .toUpperCase();

}


// ======================
// UBAH KE HURUF KECIL
// ======================

function kecil(teks) {

  return String(teks || "")
    .toLowerCase();

}


// ======================
// SENSOR EMAIL
// ======================

function sensorEmail(email) {

  email = kecil(email);

  // kalau tidak ada @
  if (!email.includes("@")) {
    return email;
  }

  const bagian = email.split("@");

  const nama = bagian[0];
  const domain = bagian[1];

  // email terlalu pendek
  if (nama.length <= 3) {
    return nama[0] + "***@" + domain;
  }

  const depan = nama.slice(0, 3);

  const belakang = nama.slice(-2);

  return `${depan}***${belakang}@${domain}`;

}


// ======================
// SENSOR NOMOR HP
// ======================

function sensorHP(hp) {

  hp = String(hp || "");

  // kalau terlalu pendek
  if (hp.length <= 7) {
    return "*******";
  }

  const depan = hp.slice(0, 4);

  const belakang = hp.slice(-3);

  return `${depan}****${belakang}`;

}
