-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: sistem_pengadaan_revisi
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `barang_permintaan`
--

DROP TABLE IF EXISTS `barang_permintaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barang_permintaan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permintaan_id` int NOT NULL,
  `kategori_barang` varchar(100) NOT NULL,
  `nama_barang` varchar(200) NOT NULL,
  `spesifikasi` text,
  `jumlah` int NOT NULL,
  `keterangan` text,
  `status` enum('menunggu validasi','validasi','diproses','dalam pemesanan','selesai','ditolak') DEFAULT 'menunggu validasi',
  `stok_barang_id` int DEFAULT NULL,
  `stok_available` tinyint(1) DEFAULT '0',
  `catatan_admin` text,
  `catatan_validator` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sudah_diterima` tinyint(1) DEFAULT '0',
  `penerimaan_barang_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_status` (`status`),
  KEY `idx_barang_permintaan_permintaan` (`permintaan_id`),
  KEY `idx_penerimaan_barang_id` (`penerimaan_barang_id`),
  KEY `fk_stok_barang_id` (`stok_barang_id`),
  CONSTRAINT `fk_barang_permintaan_permintaan` FOREIGN KEY (`permintaan_id`) REFERENCES `permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_barang_permintaan_stok` FOREIGN KEY (`stok_barang_id`) REFERENCES `stok_barang` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang_permintaan`
--

LOCK TABLES `barang_permintaan` WRITE;
/*!40000 ALTER TABLE `barang_permintaan` DISABLE KEYS */;
INSERT INTO `barang_permintaan` VALUES (1,1,'Elektronik','Laptop Dell','Core i5, 8GB RAM',2,'Untuk staf baru','dalam pemesanan',NULL,0,NULL,NULL,'2025-12-01 09:55:06','2025-12-01 09:55:06',0,NULL),(2,1,'Elektronik','Monitor 24\"','LED, HDMI',3,'Untuk ruang meeting','validasi',2,1,NULL,NULL,'2025-12-01 09:55:06','2025-12-01 09:55:06',0,NULL),(3,2,'ATK (Alat Tulis Kantor)','Kertas A4','80 gram',5,'Untuk printing','selesai',3,1,NULL,NULL,'2025-12-01 09:55:06','2025-12-01 09:55:06',0,NULL),(4,3,'IT Hardware','Keyboard Mechanical','RGB',1,'Untuk programmer','menunggu validasi',5,1,NULL,NULL,'2025-12-01 09:55:06','2025-12-01 09:55:06',0,NULL);
/*!40000 ALTER TABLE `barang_permintaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisi`
--

DROP TABLE IF EXISTS `divisi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_divisi` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisi`
--

LOCK TABLES `divisi` WRITE;
/*!40000 ALTER TABLE `divisi` DISABLE KEYS */;
INSERT INTO `divisi` VALUES (1,'Technology Division','2025-12-01 09:55:06','2025-12-01 09:55:06'),(2,'Finance','2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'HRD','2025-12-01 09:55:06','2025-12-01 09:55:06'),(4,'Operations','2025-12-01 09:55:06','2025-12-01 09:55:06'),(5,'Marketing','2025-12-01 09:55:06','2025-12-01 09:55:06'),(6,'IT Support','2025-12-01 09:55:06','2025-12-01 09:55:06'),(7,'Research & Development','2025-12-01 09:55:06','2025-12-01 09:55:06');
/*!40000 ALTER TABLE `divisi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dokumen_pembelian`
--

DROP TABLE IF EXISTS `dokumen_pembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumen_pembelian` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barang_permintaan_id` int NOT NULL,
  `jenis_dokumen` enum('PO','Nota','Form Penerimaan','Lainnya') NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `uploaded_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_valid` tinyint(1) DEFAULT NULL,
  `catatan_validator` text,
  `validated_by` int DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_id` (`barang_permintaan_id`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_validated_by` (`validated_by`),
  CONSTRAINT `fk_dokumen_barang_permintaan` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dokumen_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dokumen_validated_by` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_pembelian`
--

LOCK TABLES `dokumen_pembelian` WRITE;
/*!40000 ALTER TABLE `dokumen_pembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `dokumen_pembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori_barang`
--

DROP TABLE IF EXISTS `kategori_barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori_barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_nama_kategori` (`nama_kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori_barang`
--

LOCK TABLES `kategori_barang` WRITE;
/*!40000 ALTER TABLE `kategori_barang` DISABLE KEYS */;
INSERT INTO `kategori_barang` VALUES (1,'Elektronik','2025-12-01 09:55:06','2025-12-01 09:55:06'),(2,'ATK (Alat Tulis Kantor)','2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'Furniture','2025-12-01 09:55:06','2025-12-01 09:55:06'),(4,'IT Hardware','2025-12-01 09:55:06','2025-12-01 09:55:06'),(5,'Perlengkapan Kantor','2025-12-01 09:55:06','2025-12-01 09:55:06'),(6,'Kendaraan','2025-12-01 09:55:06','2025-12-01 09:55:06'),(7,'Lainnya','2025-12-01 09:55:06','2025-12-01 09:55:06'),(8,'Software','2025-12-01 11:01:05','2025-12-01 11:01:05');
/*!40000 ALTER TABLE `kategori_barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penerimaan_barang`
--

DROP TABLE IF EXISTS `penerimaan_barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `penerimaan_barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barang_permintaan_id` int NOT NULL,
  `tanggal_penerimaan` date NOT NULL,
  `penerima` varchar(100) NOT NULL,
  `nama_barang` varchar(200) NOT NULL,
  `spesifikasi` text,
  `jumlah_dipesan` int NOT NULL,
  `jumlah_diterima` int NOT NULL,
  `diperiksa_oleh` varchar(100) NOT NULL,
  `tanggal_pemeriksaan` date NOT NULL,
  `foto_bukti` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_id` (`barang_permintaan_id`),
  CONSTRAINT `fk_penerimaan_barang_permintaan` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penerimaan_barang`
--

LOCK TABLES `penerimaan_barang` WRITE;
/*!40000 ALTER TABLE `penerimaan_barang` DISABLE KEYS */;
/*!40000 ALTER TABLE `penerimaan_barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permintaan`
--

DROP TABLE IF EXISTS `permintaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permintaan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomor_permintaan` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `tanggal_kebutuhan` date NOT NULL,
  `status` enum('draft','menunggu','diproses','selesai') DEFAULT 'draft',
  `catatan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_nomor_permintaan` (`nomor_permintaan`),
  KEY `idx_permintaan_user` (`user_id`),
  KEY `idx_permintaan_status` (`status`),
  KEY `idx_permintaan_tanggal` (`created_at`),
  KEY `idx_permintaan_status_date` (`status`,`created_at`),
  CONSTRAINT `fk_permintaan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permintaan`
--

LOCK TABLES `permintaan` WRITE;
/*!40000 ALTER TABLE `permintaan` DISABLE KEYS */;
INSERT INTO `permintaan` VALUES (1,'REQ-20241128001',1,'2024-12-05','diproses','Permintaan untuk proyek Q4 2024','2025-12-01 09:55:06','2025-12-01 09:55:06'),(2,'REQ-20241128002',4,'2024-12-10','menunggu','Keperluan divisi marketing','2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'REQ-20241128003',1,'2024-12-15','draft','Persiapan training','2025-12-01 09:55:06','2025-12-01 09:55:06');
/*!40000 ALTER TABLE `permintaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `satuan_barang`
--

DROP TABLE IF EXISTS `satuan_barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `satuan_barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_satuan` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_nama_satuan` (`nama_satuan`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `satuan_barang`
--

LOCK TABLES `satuan_barang` WRITE;
/*!40000 ALTER TABLE `satuan_barang` DISABLE KEYS */;
INSERT INTO `satuan_barang` VALUES (1,'Unit','2025-12-01 09:55:06','2025-12-01 09:55:06'),(2,'Pcs','2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'Set','2025-12-01 09:55:06','2025-12-01 09:55:06'),(4,'Rim','2025-12-01 09:55:06','2025-12-01 09:55:06'),(5,'Box','2025-12-01 09:55:06','2025-12-01 09:55:06'),(6,'Lusin','2025-12-01 09:55:06','2025-12-01 09:55:06'),(7,'Pack','2025-12-01 09:55:06','2025-12-01 09:55:06'),(8,'Liter','2025-12-01 09:55:06','2025-12-01 09:55:06'),(9,'Kg','2025-12-01 09:55:06','2025-12-01 09:55:06'),(10,'Botol','2025-12-01 11:05:21','2025-12-01 11:05:21');
/*!40000 ALTER TABLE `satuan_barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_log`
--

DROP TABLE IF EXISTS `status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barang_permintaan_id` int NOT NULL,
  `permintaan_id` int NOT NULL,
  `status_lama` varchar(50) DEFAULT NULL,
  `status_baru` varchar(50) NOT NULL,
  `dibuat_oleh` int NOT NULL,
  `peran` varchar(20) NOT NULL,
  `catatan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_id` (`barang_permintaan_id`),
  KEY `idx_permintaan_id` (`permintaan_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `fk_status_log_user` (`dibuat_oleh`),
  CONSTRAINT `fk_status_log_barang_permintaan` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_status_log_permintaan` FOREIGN KEY (`permintaan_id`) REFERENCES `permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_status_log_user` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_log`
--

LOCK TABLES `status_log` WRITE;
/*!40000 ALTER TABLE `status_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stok_barang`
--

DROP TABLE IF EXISTS `stok_barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stok_barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_barang` varchar(50) NOT NULL,
  `kategori_barang_id` int NOT NULL,
  `nama_barang` varchar(200) NOT NULL,
  `spesifikasi` text,
  `satuan_barang_id` int NOT NULL,
  `stok` int DEFAULT '0',
  `stok_minimum` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_kode_barang` (`kode_barang`),
  KEY `idx_stok_kategori` (`kategori_barang_id`),
  KEY `idx_stok_satuan` (`satuan_barang_id`),
  KEY `idx_stok_nama` (`nama_barang`),
  KEY `idx_stok_kode` (`kode_barang`),
  CONSTRAINT `fk_stok_kategori` FOREIGN KEY (`kategori_barang_id`) REFERENCES `kategori_barang` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_stok_satuan` FOREIGN KEY (`satuan_barang_id`) REFERENCES `satuan_barang` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stok_barang`
--

LOCK TABLES `stok_barang` WRITE;
/*!40000 ALTER TABLE `stok_barang` DISABLE KEYS */;
INSERT INTO `stok_barang` VALUES (2,'BRG-002',1,'Monitor 24\"','LED, 1920x1080, HDMI',1,10,3,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'BRG-003',2,'Kertas A4','80 gram, 1 rim',4,20,5,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(4,'BRG-004',2,'Pulpen Standard','Hitam, ballpoint',2,100,20,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(5,'BRG-005',4,'Keyboard Mechanical','RGB, Brown Switch, USB',1,8,2,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(6,'BRG-006',5,'Meja Kantor','Kayu, 120x60 cm',1,15,3,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(7,'BRG-007',5,'Kursi Ergonomis','Adjustable height, mesh back',1,12,2,'2025-12-01 09:55:06','2025-12-01 09:55:06'),(8,'BRG-1764587280800',1,'Mouse Wireless','Bluetooth, 1600 DPI',2,20,5,'2025-12-01 11:08:00','2025-12-01 11:08:00');
/*!40000 ALTER TABLE `stok_barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('pemohon','admin','validator') NOT NULL,
  `divisi_id` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`),
  KEY `idx_users_divisi` (`divisi_id`),
  KEY `idx_users_role` (`role`),
  CONSTRAINT `fk_users_divisi` FOREIGN KEY (`divisi_id`) REFERENCES `divisi` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kepala_it','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','pemohon',1,'it@company.com','Budi Santoso',1,'2025-12-01 09:55:06','2025-12-01 10:26:13','2025-12-01 10:26:13'),(2,'ga_admin','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','admin',3,'ga@company.com','Siti Rahayu',1,'2025-12-01 09:55:06','2025-12-01 10:26:54','2025-12-01 10:26:54'),(3,'finance_val','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','validator',2,'finance@company.com','Ahmad Wijaya',1,'2025-12-01 09:55:06','2025-12-01 10:25:11','2025-12-01 10:25:11'),(4,'staff_marketing','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','pemohon',5,'marketing@company.com','Dewi Lestari',1,'2025-12-01 09:55:06','2025-12-01 09:55:06',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_permintaan_lengkap`
--

DROP TABLE IF EXISTS `view_permintaan_lengkap`;
/*!50001 DROP VIEW IF EXISTS `view_permintaan_lengkap`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_permintaan_lengkap` AS SELECT 
 1 AS `nomor_permintaan`,
 1 AS `status_permintaan`,
 1 AS `pemohon`,
 1 AS `nama_divisi`,
 1 AS `tanggal_kebutuhan`,
 1 AS `catatan`,
 1 AS `jumlah_barang`,
 1 AS `barang_selesai`,
 1 AS `barang_dipesan`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_stok_barang_detail`
--

DROP TABLE IF EXISTS `view_stok_barang_detail`;
/*!50001 DROP VIEW IF EXISTS `view_stok_barang_detail`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_stok_barang_detail` AS SELECT 
 1 AS `id`,
 1 AS `kode_barang`,
 1 AS `nama_kategori`,
 1 AS `nama_barang`,
 1 AS `spesifikasi`,
 1 AS `nama_satuan`,
 1 AS `stok`,
 1 AS `stok_minimum`,
 1 AS `status_stok`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_stok_rendah`
--

DROP TABLE IF EXISTS `view_stok_rendah`;
/*!50001 DROP VIEW IF EXISTS `view_stok_rendah`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_stok_rendah` AS SELECT 
 1 AS `kode_barang`,
 1 AS `nama_kategori`,
 1 AS `nama_barang`,
 1 AS `nama_satuan`,
 1 AS `stok`,
 1 AS `stok_minimum`,
 1 AS `kekurangan`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_permintaan_lengkap`
--

/*!50001 DROP VIEW IF EXISTS `view_permintaan_lengkap`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_permintaan_lengkap` AS select `p`.`nomor_permintaan` AS `nomor_permintaan`,`p`.`status` AS `status_permintaan`,`u`.`nama_lengkap` AS `pemohon`,`d`.`nama_divisi` AS `nama_divisi`,`p`.`tanggal_kebutuhan` AS `tanggal_kebutuhan`,`p`.`catatan` AS `catatan`,count(`bp`.`id`) AS `jumlah_barang`,sum((case when (`bp`.`status` = 'selesai') then 1 else 0 end)) AS `barang_selesai`,sum((case when (`bp`.`status` = 'dalam pemesanan') then 1 else 0 end)) AS `barang_dipesan`,`p`.`created_at` AS `created_at` from (((`permintaan` `p` join `users` `u` on((`p`.`user_id` = `u`.`id`))) join `divisi` `d` on((`u`.`divisi_id` = `d`.`id`))) left join `barang_permintaan` `bp` on((`p`.`id` = `bp`.`permintaan_id`))) group by `p`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_stok_barang_detail`
--

/*!50001 DROP VIEW IF EXISTS `view_stok_barang_detail`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_stok_barang_detail` AS select `sb`.`id` AS `id`,`sb`.`kode_barang` AS `kode_barang`,`kb`.`nama_kategori` AS `nama_kategori`,`sb`.`nama_barang` AS `nama_barang`,`sb`.`spesifikasi` AS `spesifikasi`,`sbu`.`nama_satuan` AS `nama_satuan`,`sb`.`stok` AS `stok`,`sb`.`stok_minimum` AS `stok_minimum`,(case when (`sb`.`stok` <= `sb`.`stok_minimum`) then 'RENDAH' when (`sb`.`stok` <= (`sb`.`stok_minimum` * 2)) then 'WASPADA' else 'AMAN' end) AS `status_stok`,`sb`.`created_at` AS `created_at`,`sb`.`updated_at` AS `updated_at` from ((`stok_barang` `sb` left join `kategori_barang` `kb` on((`sb`.`kategori_barang_id` = `kb`.`id`))) left join `satuan_barang` `sbu` on((`sb`.`satuan_barang_id` = `sbu`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_stok_rendah`
--

/*!50001 DROP VIEW IF EXISTS `view_stok_rendah`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_stok_rendah` AS select `sb`.`kode_barang` AS `kode_barang`,`kb`.`nama_kategori` AS `nama_kategori`,`sb`.`nama_barang` AS `nama_barang`,`sbu`.`nama_satuan` AS `nama_satuan`,`sb`.`stok` AS `stok`,`sb`.`stok_minimum` AS `stok_minimum`,(`sb`.`stok_minimum` - `sb`.`stok`) AS `kekurangan` from ((`stok_barang` `sb` left join `kategori_barang` `kb` on((`sb`.`kategori_barang_id` = `kb`.`id`))) left join `satuan_barang` `sbu` on((`sb`.`satuan_barang_id` = `sbu`.`id`))) where (`sb`.`stok` <= `sb`.`stok_minimum`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-01 21:06:44
