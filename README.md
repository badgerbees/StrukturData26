# Silicon Forge Tycoon — Graph Structure Implementation

Silicon Forge Tycoon adalah sebuah aplikasi simulasi industri berbasis web yang dikembangkan untuk mendemonstrasikan penerapan struktur data **Graph** (khususnya *Directed Acyclic Graph* atau DAG) dalam sistem manufaktur yang kompleks. Proyek ini menggunakan algoritma **Depth-First Search (DFS)** untuk melakukan validasi dependensi bahan baku secara rekursif.

## 🚀 Deskripsi Project
Aplikasi ini mensimulasikan alur produksi komponen teknologi dari bahan mentah hingga menjadi produk akhir (seperti MacBook Pro dan AI Server). 

### Fitur Utama:
*   **Graph-Based Tech Tree**: Representasi pohon teknologi menggunakan *Adjacency List*.
*   **DFS Traversal Analyzer**: Terminal sistem yang menampilkan log penelusuran DFS secara real-time untuk setiap proses *crafting*.
*   **4-Tier Production Chain**: Alur produksi yang terdiri dari Raw Materials, Basic Components, Advanced Components, hingga Final Products.
*   **Security System**: Implementasi *Anti-Autoclicker* untuk mencegah spamming dan menjaga stabilitas performa algoritma.
*   **Modern UI**: Antarmuka premium dengan animasi dinamis menggunakan React dan TailwindCSS.

## 🛠️ Tech Stack
*   **Frontend**: React.js (Hooks, Refs)
*   **Build Tool**: Vite
*   **Logic**: Pure JavaScript (Graph Data Structure)
*   **Styling**: CSS & TailwindCSS

## 📦 Cara Install Dependencies
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di sistem Anda.

1.  Clone repository ini:
    ```bash
    git clone https://github.com/badgerbees/StrukturData26.git
    ```
2.  Masuk ke direktori project:
    ```bash
    cd tugasStrukturData
    ```
3.  Instal seluruh dependencies yang diperlukan:
    ```bash
    npm install
    ```

## ⚡ Cara Menjalankan Project
Setelah proses instalasi dependencies selesai, Anda dapat menjalankan project di lingkungan lokal:

1.  Jalankan server pengembangan (development server):
    ```bash
    npm run dev
    ```
2.  Buka browser dan akses alamat yang tertera di terminal (biasanya `http://localhost:5173`).

---
*Proyek ini dikembangkan sebagai bagian dari tugas mata kuliah Struktur Data untuk mendemonstrasikan implementasi algoritma Graph dalam skenario dunia nyata.*
