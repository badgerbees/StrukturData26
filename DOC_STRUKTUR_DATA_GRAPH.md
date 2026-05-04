# Analisis Intensif Struktur Data: Graph (DAG) & DFS Traversal
## Proyek: Silicon Forge Tycoon (Implementasi Tugas Struktur Data)

Dokumen ini menyajikan analisis mendalam mengenai arsitektur perangkat lunak dan pilihan struktur data yang digunakan dalam pengembangan mesin *crafting* pada aplikasi *Silicon Forge Tycoon*.

---

### 1. Arsitektur Graf: Directed Acyclic Graph (DAG)
Sistem *Tech Tree* dalam aplikasi ini dimodelkan sebagai **Directed Acyclic Graph (DAG)**. Pemilihan struktur ini didasarkan pada karakteristik ketergantungan bahan baku:

- **Formalisme Matematika**: Graf $G = (V, E)$ di mana $V$ adalah himpunan *Vertex* (item/produk) dan $E$ adalah himpunan *Edge* (ketergantungan). 
- **Sifat Berarah (Directed)**: Jika terdapat edge $(u, v) \in E$, maka item $u$ adalah prasyarat untuk membuat item $v$.
- **Sifat Acyclic (Tanpa Siklus)**: Hal ini krusial untuk mencegah *infinite recursion* dalam algoritma crafting. Secara logis, produk akhir tidak boleh menjadi bahan baku bagi komponen penyusunnya sendiri.

### 2. Representasi Data: Adjacency List
Aplikasi menggunakan **Adjacency List** (Daftar Kedekatan) alih-alih *Adjacency Matrix*.

**Alasan Teknis (Justifikasi Efisiensi):**
1. **Space Complexity**: Karena graf ini bersifat *sparse* (jumlah edge jauh lebih sedikit dibanding $V^2$), Adjacency List lebih hemat memori dengan kompleksitas $O(V + E)$.
2. **Iterasi Cepat**: Saat melakukan validasi bahan baku, kita hanya perlu mengiterasi tetangga langsung (*outgoing edges*), yang sangat cepat dilakukan dengan daftar kedekatan.

```javascript
// Cuplikan representasi internal
this.adjacencyList = {
  'pc': [
    { id: 'ram', count: 1 },
    { id: 'cpu', count: 1 },
    { id: 'silicon', count: 5 }
  ],
  // ...
};
```

### 3. Analisis Algoritma: Depth-First Search (DFS)
Algoritma utama dalam validasi crafting adalah **Depth-First Search (DFS)** dengan pendekatan rekursif.

#### Mekanisme Kerja Intensif:
Algoritma menelusuri graf secara vertikal hingga mencapai *base node* (Tier 1/Raw Materials). 

1. **Inisiasi**: DFS dipanggil pada node target (misalnya 'PC').
2. **Eksplorasi Rekursif**: Untuk setiap prasyarat $p \in adj[target]$, algoritma memanggil dirinya sendiri secara rekursif: $DFS(p, depth + 1)$.
3. **Pengecekan Inventaris**: Pada setiap langkah, sistem memvalidasi `inventoryCount` terhadap `requiredCount`.
4. **Visualisasi Terminal**: Parameter `depth` digunakan untuk memberikan indentasi pada log terminal, memberikan gambaran visual proses penelusuran graf kepada pengguna secara *real-time*.

#### Analisis Kompleksitas:
- **Time Complexity**: $O(V + E)$. Dalam skenario terburuk, algoritma mengunjungi setiap node dan memeriksa setiap edge satu kali.
- **Space Complexity**: $O(V)$ karena tumpukan rekursi (*recursion stack*) dapat mencapai kedalaman maksimum sejumlah node dalam graf.

### 4. Studi Kasus: Traversal Kompleks
Saat pengguna mencoba membuat **High-End PC**, alur DFS adalah sebagai berikut:

1. **Visit PC**
   - → Sub-traversal: **RAM**
     - → Sub-traversal: **Microchip** (Check stock)
     - → Sub-traversal: **PCB** (Check stock)
   - → Sub-traversal: **CPU**
     - → Sub-traversal: **Microchip**
     - → Sub-traversal: **Silicon**
   - → Sub-traversal: **Silicon** (Direct requirement)
   - → Sub-traversal: **Copper** (Direct requirement)

### 5. Keunggulan Implementasi
1. **Modularitas**: Penambahan item baru (node) hanya membutuhkan satu baris kode `addNode` dan `addEdge`.
2. **Integritas Data**: Logika `performCraft` memastikan atomisitas data; bahan baku dikurangi secara sinkron segera setelah validasi DFS mengembalikan nilai `true`.
3. **User Experience**: Terminal log memberikan transparansi mengenai mengapa sebuah item tidak bisa dibuat (menunjukkan prasyarat spesifik yang gagal di kedalaman tertentu).

---
**Kesimpulan**: Implementasi Graph dengan DFS ini memberikan fondasi yang kuat, skalabel, dan efisien untuk sistem manufaktur dalam simulasi ini, memenuhi standar akademik struktur data tingkat lanjut.
