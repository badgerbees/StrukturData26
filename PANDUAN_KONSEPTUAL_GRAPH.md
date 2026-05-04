# Panduan Konsep: Bagaimana "Pohon Teknologi" Bekerja?
## Penjelasan Sederhana tentang Struktur Data Graph

Selamat datang di panduan konsep *Silicon Forge Tycoon*! Jika Anda merasa dokumen teknis terlalu berat, halaman ini akan menjelaskan cara kerja logika permainan ini dengan bahasa yang lebih santai dan mudah dimengerti.

---

### 1. Apa itu Graph? (Analogi Sederhana)
Bayangkan sebuah **Peta Jalan** atau **Silsilah Keluarga**. 
- **Titik (Node)**: Adalah kota-kota di peta (dalam game kita, ini adalah barang seperti Besi, Tembaga, atau Komputer).
- **Garis (Edge)**: Adalah jalan yang menghubungkan kota-kota tersebut (dalam game, ini adalah resep pembuatannya).

Dalam game ini, kita menggunakan jenis graf yang disebut **DAG (Directed Acyclic Graph)**. Artinya:
- **Directed (Satu Arah)**: Seperti jalan satu arah. Kamu butuh Silikon untuk membuat Chip, tapi kamu tidak bisa menghancurkan Chip untuk mendapatkan Silikon kembali (dalam logika game ini).
- **Acyclic (Tidak Berputar)**: Tidak ada lingkaran setan. Kamu tidak bisa membutuhkan Barang A untuk membuat Barang B, sementara Barang B sendiri dibutuhkan untuk membuat Barang A.

### 2. Mengapa Menggunakan Graph untuk Game Tycoon?
Pernahkah Anda melihat resep masakan yang rumit?
> "Untuk membuat **Kue**, kamu butuh **Adonan** dan **Toping**. Untuk membuat **Adonan**, kamu butuh **Tepung** dan **Telur**."

Ini adalah sebuah **Graph**. Game ini menggunakan struktur data ini agar komputer bisa melacak semua hubungan ini secara otomatis. Jika kita ingin menambah barang baru, kita cukup menambah "titik" dan "garis" baru tanpa harus merombak seluruh kode program.

### 3. Bagaimana Cara Kerja "Pencarian" Bahan? (Analogi Detektif)
Saat kamu menekan tombol **"Craft"**, sebuah algoritma bernama **DFS (Depth-First Search)** bekerja seperti seorang detektif:

1. **Target**: "Saya ingin membuat PC."
2. **Cek Syarat**: "Apa syaratnya? Oh, butuh CPU dan RAM."
3. **Telusuri Lebih Dalam**: "Oke, sebelum cek RAM, saya cek CPU dulu. CPU butuh apa? Butuh Chip."
4. **Sampai ke Akar**: "Chip butuh apa? Butuh Silikon. Apakah kita punya Silikon? Punya!"
5. **Kembali ke Atas**: "Karena Silikon ada, berarti Chip bisa dibuat. Karena Chip bisa dibuat, berarti CPU bisa dibuat..."

Si detektif ini akan turun sampai ke bahan yang paling dasar (Tier 1) sebelum memutuskan apakah kamu bisa membuat barang yang kamu inginkan.

### 4. Ringkasan Manfaat
- **Rapi**: Hubungan antar barang tidak berantakan.
- **Cepat**: Komputer bisa langsung tahu apa yang kurang hanya dalam sekejap mata.
- **Fleksibel**: Kita bisa membuat pohon teknologi yang sangat rapi dan bercabang banyak layaknya pabrik sungguhan.

---
*Dokumen ini dirancang untuk memberikan gambaran umum bagi siapa saja yang ingin memahami logika di balik layar permainan ini.*
