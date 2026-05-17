document.addEventListener("DOMContentLoaded", tampilkanDataPublik);

async function tampilkanDataPublik() {

  const tbody = document.getElementById("dataBody");

  try {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">Memuat data...</td>
      </tr>
    `;

    const response = await fetch(`${API_URL}?mode=public`);
    const hasil = await response.json();

    tbody.innerHTML = "";

    hasil.data.forEach(item => {

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

  } catch (error) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          Gagal memuat data
        </td>
      </tr>
    `;

  }

}
