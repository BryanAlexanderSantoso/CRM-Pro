# CRM Pro - Enterprise Customer Relationship Management

CRM Pro adalah solusi manajemen hubungan pelanggan (CRM) modern yang dibangun dengan teknologi mutakhir untuk membantu bisnis mengelola data pelanggan, tim, dan penjualan dengan efisiensi tinggi.

## 🚀 Fitur Utama

### 1. Dashboard Analitik
- Visualisasi data pendapatan secara real-time.
- Statistik pelanggan baru dan total penjualan.
- Grafik interaktif untuk memantau performa bisnis.

### 2. Manajemen Pelanggan (CRM Core)
- Database pelanggan terpusat.
- Sistem **Lead Scoring** otomatis untuk memprioritaskan prospek.
- Pelacakan status pelanggan (Lead, Prospect, Customer).
- Penugasan pelanggan ke anggota tim tertentu.

### 3. Pelacakan Penjualan (Sales Tracking)
- Pencatatan transaksi penjualan yang detail.
- Monitor status pembayaran (Pending, Completed, Cancelled).
- Riwayat penjualan per pelanggan.

### 4. Manajemen Tugas (Task Management)
- Sistem **Kanban Board** yang intuitif.
- Drag-and-drop tugas antar status (Todo, In Progress, Done).
- Penugasan tugas ke anggota tim dengan tenggat waktu.

### 5. Manajemen Tim & RBAC
- **Role-Based Access Control (RBAC)** dengan 3 level akses:
  - **Owner**: Akses penuh ke seluruh sistem dan manajemen tim.
  - **Manager**: Mengelola pelanggan, penjualan, dan tugas tim.
  - **Karyawan**: Fokus pada tugas dan pelanggan yang ditugaskan.
- Sistem registrasi cerdas: Pendaftar pertama otomatis menjadi Owner.

### 6. Keamanan & Logs
- Autentikasi aman menggunakan Supabase Auth.
- **Activity Logs**: Mencatat setiap aktivitas penting dalam sistem untuk audit.
- Row Level Security (RLS) pada database untuk memastikan keamanan data.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Drag & Drop**: [DnD Kit](https://dndkit.com/)
- **Notifications**: [Sonner](https://react-hot-toast.com/sonner)

## ⚙️ Panduan Instalasi (Setup)

Ikuti langkah-langkah berikut untuk menjalankan project ini di lingkungan lokal Anda:

### 1. Clone Repositori
```bash
git clone <url-repository-anda>
cd crm-webapp
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Database (Supabase)
1. Buat project baru di [Supabase Dashboard](https://database.new).
2. Pergi ke **SQL Editor** dan jalankan isi dari file `database.sql` yang tersedia di root folder project ini. Ini akan membuat tabel, fungsi, dan trigger yang diperlukan.
3. Pergi ke **Project Settings** > **API**.
4. Salin `Project URL`, `anon public key`, dan `service_role key`.

### 4. Konfigurasi Environment Variables
Buat file baru bernama `.env` di root direktori (gunakan `.env.example` sebagai referensi):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## 📊 Struktur Database
Project ini menggunakan skema database berikut:
- `profiles`: Data pengguna dan peran (role).
- `customers`: Data pelanggan dan status lead.
- `sales`: Catatan transaksi penjualan.
- `tasks`: Manajemen tugas tim.
- `activity_logs`: Log aktivitas sistem.

---
Dikembangkan dengan ❤️ untuk efisiensi bisnis Anda.
