/**
 * Servidor standalone para el sistema de publicaciones.
 * 
 * Uso:
 *   1. cd static
 *   2. npm install express multer cookie-parser
 *   3. node server.js
 *   4. Abre http://localhost:3000
 * 
 * Estructura de carpetas:
 *   static/
 *     index.html        - Pagina publica (grid de publicaciones)
 *     admin.html         - Panel de admin (login + dashboard)
 *     style.css          - Estilos
 *     server.js          - Este archivo
 *     data/
 *       users.json       - Credenciales
 *       publications.json - Datos de publicaciones
 *     uploads/           - Imagenes subidas
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Paths ---
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const PUBS_PATH = path.join(DATA_DIR, 'publications.json');

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOADS_DIR));

// --- Multer for file uploads ---
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});
const upload = multer({ storage });

// --- Helper: read/write JSON ---
async function readJSON(filepath, fallback = []) {
  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

async function writeJSON(filepath, data) {
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
}

// --- Ensure data files exist ---
async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await fs.access(USERS_PATH);
  } catch {
    await writeJSON(USERS_PATH, [
      { id: '1', username: 'admin', password: 'admin123' }
    ]);
  }

  try {
    await fs.access(PUBS_PATH);
  } catch {
    await writeJSON(PUBS_PATH, []);
  }
}

// ==========================================
//  AUTH ROUTES
// ==========================================

// POST /api/auth - Login
app.post('/api/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readJSON(USERS_PATH);
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.cookie('auth_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 86400000, // 24h
    });

    res.json({ success: true, username: user.username });
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// DELETE /api/auth - Logout
app.delete('/api/auth', (_req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// GET /api/auth/check - Check session
app.get('/api/auth/check', (req, res) => {
  if (req.cookies.auth_token) {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

// ==========================================
//  PUBLICATIONS ROUTES
// ==========================================

// GET /api/publications
app.get('/api/publications', async (_req, res) => {
  const pubs = await readJSON(PUBS_PATH);
  res.json(pubs);
});

// POST /api/publications - Create
app.post('/api/publications', async (req, res) => {
  if (!req.cookies.auth_token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const pubs = await readJSON(PUBS_PATH);
    const newPub = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      image: req.body.image || null,
      category: req.body.category || 'General',
      createdAt: new Date().toISOString(),
    };

    pubs.unshift(newPub);
    await writeJSON(PUBS_PATH, pubs);
    res.status(201).json(newPub);
  } catch {
    res.status(500).json({ error: 'Error al crear publicacion' });
  }
});

// DELETE /api/publications - Delete
app.delete('/api/publications', async (req, res) => {
  if (!req.cookies.auth_token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { id } = req.body;
    let pubs = await readJSON(PUBS_PATH);
    const pub = pubs.find(p => p.id === id);

    // Delete associated image file
    if (pub?.image) {
      const imgPath = path.join(__dirname, pub.image);
      try { await fs.unlink(imgPath); } catch {}
    }

    pubs = pubs.filter(p => p.id !== id);
    await writeJSON(PUBS_PATH, pubs);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ==========================================
//  UPLOAD ROUTE
// ==========================================

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.cookies.auth_token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No se encontro archivo' });
  }

  res.json({ path: `/uploads/${req.file.filename}` });
});

// ==========================================
//  START
// ==========================================

await ensureDataFiles();

app.listen(PORT, () => {
  console.log(`\n  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  Admin panel: http://localhost:${PORT}/admin.html\n`);
});
