let kolomSort = "nama";
let arahSort = "asc";
let semuaData = [];
let dataTampil = [];
let halamanSekarang = 1;
let jumlahPerHalaman = 10;

document.addEventListener("DOMContentLoaded", () => {
  ambilDataPublik();

  document
    .getElementById("searchInput")
    .addEventListener("input", prosesFilter);

  document
    .getElementById("filterKecamatan")
    .addEventListener("change", prosesFilter);

  document
    .getElementById("pageSize")
    .addEventListener("change", function () {
      jumlahPerHalaman = Number(this.value);
      halamanSekarang = 1;
      tampilkanTabel();
    });

  document
    .getElementById("prevPage")
    .addEventListener("click", halamanSebelumnya);

  document
    .getElementById("nextPage")
    .addEventListener("click", halamanBerikutnya);
});

async function ambilDataPublik() {
  const tbody = document.getElementById("dataBody");

  try {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Memuat data...</td>
      </tr>
    `;

const hasil = await ambilJSONP(`${API_URL}?mode=public`);

semuaData = hasil.data || [];
dataTampil = [...semuaData];

urutkanDataTampil();

    isiFilterKecamatan();
    tampilkanTabel();

  } catch (error) {
    console.log("ERROR PUBLIC:", error);

    tbody.innerHTML = `
      <tr>
        <td colspan="5">Gagal memuat data</td>
      </tr>
    `;
  }
}

function isiFilterKecamatan() {
  const select = document.getElementById("filterKecamatan");

  select.innerHTML = `
    <option value="">Semua Kecamatan</option>
  `;

  const daftarKecamatan = [
    ...new Set(
      semuaData
        .map(item => kapital(item.kecamatan))
        .filter(kec => kec !== "")
    )
  ].sort();

  daftarKecamatan.forEach(kecamatan => {
    const option = document.createElement("option");
    option.value = kecamatan;
    option.textContent = kecamatan;
    select.appendChild(option);
  });
}

function prosesFilter() {
  const keyword = kecil(
    document.getElementById("searchInput").value
  );

  const kecamatanDipilih =
    document.getElementById("filterKecamatan").value;

  dataTampil = semuaData.filter(item => {
    const nama = kecil(item.nama);

    const cocokKeyword =
      nama.includes(keyword);

    const cocokKecamatan =
      kecamatanDipilih === "" ||
      kapital(item.kecamatan) === kecamatanDipilih;

    return cocokKeyword && cocokKecamatan;
  });

  halamanSekarang = 1;
  urutkanDataTampil();
  tampilkanTabel();
}

function sortKolom(kolom) {
  if (kolomSort === kolom) {
    arahSort = arahSort === "asc" ? "desc" : "asc";
  } else {
    kolomSort = kolom;
    arahSort = "asc";
  }

  urutkanDataTampil();
  halamanSekarang = 1;
  tampilkanTabel();
}

function urutkanDataTampil() {
  dataTampil.sort((a, b) => {
    const nilaiA = kecil(a[kolomSort]);
    const nilaiB = kecil(b[kolomSort]);

    return arahSort === "asc"
      ? nilaiA.localeCompare(nilaiB, "id", { numeric: true })
      : nilaiB.localeCompare(nilaiA, "id", { numeric: true });
  });
}

function tampilkanTabel() {
  const tbody = document.getElementById("dataBody");
  const pageInfo = document.getElementById("pageInfo");

  tbody.innerHTML = "";

  const totalData = dataTampil.length;
  const totalHalaman = Math.ceil(totalData / jumlahPerHalaman) || 1;

  if (halamanSekarang > totalHalaman) {
    halamanSekarang = totalHalaman;
  }

  const mulai = (halamanSekarang - 1) * jumlahPerHalaman;
  const akhir = mulai + jumlahPerHalaman;
  const dataHalaman = dataTampil.slice(mulai, akhir);

  if (dataHalaman.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Data tidak ditemukan</td>
      </tr>
    `;
  }

  dataHalaman.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.sobatId}</td>
      <td>${kapital(item.nama)}</td>
      <td>${kapital(item.kecamatan)}</td>
      <td>${sensorEmail(item.email)}</td>
      <td>${sensorHP(item.hp)}</td>
    `;

    tbody.appendChild(tr);
  });

  pageInfo.textContent =
    `Halaman ${halamanSekarang} dari ${totalHalaman} | Total ${totalData} data`;

  document.getElementById("prevPage").disabled =
    halamanSekarang <= 1;

  document.getElementById("nextPage").disabled =
    halamanSekarang >= totalHalaman;
}

function halamanSebelumnya() {
  if (halamanSekarang > 1) {
    halamanSekarang--;
    tampilkanTabel();
  }
}

function halamanBerikutnya() {
  const totalHalaman =
    Math.ceil(dataTampil.length / jumlahPerHalaman) || 1;

  if (halamanSekarang < totalHalaman) {
    halamanSekarang++;
    tampilkanTabel();
  }
}

function ambilJSONP(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonpCallback_" + Date.now();

    window[callbackName] = function (data) {
      delete window[callbackName];
      script.remove();
      resolve(data);
    };

    const script = document.createElement("script");

    script.src = url + "&callback=" + callbackName;

    script.onerror = function () {
      delete window[callbackName];
      script.remove();
      reject(new Error("Gagal memuat data JSONP"));
    };

    document.body.appendChild(script);
  });
}
