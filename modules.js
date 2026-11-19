// modules.js - Bank Materi & Kisi-Kisi UKK Kalkulator
const LESSON_MODULES = [
  {
    id: "js-calc",
    title: "1. JavaScript - Logika Kalkulator (Vanilla JS)",
    category: "JavaScript",
    language: "javascript",
    badge: "Logika Inti",
    description: "Fondasi logika kalkulator web: menangkap input angka, memilih operator, menghitung hasil, dan reset layar.",
    code: `// Deklarasi variabel penampung nilai
let currentInput = "0";
let previousInput = "";
let operation = null;

// Menambahkan angka ke layar tampilan
function appendNumber(number) {
    if (number === "." && currentInput.includes(".")) return;
    if (currentInput === "0" && number !== ".") {
        currentInput = number.toString();
    } else {
        currentInput += number.toString();
    }
    updateDisplay();
}

// Memilih operasi matematika (+, -, *, /)
function chooseOperation(op) {
    if (currentInput === "") return;
    if (previousInput !== "") {
        calculate();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = "";
    updateDisplay();
}

// Menghitung hasil berdasarkan operator
function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) return;

    switch (operation) {
        case "+":
            result = prev + curr;
            break;
        case "-":
            result = prev - curr;
            break;
        case "*":
            result = prev * curr;
            break;
        case "/":
            if (curr === 0) {
                alert("Tidak bisa membagi dengan angka nol!");
                clearAll();
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operation = null;
    previousInput = "";
    updateDisplay();
}

// Menghapus semua nilai (Reset / AC)
function clearAll() {
    currentInput = "0";
    previousInput = "";
    operation = null;
    updateDisplay();
}

// Memperbarui teks layar HTML
function updateDisplay() {
    const display = document.getElementById("display");
    if (display) {
        display.innerText = currentInput;
    }
}`,
    explanations: {
      1: {
        concept: "Mendeklarasikan variabel `currentInput`, `previousInput`, dan `operation` untuk menyimpan state angka yang sedang aktif.",
        teacherTip: "'Pak/Bu, variabel ini berfungsi sebagai memori sementara untuk menampung angka pertama, operator yang dipilih, dan angka kedua.'"
      },
      7: {
        concept: "Fungsi `appendNumber` menerima input angka saat tombol diklik dan mencegah penulisan tanda koma desimal ganda (`.` ganda).",
        teacherTip: "'Kondisi `includes('.')` penting agar pengguna tidak bisa memasukkan dua titik desimal yang akan merusak perhitungan.'"
      },
      18: {
        concept: "Fungsi `chooseOperation` menyimpan operator hitung dan memindahkan angka saat ini ke `previousInput`.",
        teacherTip: "'Jika pengguna menekan tombol operator berurutan (misal 5 + 3 + 2), kalkulator langsung menghitung hasil sementara sebelum lanjut.'"
      },
      30: {
        concept: "Fungsi `calculate` mengonversi input string menjadi float dengan `parseFloat()` dan menghitung hasilnya dengan `switch-case`.",
        teacherTip: "'Saya menggunakan `parseFloat()` agar string dikonversi ke angka desimal asli, sehingga operator `+` tidak salah melakukan penggabungan teks (string concatenation).'"
      },
      46: {
        concept: "Validasi pembagian dengan angka 0 (`curr === 0`) untuk menghindari nilai `Infinity` atau error matematika.",
        teacherTip: "'Secara matematis pembagian dengan 0 tidak terdefinisi, jadi saya berikan proteksi alert agar sistem tidak freeze atau menampilkan Infinity.'"
      },
      63: {
        concept: "Fungsi `clearAll` mengembalikan semua variabel ke kondisi awal (reset kalkulator / All Clear).",
        teacherTip: "'Ini fungsi tombol AC/C untuk mereset seluruh variabel penampung ke nilai default.'"
      },
      71: {
        concept: "Fungsi `updateDisplay` memanipulasi DOM dengan mencari elemen layar (`#display`) dan memperbarui teksnya.",
        teacherTip: "'Menggunakan `document.getElementById('display')` untuk menyinkronkan data variabel JavaScript dengan elemen antarmuka HTML.'"
      }
    }
  },
  {
    id: "html-calc",
    title: "2. HTML - Struktur UI Kalkulator",
    category: "HTML",
    language: "html",
    badge: "Antarmuka Semantic",
    description: "Struktur layout semantic HTML5 untuk kalkulator: layar display dan grid tombol.",
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Sederhana UKK</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator-container">
        <!-- Layar Penampil Hasil -->
        <div class="calculator-screen" id="display">0</div>

        <!-- Tombol-tombol Kalkulator -->
        <div class="calculator-keys">
            <button class="btn btn-clear" onclick="clearAll()">AC</button>
            <button class="btn btn-op" onclick="chooseOperation('/')">&divide;</button>
            <button class="btn btn-op" onclick="chooseOperation('*')">&times;</button>
            <button class="btn btn-op" onclick="chooseOperation('-')">-</button>

            <button class="btn" onclick="appendNumber('7')">7</button>
            <button class="btn" onclick="appendNumber('8')">8</button>
            <button class="btn" onclick="appendNumber('9')">9</button>
            <button class="btn btn-op" onclick="chooseOperation('+')">+</button>

            <button class="btn" onclick="appendNumber('4')">4</button>
            <button class="btn" onclick="appendNumber('5')">5</button>
            <button class="btn" onclick="appendNumber('6')">6</button>
            <button class="btn btn-equal" onclick="calculate()">=</button>

            <button class="btn" onclick="appendNumber('1')">1</button>
            <button class="btn" onclick="appendNumber('2')">2</button>
            <button class="btn" onclick="appendNumber('3')">3</button>
            <button class="btn btn-zero" onclick="appendNumber('0')">0</button>
            <button class="btn" onclick="appendNumber('.')">.</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    explanations: {
      1: {
        concept: "`<!DOCTYPE html>` memberi tahu browser bahwa dokumen ini menggunakan standar HTML5 modern.",
        teacherTip: "'Deklarasi DOCTYPE wajib ada di awal agar browser tidak beralih ke quirks mode.'"
      },
      10: {
        concept: "`div.calculator-container` menjadi pembungkus utama (wrapper) yang akan diberi styling flexbox/center di CSS.",
        teacherTip: "'Elemen wrapper ini berfungsi memudahkan penataan posisi kalkulator agar berada pas di tengah layar.'"
      },
      12: {
        concept: "`<div id='display'>` dengan id unik untuk target manipulasi DOM dari file JavaScript.",
        teacherTip: "'Penggunaan atribut ID display mempermudah pemanggilan elemen dari script JavaScript tanpa konflik nama.'"
      },
      15: {
        concept: "`div.calculator-keys` menampung semua tombol yang nantinya ditata rapi menggunakan CSS Grid 4 kolom.",
        teacherTip: "'Tombol dikelompokkan dalam satu container agar mudah diatur tata letaknya memakai layout grid.'"
      },
      16: {
        concept: "Atribut `onclick='...'` menghubungkan tombol langsung ke fungsi JavaScript terkait.",
        teacherTip: "'Setiap tombol memicu event klik yang memanggil fungsi logika di script.js sesuai peran tombolnya.'"
      }
    }
  },
  {
    id: "css-calc",
    title: "3. CSS - Desain & Tata Letak Grid",
    category: "CSS",
    language: "css",
    badge: "Styling Modern",
    description: "Styling CSS Grid 4 kolom, warna kontras modern, dan efek hover responsif.",
    code: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0f172a;
}

.calculator-container {
    width: 320px;
    background: #1e293b;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border: 1px solid #334155;
}

.calculator-screen {
    width: 100%;
    height: 70px;
    background: #0f172a;
    color: #38bdf8;
    font-size: 2.2rem;
    font-weight: bold;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow-x: auto;
}

.calculator-keys {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.btn {
    height: 55px;
    border: none;
    border-radius: 12px;
    background: #334155;
    color: #f8fafc;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
}

.btn:hover {
    background: #475569;
    transform: translateY(-2px);
}

.btn-op {
    background: #3b82f6;
    color: white;
}

.btn-op:hover {
    background: #2563eb;
}

.btn-clear {
    background: #ef4444;
    color: white;
}

.btn-equal {
    grid-row: span 2;
    height: 122px;
    background: #10b981;
    color: white;
}`,
    explanations: {
      1: {
        concept: "CSS Reset: `box-sizing: border-box` memastikan padding dan border tidak menambah ukuran total elemen.",
        teacherTip: "'Box-sizing border-box mencegah bug layout di mana elemen melebihi ukuran container karena adanya padding.'"
      },
      8: {
        concept: "`display: flex` pada body untuk membuat posisi container kalkulator persis di tengah layar horizontal & vertikal.",
        teacherTip: "'Kombinasi `justify-content: center` dan `align-items: center` membuat kalkulator selalu simetris di tengah.'"
      },
      33: {
        concept: "`display: grid` dengan `grid-template-columns: repeat(4, 1fr)` membagi tombol menjadi 4 kolom yang sama lebar.",
        teacherTip: "'CSS Grid sangat ideal untuk kalkulator karena otomatis membentuk matriks tombol 4 kolom yang rapi tanpa perlu float atau margin manual.'"
      },
      63: {
        concept: "`grid-row: span 2` membuat tombol tanda sama dengan (=) memanjang 2 baris ke bawah.",
        teacherTip: "'Properti span 2 membuat tombol hitung utama lebih besar dan mencolok sesuai standar desain kalkulator.'"
      }
    }
  },
  {
    id: "python-calc",
    title: "4. Python - Kalkulator Console Interaktif",
    category: "Python",
    language: "python",
    badge: "CLI & Backend",
    description: "Kalkulator berbasis fungsi Python, penanganan error pembagian nol dengan try-except, dan perulangan while.",
    code: `# Program Kalkulator Sederhana UKK - Python CLI

def tambah(a, b):
    return a + b

def kurang(a, b):
    return a - b

def kali(a, b):
    return a * b

def bagi(a, b):
    if b == 0:
        return "Error: Pembagian dengan nol tidak diperbolehkan!"
    return a / b

def main():
    while True:
        print("\\n=== KALKULATOR UKK ===")
        print("1. Tambah (+)")
        print("2. Kurang (-)")
        print("3. Kali (*)")
        print("4. Bagi (/)")
        print("5. Keluar")

        pilihan = input("Pilih operasi (1-5): ")

        if pilihan == "5":
            print("Terima kasih! Program selesai.")
            break

        if pilihan in ["1", "2", "3", "4"]:
            try:
                angka1 = float(input("Masukkan angka pertama: "))
                angka2 = float(input("Masukkan angka kedua: "))
            except ValueError:
                print("Error: Harap masukkan angka yang valid!")
                continue

            if pilihan == "1":
                print(f"Hasil: {angka1} + {angka2} = {tambah(angka1, angka2)}")
            elif pilihan == "2":
                print(f"Hasil: {angka1} - {angka2} = {kurang(angka1, angka2)}")
            elif pilihan == "3":
                print(f"Hasil: {angka1} * {angka2} = {kali(angka1, angka2)}")
            elif pilihan == "4":
                print(f"Hasil: {angka1} / {angka2} = {bagi(angka1, angka2)}")
        else:
            print("Pilihan menu tidak valid!")

if __name__ == "__main__":
    main()`,
    explanations: {
      3: {
        concept: "Fungsi matematika modular: memecah logika tambah, kurang, kali, bagi ke dalam fungsi independen yang rapi.",
        teacherTip: "'Pak/Bu, memecah operasi ke fungsi terpisah menerapkan prinsip modularitas (Clean Code) sehingga kode mudah di-debug.'"
      },
      12: {
        concept: "Validasi pembagian nol pada fungsi `bagi`: mencegah program crash akibat `ZeroDivisionError`.",
        teacherTip: "'Di baris ini saya tangani kondisi `b == 0` secara eksplisit agar program tidak crash saat user membagi angka nol.'"
      },
      18: {
        concept: "`while True` membuat menu kalkulator terus berjalan berulang kali sampai pengguna memilih opsi 5 untuk keluar.",
        teacherTip: "'Perulangan infinite while dengan perintah `break` di opsi keluar memberikan user experience yang interaktif.'"
      },
      34: {
        concept: "`try-except ValueError` menangkap kesalahan jika pengguna memasukkan huruf atau karakter non-angka.",
        teacherTip: "'Ini bentuk defensive programming untuk mencegah aplikasi berhenti tiba-tiba bila pengguna salah mengetik input.'"
      },
      49: {
        concept: "`if __name__ == '__main__':` memastikan fungsi `main()` hanya dieksekusi saat file dijalankan langsung.",
        teacherTip: "'Struktur boilerplate standar Python agar script ini dapat di-import sebagai modul tanpa langsung mengeksekusi menu.'"
      }
    }
  },
  {
    id: "php-calc",
    title: "5. PHP - Kalkulator Web dengan Form POST",
    category: "PHP",
    language: "php",
    badge: "Web Server-side",
    description: "Kalkulator berbasis PHP Native dengan method POST, percabangan switch-case, dan penanganan form input.",
    code: `<?php
$hasil = "";
$angka1 = "";
$angka2 = "";
$operasi = "";
$error = "";

if (isset($_POST['hitung'])) {
    $angka1 = $_POST['angka1'];
    $angka2 = $_POST['angka2'];
    $operasi = $_POST['operasi'];

    if (!is_numeric($angka1) || !is_numeric($angka2)) {
        $error = "Semua input harus berupa angka!";
    } else {
        switch ($operasi) {
            case "+":
                $hasil = $angka1 + $angka2;
                break;
            case "-":
                $hasil = $angka1 - $angka2;
                break;
            case "*":
                $hasil = $angka1 * $angka2;
                break;
            case "/":
                if ($angka2 == 0) {
                    $error = "Tidak bisa membagi dengan angka 0!";
                } else {
                    $hasil = $angka1 / $angka2;
                }
                break;
            default:
                $error = "Operator tidak valid!";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kalkulator Sederhana UKK PHP</title>
</head>
<body>
    <h2>Kalkulator PHP</h2>
    <form method="POST" action="">
        <input type="text" name="angka1" value="<?= htmlspecialchars($angka1) ?>" placeholder="Angka 1" required>
        <select name="operasi">
            <option value="+" <?= $operasi === '+' ? 'selected' : '' ?>>+</option>
            <option value="-" <?= $operasi === '-' ? 'selected' : '' ?>>-</option>
            <option value="*" <?= $operasi === '*' ? 'selected' : '' ?>>*</option>
            <option value="/" <?= $operasi === '/' ? 'selected' : '' ?>>/</option>
        </select>
        <input type="text" name="angka2" value="<?= htmlspecialchars($angka2) ?>" placeholder="Angka 2" required>
        <button type="submit" name="hitung">Hitung</button>
    </form>
    <?php if ($error): ?>
        <p style="color:red;"><?= $error ?></p>
    <?php elseif ($hasil !== ""): ?>
        <h3>Hasil: <?= $hasil ?></h3>
    <?php endif; ?>
</body>
</html>`,
    explanations: {
      8: {
        concept: "`isset($_POST['hitung'])` memeriksa apakah tombol 'Hitung' pada form HTML sudah ditekan pengguna.",
        teacherTip: "'Fungsi isset() memastikan script kalkulasi hanya dijalankan setelah data form dikirim lewat method POST.'"
      },
      13: {
        concept: "`is_numeric()` memastikan nilai yang dikirim dari input form benar-benar angka untuk mencegah kesalahan kalkulasi.",
        teacherTip: "'Validasi server-side sangat penting karena input HTML bisa dimanipulasi dari sisi klien.'"
      },
      16: {
        concept: "`switch ($operasi)` menentukan rumus perhitungan aritmatika sesuai pilihan dropdown pengguna.",
        teacherTip: "'Struktur switch-case lebih rapi dan efisien daripada if-else bertingkat saat memeriksa nilai operator yang spesifik.'"
      },
      45: {
        concept: "`htmlspecialchars()` mencegah serangan XSS (Cross-Site Scripting) saat menampilkan kembali input pengguna.",
        teacherTip: "'Fungsi htmlspecialchars mengonversi karakter khusus ke entitas HTML agar aman dari celah XSS.'"
      }
    }
  }
];
