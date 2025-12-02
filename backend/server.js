import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

//import database connection
import dbPool from './src/config/database.js'

//import routes
import authRoutes from './src/routes/auth.js';
import pemohonRoutes from './src/routes/pemohon.js';
import adminRoutes from './src/routes/admin.js';
import validatorRoutes from './src/routes/validator.js';
import kategoriRoutes from './src/routes/kategori.js'; // ✅ TAMBAHKAN INI
import satuanRoutes from './src/routes/satuan.js';

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // NextJS dev server
  ],
  credentials: true, // Izinkan cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const testDB = async () => {
    try {
        // Coba dengan query yang berbeda
        const [rows] = await dbPool.execute('SELECT 1 as test_value')
        console.log('Rows:', rows)
        console.log('✅ Database connected. Test value:', rows[0].test_value)
    } catch(error) {
        console.log('❌ Database connection failed:', error.message)
        process.exit(1)
    }
}
testDB()

//routes
app.use('/api/auth', authRoutes);
app.use('/api/pemohon', pemohonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/validator', validatorRoutes);
app.use('/api/kategori', kategoriRoutes); // ✅ TAMBAHKAN INI
app.use('/api/satuan', satuanRoutes);

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/',(req, res)=>{
    res.send("Server working, go to /route_name")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})