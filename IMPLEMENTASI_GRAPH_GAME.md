# Analisis Implementasi: Struktur Data Graph pada Silicon Forge Tycoon

Dokumen ini merincikan bagaimana struktur data **Graph** diintegrasikan secara teknis ke dalam mekanisme permainan *Silicon Forge Tycoon* untuk mengelola logika produksi dan dependensi material.

---

### 1. Arsitektur Pohon Teknologi (Tech Tree)
Dalam permainan ini, *Tech Tree* tidak hanya sekadar visualisasi, melainkan sebuah **Directed Acyclic Graph (DAG)** aktif yang mengontrol aliran data produksi.

#### Entitas (Nodes):
Setiap item dalam permainan direpresentasikan sebagai sebuah *Vertex* yang memiliki atribut:
- **ID**: Identifier unik (misal: `microchip`, `pc`).
- **Metadata**: Menyimpan informasi tampilan (nama, tier, ikon).
- **State**: Menyimpan jumlah inventaris saat ini (`inventoryCount`).

#### Hubungan (Edges):
Koneksi antar item didefinisikan melalui sisi berarah yang membawa beban (*weighted edges*), di mana bobot tersebut merepresentasikan jumlah bahan yang dibutuhkan.
- Contoh: `addEdge('silicon', 'microchip', 2)` berarti terdapat aliran dari Silikon ke Microchip dengan biaya 2 unit.

### 2. Mekanisme Validasi Crafting (DFS)
Setiap kali pemain melakukan aksi *Craft*, sistem menjalankan algoritma **Depth-First Search (DFS)** untuk melakukan validasi integritas bahan baku.

**Proses Teknis:**
1. **Penelusuran Rekursif**: Sistem melakukan *traversal* dari produk akhir (misal: `pc`) ke bawah melalui seluruh cabang dependensi.
2. **Evaluasi Prasyarat**: Pada setiap tingkat, sistem membandingkan `inventoryCount` pada node prasyarat dengan jumlah yang dibutuhkan.
3. **Pencegahan Kegagalan**: Jika ada satu titik dalam rantai dependensi yang tidak memenuhi syarat, DFS akan mengembalikan nilai `false` dan menghentikan seluruh proses sebelum terjadi mutasi data.

### 3. Sinkronisasi Inventaris dan Graf
Permainan ini menggunakan integrasi antara **React State** dan **Graph Class**:
- Logika validasi dan penghitungan dilakukan di dalam *Class Graph* untuk memastikan pemisahan tugas (*separation of concerns*).
- Hasil dari operasi graf kemudian disinkronkan kembali ke state React untuk memperbarui antarmuka pengguna (UI) secara reaktif.

### 4. Visualisasi Traversal pada Terminal
Salah satu fitur utama adalah penggunaan DFS untuk menghasilkan log sistem yang transparan. Setiap langkah kunjungan node dalam algoritma DFS dikirimkan ke terminal log dengan indentasi yang sesuai dengan kedalaman (*depth*) penelusuran, memberikan pengguna wawasan tentang bagaimana sistem memeriksa dependensi secara hierarkis.

---
**Kesimpulan**: Penggunaan struktur data Graph di sini bukan hanya untuk penyimpanan data, melainkan sebagai mesin inti yang menggerakkan seluruh logika simulasi industri, memastikan konsistensi data dan efisiensi komputasi dalam validasi produksi.
