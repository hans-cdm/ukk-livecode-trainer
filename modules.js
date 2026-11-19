// modules.js - Bank Soal Khusus Web Kalkulator UKK (Ringkas, Pendek, & Mudah Dihafal)
const LESSON_MODULES = [
  {
    id: "js-singkat",
    title: "1. JavaScript - Logika Inti (Versi Singkat 14 Baris)",
    category: "JavaScript",
    language: "javascript",
    badge: "Paling Cepat Dihafal",
    description: "Hanya 3 fungsi utama: masukkan angka, hitung hasil, dan hapus layar. Sangat mudah dihafal saat live coding.",
    code: `function masukkan(nilai) {
    document.getElementById("layar").value += nilai;
}

function hitung() {
    let layar = document.getElementById("layar");
    try {
        layar.value = eval(layar.value);
    } catch (err) {
        layar.value = "Error";
    }
}

function hapus() {
    document.getElementById("layar").value = "";
}`,
    explanations: {
      1: {
        concept: "Fungsi `masukkan(nilai)` mengambil elemen input `#layar` lalu menambahkan (`+=`) angka atau operator yang ditekan.",
        teacherTip: "'Pak/Bu, fungsi ini bertugas menyambungkan karakter angka atau simbol yang diklik tombol ke kolom input layar kalkulator.'"
      },
      5: {
        concept: "Fungsi `hitung()` mengevaluasi ekspresi matematika di layar menggunakan `eval()` dengan proteksi blok `try-catch`.",
        teacherTip: "'Blok try-catch saya gunakan untuk menangani jika pengguna salah memasukkan sintaks matematika (misal: 5++2), sehingga layar menampilkan pesan Error bukannya membuat web macet.'"
      },
      14: {
        concept: "Fungsi `hapus()` mengosongkan nilai teks pada input layar (tombol C / Clear).",
        teacherTip: "'Fungsi ini mereset nilai value pada elemen input layar menjadi string kosong.'"
      }
    }
  },
  {
    id: "html-singkat",
    title: "2. HTML - Struktur Tombol & Layar (Ringkas)",
    category: "HTML",
    language: "html",
    badge: "Struktur Dasar",
    description: "Layar input dan susunan tombol kalkulator sederhana dengan event onclick.",
    code: `<div class="kalkulator">
    <input type="text" id="layar" readonly>
    <div class="tombol">
        <button onclick="hapus()">C</button>
        <button onclick="masukkan('/')">/</button>
        <button onclick="masukkan('*')">*</button>
        <button onclick="masukkan('-')">-</button>

        <button onclick="masukkan('7')">7</button>
        <button onclick="masukkan('8')">8</button>
        <button onclick="masukkan('9')">9</button>
        <button onclick="masukkan('+')">+</button>

        <button onclick="masukkan('4')">4</button>
        <button onclick="masukkan('5')">5</button>
        <button onclick="masukkan('6')">6</button>
        <button onclick="hitung()">=</button>

        <button onclick="masukkan('1')">1</button>
        <button onclick="masukkan('2')">2</button>
        <button onclick="masukkan('3')">3</button>
        <button onclick="masukkan('0')">0</button>
    </div>
</div>`,
    explanations: {
      1: {
        concept: "`<div class='kalkulator'>` sebagai pembungkus utama seluruh komponen kalkulator.",
        teacherTip: "'Elemen pembungkus ini mempermudah kita memberi background kotak dan penataan posisi di CSS.'"
      },
      2: {
        concept: "`<input type='text' id='layar' readonly>` atribut readonly agar pengguna hanya bisa mengetik lewat tombol kalkulator.",
        teacherTip: "'Saya pasang atribut readonly agar layar tidak bisa diketik sembarangan menggunakan keyboard biasa, melainkan murni dari tombol kalkulator.'"
      },
      3: {
        concept: "`<div class='tombol'>` menampung semua tombol yang nantinya ditata 4 kolom dengan CSS Grid.",
        teacherTip: "'Container tombol ini akan kita terapkan display: grid agar otomatis rapi membentuk tombol 4 kolom.'"
      },
      4: {
        concept: "Atribut `onclick='...'` langsung mengeksekusi fungsi JavaScript yang bersangkutan.",
        teacherTip: "'Event listener inline onclick memanggil fungsi JavaScript saat tombol ditekan.'"
      }
    }
  },
  {
    id: "css-singkat",
    title: "3. CSS - Tampilan Grid Sederhana (Mudah)",
    category: "CSS",
    language: "css",
    badge: "Desain Cepat",
    description: "Styling ringkas untuk wadah kalkulator, layar, dan tombol grid 4 kolom.",
    code: `.kalkulator {
    width: 260px;
    margin: 40px auto;
    padding: 20px;
    background: #1e293b;
    border-radius: 12px;
}

#layar {
    width: 100%;
    height: 50px;
    margin-bottom: 15px;
    font-size: 22px;
    text-align: right;
    padding: 8px;
    background: #0f172a;
    color: #38bdf8;
    border: 1px solid #334155;
    border-radius: 6px;
}

.tombol {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

button {
    height: 48px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    background: #334155;
    color: white;
    border: none;
    border-radius: 6px;
}`,
    explanations: {
      1: {
        concept: "`margin: 40px auto;` membuat kotak kalkulator otomatis berada tepat di tengah halaman.",
        teacherTip: "'Margin auto horizontal membuat container otomatis simetris di tengah layar tanpa styling rumit.'"
      },
      9: {
        concept: "`text-align: right;` agar angka pada layar kalkulator muncul dari sisi kanan layaknya kalkulator sungguhan.",
        teacherTip: "'Text-align right disesuaikan dengan standar kalkulator asli di mana angka baru masuk dari sebelah kanan.'"
      },
      21: {
        concept: "`display: grid` dan `grid-template-columns: repeat(4, 1fr)` membagi tombol ke 4 kolom yang sama rata.",
        teacherTip: "'CSS Grid adalah cara tercepat dan paling modern untuk membuat layout tombol kalkulator 4 kolom.'"
      }
    }
  },
  {
    id: "all-in-one",
    title: "4. All-In-One: 1 File HTML Lengkap (Standar UKK)",
    category: "Full Web",
    language: "html",
    badge: "1 File Selesai",
    description: "Gabungan HTML, CSS di tag <style>, dan JS di tag <script>. Solusi paling sering diminta penguji UKK!",
    code: `<!DOCTYPE html>
<html>
<head>
    <title>Kalkulator UKK</title>
    <style>
        body { display: flex; justify-content: center; padding-top: 50px; background: #0f172a; }
        .kalkulator { width: 240px; padding: 15px; background: #1e293b; border-radius: 10px; }
        #layar { width: 100%; height: 45px; font-size: 20px; text-align: right; margin-bottom: 10px; }
        .tombol { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        button { height: 42px; font-size: 16px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="kalkulator">
        <input type="text" id="layar" readonly>
        <div class="tombol">
            <button onclick="hapus()">C</button>
            <button onclick="tambah('/')">/</button>
            <button onclick="tambah('*')">*</button>
            <button onclick="tambah('-')">-</button>
            <button onclick="tambah('7')">7</button>
            <button onclick="tambah('8')">8</button>
            <button onclick="tambah('9')">9</button>
            <button onclick="tambah('+')">+</button>
            <button onclick="tambah('4')">4</button>
            <button onclick="tambah('5')">5</button>
            <button onclick="tambah('6')">6</button>
            <button onclick="hitung()">=</button>
            <button onclick="tambah('1')">1</button>
            <button onclick="tambah('2')">2</button>
            <button onclick="tambah('3')">3</button>
            <button onclick="tambah('0')">0</button>
        </div>
    </div>
    <script>
        function tambah(x) {
            document.getElementById("layar").value += x;
        }
        function hitung() {
            try {
                let l = document.getElementById("layar");
                l.value = eval(l.value);
            } catch(e) {
                document.getElementById("layar").value = "Error";
            }
        }
        function hapus() {
            document.getElementById("layar").value = "";
        }
    </script>
</body>
</html>`,
    explanations: {
      1: {
        concept: "Dokumen HTML lengkap all-in-one yang menyatukan CSS internal dan JavaScript dalam satu file.",
        teacherTip: "'Pak/Bu, untuk kepraktisan live coding UKK, seluruh script dan style saya satukan dalam 1 file agar mudah dijalankan langsung.'"
      },
      30: {
        concept: "Blok script berisi logika: fungsi tambah angka/operator, hitung dengan eval terproteksi try-catch, dan hapus.",
        teacherTip: "'Logika intinya sangat ringkas: tombol mengirim nilainya ke layar, lalu eval menghitung ekspresi matematika di layar.'"
      }
    }
  },
  {
    id: "js-clean-logic",
    title: "5. Logika Bersih Tanpa Eval (Jika Guru Melarang Eval)",
    category: "JavaScript",
    language: "javascript",
    badge: "Standar Pro",
    description: "Versi aman jika penguji meminta kalkulator tanpa fungsi eval(). Menggunakan variabel tampung & switch-case.",
    code: `let angka1 = "";
let operator = "";

function tekan(val) {
    document.getElementById("layar").value += val;
}

function pilihOp(op) {
    angka1 = document.getElementById("layar").value;
    operator = op;
    document.getElementById("layar").value = "";
}

function hasil() {
    let angka2 = document.getElementById("layar").value;
    let a = parseFloat(angka1);
    let b = parseFloat(angka2);
    let res = 0;

    if (operator === "+") res = a + b;
    if (operator === "-") res = a - b;
    if (operator === "*") res = a * b;
    if (operator === "/") res = b !== 0 ? a / b : "Error";

    document.getElementById("layar").value = res;
}

function reset() {
    angka1 = "";
    operator = "";
    document.getElementById("layar").value = "";
}`,
    explanations: {
      1: {
        concept: "Mendeklarasikan variabel `angka1` dan `operator` untuk menyimpan input angka pertama sebelum memilih simbol operasi.",
        teacherTip: "'Variabel ini menyimpan state saat tombol operator (+, -, *, /) ditekan.'"
      },
      8: {
        concept: "Fungsi `pilihOp` mengarsipkan angka pertama lalu membersihkan layar untuk siap menerima angka kedua.",
        teacherTip: "'Saat operator dipilih, angka di layar disimpan ke angka1, kemudian layar dikosongkan untuk input angka berikutnya.'"
      },
      14: {
        concept: "Fungsi `hasil()` mengonversi string ke float dengan `parseFloat` lalu menghitung sesuai operator yang tersimpan.",
        teacherTip: "'Ini logika murni tanpa eval(): mengambil angka kedua, mengonversi dengan parseFloat, lalu menjalankan percabangan operator.'"
      }
    }
  }
];
