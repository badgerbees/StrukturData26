# Panduan Konsep: Arsitektur Pohon Teknologi (Tech Tree)
## Tinjauan Strategis Implementasi Graph pada Silicon Forge Tycoon

Dokumen ini menjelaskan filosofi desain dan alasan konseptual di balik penggunaan struktur data Graph untuk mengelola sistem dependensi dalam aplikasi ini.

---

### 1. Paradigma Graph sebagai Fondasi Dependensi
Dalam sistem manufaktur atau simulasi industri, hubungan antar komponen jarang bersifat linier. Satu produk akhir seringkali bergantung pada beberapa komponen antara, yang mana komponen tersebut juga memiliki bahan baku dasarnya sendiri.

Struktur data **Graph** dipilih karena kemampuannya dalam memodelkan hubungan "Banyak-ke-Banyak" (Many-to-Many) secara efisien. Dalam konteks ini:
- **Node (Vertex)**: Merepresentasikan entitas produk atau material.
- **Edge (Sisi)**: Merepresentasikan alur produksi atau kebutuhan material.

### 2. Implementasi Directed Acyclic Graph (DAG)
Sistem ini menggunakan spesifikasi **DAG** untuk menjamin integritas logika produksi:
- **Directed (Berarah)**: Menegaskan aliran proses produksi dari bahan mentah menuju produk akhir. Aliran ini bersifat searah (irreversible) untuk menjaga konsistensi logika manufaktur.
- **Acyclic (Tanpa Siklus)**: Menjamin bahwa tidak ada dependensi melingkar yang dapat menyebabkan kegagalan sistem atau rekursi tak terbatas. Ini adalah standar industri dalam pemodelan manajemen proyek dan sistem *build*.

### 3. Validasi dengan Depth-First Search (DFS)
Untuk memastikan sebuah produk dapat diproduksi, sistem harus melakukan validasi menyeluruh terhadap seluruh rantai pasokan bahan bakunya. Algoritma **DFS** digunakan untuk melakukan penelusuran hierarkis ini:

- **Eksplorasi Mendalam**: Sistem tidak hanya memeriksa kebutuhan langsung, tetapi melakukan penetrasi ke tingkat paling dasar (Tier 1) untuk memastikan setiap prasyarat terpenuhi.
- **Integritas Rantai Produksi**: Dengan DFS, sistem dapat mengidentifikasi kegagalan pada titik mana pun dalam rantai dependensi sebelum proses pengurangan inventaris dilakukan.

### 4. Nilai Strategis Struktur Data Graph
Penggunaan Graph memberikan keunggulan kompetitif dalam pengembangan perangkat lunak:
- **Skalabilitas Hierarkis**: Memungkinkan penambahan kompleksitas produk baru tanpa perlu mengubah algoritma pencarian.
- **Efisiensi Validasi**: Penelusuran berbasis graf memastikan bahwa hanya jalur dependensi yang relevan yang diperiksa, menghemat sumber daya komputasi.
- **Representasi Logika yang Akurat**: Memodelkan dunia nyata di mana satu bahan baku dapat digunakan untuk berbagai macam produk akhir (misalnya: Silikon digunakan baik untuk RAM maupun CPU).

---
*Dokumen ini disusun untuk memberikan pemahaman tingkat tinggi mengenai arsitektur logika yang mendasari sistem simulasi industri ini.*
