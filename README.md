# Titip Jejak — Web (Frontend)

> **EN** | Community-powered missing persons platform for Indonesia.  
> **ID** | Platform pencarian orang hilang berbasis komunitas di Indonesia.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-orange.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Mhabib34/titip-jejak-web/blob/main/CONTRIBUTING.md)

---

## 🇬🇧 English

### What is Titip Jejak?

Titip Jejak connects missing persons reporters, finders, and volunteers through technology. When someone goes missing, every minute counts — Titip Jejak helps information spread faster and reach the right people.

- Report and browse missing persons cases
- Auto-matching between reports based on location and description
- Community volunteer network across Indonesia
- Built as a non-profit, community-first platform

### Repositories

| Repo                                                             | Description                  |
| ---------------------------------------------------------------- | ---------------------------- |
| [`titip-jejak-web`](https://github.com/Mhabib34/titip-jejak-web) | This repo — Next.js frontend |
| [`titip-jejak-api`](https://github.com/Mhabib34/titip-jejak-api) | REST API backend             |

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database/Auth**: Supabase
- **Package Manager**: npm

### Getting Started

#### Prerequisites

- Node.js >= 18
- npm >= 9
- A Supabase project ([create one free](https://supabase.com))
- The API running locally — see [`titip-jejak-api`](https://github.com/Mhabib34/titip-jejak-api)

#### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Mhabib34/titip-jejak-web.git
cd titip-jejak-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env
# Fill in your Supabase and API values in .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

#### Environment Variables

| Variable              | Description                  |
| --------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of`titip-jejak-api` |

### Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the **GNU Affero General Public License v3.0**.  
See [LICENSE](./LICENSE) for details.

Anyone who deploys a modified version of this platform **must** make their source code available to users.

---

## 🇮🇩 Indonesia

### Apa itu Titip Jejak?

Titip Jejak menghubungkan pelapor, penemu, dan relawan pencarian orang hilang melalui teknologi. Platform ini dibangun sebagai proyek nirlaba berbasis komunitas — bukan produk komersial.

### Repositori

| Repo                                                             | Keterangan                  |
| ---------------------------------------------------------------- | --------------------------- |
| [`titip-jejak-web`](https://github.com/Mhabib34/titip-jejak-web) | Repo ini — frontend Next.js |
| [`titip-jejak-api`](https://github.com/Mhabib34/titip-jejak-api) | Backend REST API            |

### Cara Menjalankan Secara Lokal

```bash
# 1. Clone repo
git clone https://github.com/Mhabib34/titip-jejak-web.git
cd titip-jejak-web

# 2. Install dependensi
npm install

# 3. Salin dan isi environment variable
cp .env

# 4. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Kontribusi

Kontribusi sangat disambut! Baca [CONTRIBUTING.md](./CONTRIBUTING.md) sebelum membuat pull request.

### Lisensi

Proyek ini menggunakan lisensi **GNU Affero General Public License v3.0**.  
Siapapun yang men-deploy ulang versi modifikasi platform ini **wajib** membuka kode sumbernya kepada pengguna.

---

## Contact / Kontak

**Muhammad Habib**  
📧 [mhabib34official@gmail.com](mailto:mhabib34official@gmail.com)  
🐙 GitHub: [@Mhabib34](https://github.com/Mhabib34)
