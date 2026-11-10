
// ========================================
// MINI POS - LAVENDER DIGITAL CASHIER
// ========================================

// FORMAT RUPIAH
function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// TANGGAL
document.getElementById("tanggal")?.textContent;
const tanggal = document.getElementById("tanggal");
if (tanggal) {
    tanggal.textContent = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// DATA PRODUK
const produkAwal = [
    {
        id: 1, nama: "Indomie Goreng", kategori: "Makanan",
        harga: 3500, stok: 30,
        gambar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"
    },
    {
        id: 2, nama: "Roti Cokelat", kategori: "Makanan",
        harga: 5000, stok: 20,
        gambar: "https://images.unsplash.com/photo-1608198093002-ad4e005484e3?w=500"
    },
    {
        id: 3, nama: "Kentang Goreng", kategori: "Makanan",
        harga: 10000, stok: 15,
        gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 4, nama: "Donat", kategori: "Makanan",
        harga: 4000, stok: 25,
        gambar: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500"
    },
    {
        id: 5, nama: "Burger", kategori: "Makanan",
        harga: 15000, stok: 12,
        gambar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 6, nama: "Es Teh", kategori: "Minuman",
        harga: 5000, stok: 30,
        gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"
    },
    {
        id: 7, nama: "Jus Jeruk", kategori: "Minuman",
        harga: 8000, stok: 18,
        gambar: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"
    },
    {
        id: 8, nama: "Air Mineral", kategori: "Minuman",
        harga: 4000, stok: 40,
        gambar: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=500"
    },
    {
        id: 9, nama: "Kopi Susu", kategori: "Minuman",
        harga: 10000, stok: 16,
        gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    },
    {
        id: 10, nama: "Susu Cokelat", kategori: "Minuman",
        harga: 7000, stok: 22,
        gambar: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500"
    }
];

// LOCAL STORAGE
let produk = JSON.parse(localStorage.getItem("produkPOS"));

if (!Array.isArray(produk)) {
    produk = produkAwal;
    simpanProduk();
}

let keranjang = [];
let riwayat = JSON.parse(localStorage.getItem("riwayatPOS")) || [];

// SIMPAN DATA
function simpanProduk() {
    localStorage.setItem("produkPOS", JSON.stringify(produk));
}

function simpanRiwayat() {
    localStorage.setItem("riwayatPOS", JSON.stringify(riwayat));
}

// STATUS STOK
function statusStok(stok) {
    if (stok === 0) {
        return `<span class="badge bg-danger stock-badge">Stok Habis</span>`;
    }

    if (stok < 5) {
        return `<span class="badge bg-warning text-dark stock-badge">Stok Menipis</span>`;
    }

    return `<span class="badge bg-success stock-badge">Stok Aman</span>`;
}

// TAMPILKAN PRODUK
function tampilkanProduk() {
    const tempat = document.getElementById("daftarProduk");

    const pencarian = document.getElementById("searchProduk").value.toLowerCase();
    const kategori = document.getElementById("filterKategori").value;

    const hasil = produk.filter(p =>
        p.nama.toLowerCase().includes(pencarian) &&
        (kategori === "Semua" || p.kategori === kategori)
    );

    tempat.innerHTML = "";

    if (hasil.length === 0) {
        tempat.innerHTML = `
            <div class="col-12 text-center text-secondary py-4">
                <i class="bi bi-search fs-1"></i>
                <p>Produk tidak ditemukan.</p>
            </div>`;
        return;
    }

    hasil.forEach(p => {
        tempat.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card product-card">

                    <img src="${p.gambar}"
                        class="product-img"
                        alt="${p.nama}"
                        onerror="this.onerror=null;this.src='https://placehold.co/400x250?text=Produk'">

                    <div class="card-body">
                        <h6 class="fw-bold">${p.nama}</h6>

                        <small class="text-secondary">${p.kategori}</small>

                        <div class="my-2">
                            ${statusStok(p.stok)}
                        </div>

                        <h6 class="text-primary fw-bold">
                            ${rupiah(p.harga)}
                        </h6>

                        <small class="text-secondary">
                            Stok: ${p.stok}
                        </small>

                        <button class="btn btn-primary btn-sm w-100 mt-2"
                            onclick="tambahKeranjang(${p.id})"
                            ${p.stok === 0 ? "disabled" : ""}>
                            <i class="bi bi-cart-plus"></i>
                            ${p.stok === 0 ? "Stok Habis" : "Beli"}
                        </button>

                        <div class="d-flex gap-1 mt-2">
                            <button class="btn btn-outline-secondary btn-sm w-50"
                                onclick="editProduk(${p.id})">
                                Edit
                            </button>

                            <button class="btn btn-outline-danger btn-sm w-50"
                                onclick="hapusProduk(${p.id})">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// TAMBAH PRODUK
function tambahProduk() {
    const nama = prompt("Masukkan nama produk:");
    if (!nama || !nama.trim()) return;

    const kategori = prompt("Kategori Makanan atau Minuman:");

    if (!["Makanan", "Minuman"].includes(kategori)) {
        alert("Kategori harus Makanan atau Minuman!");
        return;
    }

    const harga = Number(prompt("Masukkan harga produk:"));

    if (!Number.isSafeInteger(harga) || harga <= 0) {
        alert("Harga tidak valid!");
        return;
    }

    const stok = Number(prompt("Masukkan stok produk:"));

    if (!Number.isSafeInteger(stok) || stok < 0) {
        alert("Stok tidak valid!");
        return;
    }

    const gambar = prompt("Masukkan link gambar produk:") ||
        "https://placehold.co/400x250?text=Produk";

    produk.push({
        id: Date.now(),
        nama: nama.trim(),
        kategori,
        harga,
        stok,
        gambar
    });

    simpanProduk();
    tampilkanSemua();

    alert("Produk berhasil ditambahkan!");
}

// EDIT PRODUK
function editProduk(id) {
    const p = produk.find(item => item.id === id);
    if (!p) return;

    const nama = prompt("Nama produk:", p.nama);
    if (!nama || !nama.trim()) return;

    const harga = Number(prompt("Harga produk:", p.harga));
    if (!Number.isSafeInteger(harga) || harga <= 0) {
        alert("Harga tidak valid!");
        return;
    }

    const stok = Number(prompt("Stok produk:", p.stok));
    if (!Number.isSafeInteger(stok) || stok < 0) {
        alert("Stok tidak valid!");
        return;
    }

    p.nama = nama.trim();
    p.harga = harga;
    p.stok = stok;

    simpanProduk();
    tampilkanSemua();

    alert("Produk berhasil diperbarui!");
}

// HAPUS PRODUK
function hapusProduk(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    produk = produk.filter(p => p.id !== id);
    keranjang = keranjang.filter(k => k.id !== id);

    simpanProduk();
    tampilkanSemua();
}

// TAMBAH KE KERANJANG
function tambahKeranjang(id) {
    const p = produk.find(item => item.id === id);

    if (!p || p.stok <= 0) {
        alert("Stok produk habis!");
        return;
    }

    const item = keranjang.find(k => k.id === id);

    if (item) {
        if (item.jumlah >= p.stok) {
            alert("Jumlah pembelian melebihi stok!");
            return;
        }
        item.jumlah++;
    } else {
        keranjang.push({
            id: p.id,
            nama: p.nama,
            harga: p.harga,
            jumlah: 1
        });
    }

    tampilkanSemua();
}

// UBAH JUMLAH KERANJANG
function ubahJumlah(id, perubahan) {
    const item = keranjang.find(k => k.id === id);
    const p = produk.find(k => k.id === id);

    if (!item || !p) return;

    const jumlahBaru = item.jumlah + perubahan;

    if (jumlahBaru > p.stok) {
        alert("Stok tidak mencukupi!");
        return;
    }

    if (jumlahBaru <= 0) {
        keranjang = keranjang.filter(k => k.id !== id);
    } else {
        item.jumlah = jumlahBaru;
    }

    tampilkanSemua();
}

// HITUNG TOTAL
function hitungTotal() {
    return keranjang.reduce((total, item) =>
        total + item.harga * item.jumlah, 0
    );
}

// TAMPILKAN KERANJANG
function tampilkanKeranjang() {
    const tempat = document.getElementById("keranjang");

    if (keranjang.length === 0) {
        tempat.innerHTML = `
            <div class="text-center py-4 text-secondary">
                <i class="bi bi-basket3 fs-1"></i>
                <p class="mt-2">Keranjang masih kosong.</p>
            </div>`;
    } else {
        tempat.innerHTML = keranjang.map(item => `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-center gap-2">

                    <div>
                        <strong>${item.nama}</strong>
                        <div class="small text-secondary">
                            ${rupiah(item.harga)} x ${item.jumlah}
                        </div>
                    </div>

                    <div class="text-end">
                        <strong>${rupiah(item.harga * item.jumlah)}</strong>

                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary"
                                onclick="ubahJumlah(${item.id},-1)">−</button>

                            <button class="btn btn-sm btn-outline-secondary"
                                onclick="ubahJumlah(${item.id},1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("totalBelanja").textContent =
        rupiah(hitungTotal());

    hitungKembalian();
}

// KALKULATOR KEMBALIAN
function hitungKembalian() {
    const metode = document.getElementById("metode").value;
    const bagianTunai = document.getElementById("bagianTunai");

    const uang = Number(document.getElementById("uangBayar").value) || 0;
    const total = hitungTotal();

    bagianTunai.style.display = metode === "Tunai" ? "block" : "none";

    if (metode !== "Tunai") {
        document.getElementById("kembalian").textContent = rupiah(0);
        document.getElementById("statusPembayaran").textContent = "";
        return;
    }

    const selisih = uang - total;

    document.getElementById("kembalian").textContent =
        rupiah(Math.max(0, selisih));

    document.getElementById("statusPembayaran").textContent =
        uang < total ? "Uang pembayaran masih kurang!" : "Pembayaran mencukupi.";
}

// PROSES TRANSAKSI
function prosesTransaksi() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    // VALIDASI STOK
    for (const item of keranjang) {
        const p = produk.find(k => k.id === item.id);

        if (!p || p.stok < item.jumlah) {
            alert("Stok " + item.nama + " tidak mencukupi!");
            tampilkanSemua();
            return;
        }
    }

    const total = hitungTotal();
    const metode = document.getElementById("metode").value;
    const uang = Number(document.getElementById("uangBayar").value) || 0;

    if (metode === "Tunai" && uang < total) {
        alert("Uang pembayaran kurang!");
        return;
    }

    const waktu = new Date();
    const kembalian = metode === "Tunai" ? uang - total : 0;

    // KURANGI STOK
    keranjang.forEach(item => {
        const p = produk.find(k => k.id === item.id);
        p.stok -= item.jumlah;
    });

    // SIMPAN TRANSAKSI
    const transaksi = {
        id: Date.now(),
        waktu: waktu.toLocaleString("id-ID"),
        tanggal: waktu.toLocaleDateString("en-CA"),
        total,
        metode,
        uang: metode === "Tunai" ? uang : total,
        kembalian,
        items: keranjang.map(item => ({...item}))
    };

    riwayat.unshift(transaksi);

    simpanProduk();
    simpanRiwayat();

    cetakNota(transaksi);

    keranjang = [];
    document.getElementById("uangBayar").value = "";

    tampilkanSemua();

    alert("Transaksi berhasil disimpan!");

    window.print();
}

// CETAK NOTA
function cetakNota(t) {
    const tempat = document.getElementById("receipt");

    tempat.innerHTML = `
        <div style="text-align:center">
            <h3>MINI POS</h3>
            <p>Kasir Digital</p>
            <hr>
        </div>

        <p>No: ${t.id}</p>
        <p>Waktu: ${t.waktu}</p>
        <hr>

        ${t.items.map(item => `
            <div style="margin-bottom:10px">
                ${item.nama}<br>
                ${item.jumlah} x ${rupiah(item.harga)}
                <span style="float:right">
                    ${rupiah(item.harga * item.jumlah)}
                </span>
            </div>
        `).join("")}

        <hr>
        <p>Total: <strong>${rupiah(t.total)}</strong></p>
        <p>Metode: ${t.metode}</p>
        <p>Bayar: ${rupiah(t.uang)}</p>
        <p>Kembalian: ${rupiah(t.kembalian)}</p>
        <hr>
        <p style="text-align:center">
            Terima kasih telah berbelanja!
        </p>
    `;
}

// RIWAYAT TRANSAKSI
function tampilkanRiwayat() {
    const tempat = document.getElementById("daftarRiwayat");

    if (riwayat.length === 0) {
        tempat.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-secondary">
                    Belum ada transaksi
                </td>
            </tr>`;
        return;
    }

    tempat.innerHTML = riwayat.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${t.waktu}</td>
            <td>${rupiah(t.total)}</td>
            <td>
                <span class="badge bg-primary">${t.metode}</span>
            </td>
        </tr>
    `).join("");
}

// DASHBOARD
function tampilkanDashboard() {
    const hariIni = new Date().toLocaleDateString("en-CA");

    const transaksiHariIni = riwayat.filter(t =>
        t.tanggal === hariIni
    );

    const omzet = transaksiHariIni.reduce((sum, t) =>
        sum + t.total, 0
    );

    const stok = produk.reduce((sum, p) =>
        sum + p.stok, 0
    );

    document.getElementById("omzet").textContent = rupiah(omzet);
    document.getElementById("totalStok").textContent = stok;
    document.getElementById("jumlahTransaksi").textContent =
        transaksiHariIni.length;
}

// TAMPILKAN SEMUA
function tampilkanSemua() {
    tampilkanProduk();
    tampilkanKeranjang();
    tampilkanRiwayat();
    tampilkanDashboard();
}

// JALANKAN APLIKASI
tampilkanSemua();
