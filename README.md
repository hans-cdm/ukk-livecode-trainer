# ⌨️ UKK LiveCode Simulator: Kalkulator Sederhana

Aplikasi latihan simulasi **Live Coding UKK (Uji Kompetensi Keahlian)** untuk siswa SMK Jurusan RPL (Rekayasa Perangkat Lunak) / SIJA / TKJ. Dibuat khusus untuk melatih memori otot jari, ketenangan, pemahaman logika baris per baris, dan kemampuan berkomunikasi saat diuji langsung oleh guru penguji.

![Preview Simulator](https://img.shields.io/badge/UKK-LiveCoding_Simulator-3b82f6?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Status](https://img.shields.io/badge/Status-Ready_For_Exam-10b981?style=for-the-badge)

---

## 🚀 Masalah yang Diselesaikan

Banyak siswa merasa cemas ketika diminta **live coding di depan guru penguji**:
1. Bingung harus mulai dari mana tanpa bantuan Copilot / Autocomplete.
2. Sering lupa sintaks dasar (seperti titik koma `;`, kurung kurawal `{}`, atau nama fungsi DOM).
3. Gugup ketika penguji tiba-tiba bertanya: *"Coba jelaskan fungsi baris ini untuk apa?"*.

**UKK LiveCode Simulator** memberikan solusi berupa **Layar Bayangan (Ghost Code Overlay)**: Anda mengetik langsung di atas teks transparan hingga terbiasa, memahami alurnya, dan siap mengetik mandiri saat ujian sebenarnya!

---

## ✨ Fitur-Fitur Utama

### 1. 👻 Ghost Code Overlay (Mengetik di Atas Teks Transparan)
- Teks target kalkulator ditampilkan secara transparan di editor.
- Karakter yang diketik benar akan langsung menyala terang secara real-time.
- Salah ketik akan ditandai dengan warna merah dan getaran lembut agar memori otot tidak salah jalan.
- Dilengkapi kursor *caret* yang otomatis mengikuti posisi ketikan dan melakukan *auto-scroll*.

### 2. 🎚️ 4 Tingkat Kesulitan Latihan
1. **Ghost 100% (Pemula)**: Teks panduan transparan terlihat jelas untuk membentuk kebiasaan awal.
2. **Ghost 30% (Menengah)**: Teks panduan memudar samar-samar, mulai menguji ingatan.
3. **Kisi-kisi Saja (Mahir)**: Hanya menampilkan komentar arahan dan struktur.
4. **Mode Ujian Asli (Blind Test)**: Layar kosong seperti ujian sesungguhnya di depan penguji!

### 3. 🎓 Kartu "Tips Guru & Jawaban Penguji"
Setiap kali Anda berada di baris tertentu, panel samping akan menampilkan:
- **Analisis Konsep**: Mengapa baris ini ditulis.
- **Kalimat Jawaban ke Guru**: Contoh kalimat santun dan teknis yang bisa Anda ucapkan langsung jika ditanya penguji (contoh: *"Pak, di baris ini saya memakai `parseFloat()` agar input string dikonversi ke desimal..."*).

### 4. ⚡ Live Preview Interaktif
Kalkulator yang sedang Anda ketik dapat langsung dicoba dan diklik pada tab **Preview** sehingga Anda tahu hasil nyata dari kode yang dibuat.

### 5. 🔊 Mechanical Keyboard Sound Effect
Dilengkapi efek suara ketikan keyboard mekanikal (disintesis murni menggunakan *Web Audio API* tanpa perlu download file audio eksternal) untuk meningkatkan fokus dan sensasi latihan.

### 6. ✏️ Mode Kisi-Kisi Sendiri (Custom Code)
Punya kisi-kisi atau contoh kode khusus dari guru sekolah Anda? Cukup salin dan tempel di tab **Kisi-kisi Sendiri**, sistem akan otomatis membuatkan sesi latihan bayangan untuk kode tersebut!

---

## 📚 Bank Modul Bawaan UKK

| Modul | Bahasa | Fokus Ujian |
|---|---|---|
| **1. Logika Kalkulator** | JavaScript (Vanilla) | State variable, DOM Manipulation, Switch-case, Division by Zero validation |
| **2. Struktur UI Kalkulator** | HTML5 Semantic | Layout container, display screen, grid button onclick events |
| **3. Styling & Tata Letak** | CSS Grid & Flexbox | CSS Reset, `grid-template-columns: repeat(4, 1fr)`, button hover |
| **4. CLI Interaktif** | Python 3 | Function modularity (`def`), `try-except ValueError`, `while True` loop |
| **5. Form POST Kalkulator** | PHP Native | `$_POST`, `isset()`, `is_numeric()`, pencegahan XSS dengan `htmlspecialchars()` |

---

## 🛠️ Cara Menjalankan

Tidak perlu install Node.js, database, ataupun dependensi rumit:

1. Klik ganda file `buka-aplikasi.bat`
   *Atau*
2. Buka file `index.html` langsung dengan klik kanan &rarr; **Open with Chrome / Edge / Firefox**.

---

## 💡 Tips Rahasia Sukses Ujian UKK Live Coding

1. **Ketik dengan Tenang**: Jangan panik jika salah ketik, cukup tekan `Backspace` dan perbaiki.
2. **Bicara Sambil Mengetik**: Guru penguji lebih menyukai siswa yang aktif berkomunikasi. Jelaskan alur kerja program Anda langkah demi langkah.
3. **Pahami 4 Tahapan Utama**:
   - **Input**: Menangkap data dari pengguna.
   - **Validasi**: Memastikan angka valid & mencegah pembagian nol.
   - **Proses**: Melakukan operasi matematika.
   - **Output**: Menampilkan hasil akhir ke layar.

---

*Dibuat untuk portofolio dan persiapan sukses Uji Kompetensi Keahlian (UKK).*
