document.addEventListener("DOMContentLoaded", cekLoginAdmin);

function cekLoginAdmin() {
  const login = sessionStorage.getItem("adminLogin");

  if (login === "true") {
    tampilkanDataAdmin();
  }
}

async function loginAdmin() {
  const username = document.getElementById("usernameAdmin").value.trim();
  const password = document.getElementById("passwordAdmin").value.trim();
  const info = document.getElementById("loginInfo");

  if (!username || !password) {
    info.textContent = "Username dan password wajib diisi";
    return;
  }

  info.textContent = "Memeriksa login...";

  try {
    const response = await fetch(
      `${API_URL}?mode=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );

    const hasil = await response.json();

    if (!hasil.success) {
      info.textContent = "Username atau password salah";
      return;
    }

    sessionStorage.setItem("adminLogin", "true");

    tampilkanDataAdmin();

  } catch (error) {
    info.textContent = "Gagal login. Periksa koneksi atau Apps Script.";
  }
}

async function tampilkanDataAdmin() {
  const loginBox = document.getElementById("loginBox");
  const adminBox = document.getElementById("adminBox");
  const tbody = document.getElementById("adminBody");

  loginBox.style.display = "none";
  adminBox.style.display = "block";

  tbody.innerHTML = `
    <tr>
      <td colspan="5">Memuat data admin...</td>
    </tr>
  `;

  try {
    const response = await fetch(`${API_URL}?mode=public`);
    const hasil = await response.json();

    tbody.innerHTML = "";

    hasil.data.forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.sobatId}</td>
        <td>${kapital(item.nama)}</td>
        <td>${kapital(item.kecamatan)}</td>
        <td>${kecil(item.email)}</td>
        <td>${item.hp}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Gagal memuat data admin</td>
      </tr>
    `;
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("adminLogin");
  location.reload();
}
