# ⌨️ UKK LiveCode Simulator: Kalkulator Web Sederhana

Aplikasi simulasi latihan **Live Coding UKK (Uji Kompetensi Keahlian)** untuk siswa SMK Jurusan RPL (Rekayasa Perangkat Lunak) / SIJA. Dibuat khusus untuk melatih memori otot jari, ketenangan, pemahaman logika baris per baris, dan kemampuan menjawab pertanyaan guru penguji saat demonstrasi koding langsung.

![UKK Simulator](https://img.shields.io/badge/UKK-Web_Calculator_Trainer-3b82f6?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Web_HTML_CSS_JS-10b981?style=for-the-badge)

---

## ⚡ Pembaruan Terbaru (Update v2)

1. **Tampilan Editor Vertikal Multi-Line Sejati (VS Code Style)**:
   - Setiap baris kode sekarang benar-benar turun ke bawah (`div.code-line`), bukan 1 baris mendatar yang memanjang.
   - Dilengkapi penomoran baris vertikal yang sinkron dan highlight baris aktif.

2. **⚡ Fitur Auto-Indent Cerdas (Bebas Tekan Spasi Berulang Kali)**:
   - Saat Anda menekan `Enter` dan masuk ke dalam blok fungsi atau percabangan (`if`, `try`, dsb.), **spasi indentasi awal baris otomatis terisi dan dilewati**.
   - Kursor langsung mendarat di huruf pertama kode yang harus diketik (contoh: langsung ke `d` pada `document.getElementById`).

3. **Kodingan Ringkas & Mudah Dihafal (Fokus Khusus Web UKK)**:
   - Menghilangkan kode bahasa lain (tidak ada Java atau C++).
   - Menggunakan kode kalkulator web yang super ringkas (hanya 14 baris untuk logika JavaScript), sehingga sangat mudah dihafal di luar kepala saat ujian langsung di depan guru!

---

## ✨ Fitur-Fitur Utama

### 1. 👻 Ghost Code Overlay (Mengetik di Atas Teks Transparan)
- Teks target kalkulator ditampilkan secara transparan di editor.
- Karakter yang diketik benar akan otomatis menyala terang secara real-time.
- Salah ketik akan ditandai dengan warna merah dan getaran lembut.
- Dilengkapi kursor *caret* yang otomatis mengikuti posisi ketikan dan *auto-scroll*.

### 2. 🎚️ 4 Tingkat Kesulitan Latihan
1. **Ghost 100% (Pemula)**: Teks panduan transparan terlihat jelas untuk membentuk kebiasaan awal.
2. **Ghost 30% (Menengah)**: Teks panduan memudar samar-samar, mulai menguji ingatan.
3. **Kisi-kisi Saja (Mahir)**: Hanya menampilkan garis besar logika baris.
4. **Mode Ujian Asli (Blind Test)**: Layar kosong seperti ujian sesungguhnya di depan penguji!

### 3. 🎓 Kartu "Tips Guru & Jawaban Penguji"
Setiap kali Anda berada di baris tertentu, panel samping menampilkan:
- **Analisis Konsep**: Mengapa baris ini ditulis.
- **Kalimat Jawaban ke Guru**: Contoh kalimat santun dan teknis yang bisa Anda ucapkan langsung jika ditanya penguji.

### 4. ⚡ Live Preview Interaktif
Kalkulator web yang sedang Anda ketik dapat langsung dicoba dan diklik pada tab **Preview** sehingga Anda tahu hasil nyata dari kodingan yang dibuat.

### 5. 🔊 Mechanical Keyboard Sound Effect
Dilengkapi efek suara ketikan keyboard mekanikal (Web Audio API) untuk meningkatkan fokus dan sensasi koding.

### 6. ✏️ Mode Kisi-Kisi Sendiri (Custom Code)
Punya script kalkulator khusus dari guru sekolah Anda? Cukup paste di tab **Kisi-kisi Sendiri**, sistem akan otomatis membuatkan sesi latihan bayangan untuk kode tersebut!

---

## 📚 Bank Modul Ringkas Web Kalkulator

| Modul | Bahasa | Jumlah Baris | Keunggulan untuk UKK |
|---|---|---|---|
| **1. JavaScript Ringkas** | Vanilla JS | ~14 Baris | Paling cepat dihafal (fungsi `masukkan`, `hitung`, `hapus`) |
| **2. Struktur HTML** | HTML5 | ~24 Baris | Layar input readonly dan tombol grid dengan inline `onclick` |
| **3. Desain CSS** | CSS Grid | ~28 Baris | CSS Grid 4 kolom simetris dan warna gelap modern |
| **4. All-In-One (1 File)** | HTML + CSS + JS | ~50 Baris | Format 1 file `index.html` lengkap yang sering diminta penguji |
| **5. Logika Bersih Non-Eval** | Vanilla JS | ~26 Baris | Alternatif jika guru melarang penggunaan fungsi `eval()` |

---

## 🛠️ Cara Menjalankan

1. Masuk ke folder proyek: `ukk-livecode-trainer`
2. Klik ganda file `buka-aplikasi.bat`
   *Atau*
3. Buka file `index.html` langsung dengan klik kanan &rarr; **Open with Chrome / Edge**.

---

*Dibuat untuk portofolio dan persiapan sukses Uji Kompetensi Keahlian (UKK).*
