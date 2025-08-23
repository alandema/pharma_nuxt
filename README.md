## Medical Prescription App (Next.js + Turso)

Rewrite of former Flask app into Next.js 15 (App Router) using Turso (libSQL) as database.

### Stack
- Next.js 15 App Router
- TypeScript (strict)
- Turso / libSQL via `@libsql/client`
- Zod for runtime validation

### Environment
Create a `.env` (already present) with:
```
TURSO_DATABASE_URL=libsql://...yourdb...
TURSO_AUTH_TOKEN=...token...
```

### Install & Run
```
npm install
npm run dev
```
Database tables auto-create lazily on first page/API access (`migrate()`), no separate migration step yet.

### API Routes (simplified)
| Purpose | Method | Path |
|---------|--------|------|
| List / Create Patients | GET / POST | /api/patients |
| Get / Update / Delete Patient | GET / PUT / DELETE | /api/patients/:id |
| List / Create Prescriptions | GET / POST | /api/prescriptions |
| Get / Delete Prescription | GET / DELETE | /api/prescriptions/:id |
| List / Create CIDs | GET / POST | /api/cids |
| Get / Update / Delete CID | GET / PUT / DELETE | /api/cids/:id |
| List / Create Medications | GET / POST | /api/medications |
| Get / Update / Delete Medication | GET / PUT / DELETE | /api/medications/:id |

### Mapping from Flask routes
| Flask | Next.js |
|-------|---------|
| `/create_prescription` | `/prescriptions/create` (page) |
| `/save_prescription` (POST) | `POST /api/prescriptions` |
| `/delete_prescription/<id>` | `DELETE /api/prescriptions/:id` |
| `/register_patient` | `/patients` page + `/api/patients` & `/api/patients/:id` |
| `/get_patient/<id>` | `GET /api/patients/:id` |
| `/prescriptions_history` | `/prescriptions/history` page + `GET /api/prescriptions` |
| `/view_prescription/<id>` | (future page) + `GET /api/prescriptions/:id` |
| `/edit_cids` | `/cids` page + `/api/cids` endpoints |
| `/get_cid/<id>` | `GET /api/cids/:id` |
| `/edit_medications` | `/medications` page + `/api/medications` |
| `/get_medication/<id>` | `GET /api/medications/:id` |
| `/delete_patient/<id>` (DELETE) | `DELETE /api/patients/:id` |

### TODO (Next steps)
- Build interactive forms & client components
- Add authentication
- Proper migrations & drizzle/ORM integration
- PDF generation for prescriptions
- Input masking/validation for CPF & dates

### Development Notes
- All pages currently just dump JSON for rapid backend parity.
- `migrate()` runs simple `CREATE TABLE IF NOT EXISTS` statements; safe to call multiple times.

### License
MIT
