-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: sistem_pengadann
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
  `status` enum('menunggu validasi','diproses','dalam pemesanan','selesai','ditolak') DEFAULT 'menunggu validasi',
  `catatan_admin` text,
  `catatan_validator` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sudah_diterima` tinyint(1) DEFAULT '0',
  `penerimaan_barang_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_status` (`status`),
  KEY `idx_barang_permintaan_permintaan` (`permintaan_id`),
  KEY `penerimaan_barang_id` (`penerimaan_barang_id`),
  CONSTRAINT `barang_permintaan_ibfk_1` FOREIGN KEY (`permintaan_id`) REFERENCES `permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `barang_permintaan_ibfk_2` FOREIGN KEY (`penerimaan_barang_id`) REFERENCES `penerimaan_barang` (`id`) ON DELETE SET NULL,
  CONSTRAINT `barang_permintaan_ibfk_3` FOREIGN KEY (`penerimaan_barang_id`) REFERENCES `penerimaan_barang` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang_permintaan`
--

LOCK TABLES `barang_permintaan` WRITE;
/*!40000 ALTER TABLE `barang_permintaan` DISABLE KEYS */;
INSERT INTO `barang_permintaan` VALUES (1,1,'Elektronik','Laptop Dell','Core i5, 8GB RAM, 256GB SSD',2,'Untuk staf baru','ditolak',NULL,NULL,'2025-11-21 12:23:18','2025-11-23 17:01:26',1,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisi`
--

LOCK TABLES `divisi` WRITE;
/*!40000 ALTER TABLE `divisi` DISABLE KEYS */;
INSERT INTO `divisi` VALUES (1,'Technology Division','2025-11-15 19:46:16','2025-11-22 13:10:15'),(2,'Finance','2025-11-15 19:46:16','2025-11-15 19:46:16'),(3,'HRD','2025-11-15 19:46:16','2025-11-15 19:46:16'),(4,'Operations','2025-11-15 19:46:16','2025-11-15 19:46:16'),(5,'Marketing','2025-11-15 19:46:16','2025-11-15 19:46:16'),(6,'IT','2025-11-21 06:49:39','2025-11-21 06:49:39'),(7,'Finance','2025-11-21 06:49:39','2025-11-21 06:49:39'),(9,'Research & Development','2025-11-22 13:09:55','2025-11-22 13:09:55');
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
  KEY `barang_permintaan_id` (`barang_permintaan_id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `fk_dokumen_validated_by` (`validated_by`),
  CONSTRAINT `dokumen_pembelian_ibfk_1` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dokumen_pembelian_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dokumen_validated_by` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_pembelian`
--

LOCK TABLES `dokumen_pembelian` WRITE;
/*!40000 ALTER TABLE `dokumen_pembelian` DISABLE KEYS */;
INSERT INTO `dokumen_pembelian` VALUES (1,1,'PO','Cuplikan layar 2025-03-19 210839.png','uploads\\dokumen\\dokumen-1763910548580-277973179-Cuplikan_layar_2025-03-19_210839.png','Cuplikan layar 2025-03-19 210839.png',24345,29,'2025-11-23 15:09:08',1,'Dokumen PO sudah sesuai dengan standar perusahaan',30,'2025-11-23 17:01:05'),(2,1,'Nota','Cuplikan layar 2025-11-23 215557.png','uploads\\dokumen\\dokumen-1763914664213-977455461-Cuplikan_layar_2025-11-23_215557.png','Cuplikan layar 2025-11-23 215557.png',20122,29,'2025-11-23 16:17:44',0,'Nomor PO tidak sesuai format, mohon diperbaiki',30,'2025-11-23 17:01:26');
/*!40000 ALTER TABLE `dokumen_pembelian` ENABLE KEYS */;
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
  KEY `barang_permintaan_id` (`barang_permintaan_id`),
  CONSTRAINT `penerimaan_barang_ibfk_1` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penerimaan_barang`
--

LOCK TABLES `penerimaan_barang` WRITE;
/*!40000 ALTER TABLE `penerimaan_barang` DISABLE KEYS */;
INSERT INTO `penerimaan_barang` VALUES (2,1,'2024-01-25','Budi Santoso','Laptop Dell','Core i5, 8GB RAM, 256GB SSD',2,2,'Siti Rahayu','2024-01-25',NULL,'2025-11-22 10:12:02','2025-11-22 10:12:02'),(3,1,'2024-01-25','Budi Santoso','Laptop Dell','Core i5, 8GB RAM, 256GB SSD',2,2,'Siti Rahayu','2024-01-25',NULL,'2025-11-22 12:30:09','2025-11-22 12:30:09'),(4,1,'2024-01-25','Budi Santoso','Laptop Dell','Core i5, 8GB RAM, 256GB SSD',2,2,'Siti Rahayu','2024-01-25',NULL,'2025-11-22 12:35:33','2025-11-22 12:35:33');
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
  UNIQUE KEY `nomor_permintaan` (`nomor_permintaan`),
  KEY `idx_permintaan_user` (`user_id`),
  KEY `idx_permintaan_status` (`status`),
  KEY `idx_permintaan_tanggal` (`created_at`),
  CONSTRAINT `permintaan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permintaan`
--

LOCK TABLES `permintaan` WRITE;
/*!40000 ALTER TABLE `permintaan` DISABLE KEYS */;
INSERT INTO `permintaan` VALUES (1,'REQ-1763727678293',28,'2024-01-20','diproses','Permintaan barang untuk proyek Q1 2024','2025-11-21 12:21:18','2025-11-21 20:40:48');
/*!40000 ALTER TABLE `permintaan` ENABLE KEYS */;
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
  `kategori_barang` varchar(100) NOT NULL,
  `nama_barang` varchar(200) NOT NULL,
  `spesifikasi` text,
  `satuan` varchar(50) NOT NULL,
  `stok` int DEFAULT '0',
  `stok_minimum` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_barang` (`kode_barang`),
  KEY `idx_stok_kode` (`kode_barang`),
  KEY `idx_stok_kategori` (`kategori_barang`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stok_barang`
--

LOCK TABLES `stok_barang` WRITE;
/*!40000 ALTER TABLE `stok_barang` DISABLE KEYS */;
INSERT INTO `stok_barang` VALUES (2,'IT-002','Elektronik','Monitor','24 inch, LED, 1080p','unit',3,0,'2025-11-15 19:46:41','2025-11-15 19:46:41'),(3,'OF-001','ATK','Kertas A4','80 gram, 1 rim','rim',10,0,'2025-11-15 19:46:41','2025-11-15 19:46:41'),(4,'OF-002','ATK','Pulpen','Hitam, Standard','pcs',50,0,'2025-11-15 19:46:41','2025-11-15 19:46:41'),(5,'IT-003','Elektronik','Keyboard Mechanical','RGB, Brown Switch','unit',5,2,'2025-11-21 20:52:20','2025-11-21 20:52:20');
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
  UNIQUE KEY `username` (`username`),
  KEY `divisi_id` (`divisi_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`divisi_id`) REFERENCES `divisi` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (28,'kepala_it','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','pemohon',1,'it@company.com','Budi Santoso',1,'2025-11-21 11:16:02','2025-11-22 13:41:21','2025-11-21 20:01:44'),(29,'ga_admin','password123','admin',3,'ga@company.com','Siti Rahayu',1,'2025-11-21 11:16:02','2025-11-21 20:36:48','2025-11-21 20:36:48'),(30,'finance_val','password123','validator',2,'finance@company.com','Ahmad Wijaya',1,'2025-11-21 11:16:02','2025-11-23 16:50:09','2025-11-23 16:50:09'),(31,'staff_it','$2b$10$b02kxEB3ZAYnq9OHKiwPGe201Xbp38jYAbETbA5TLOi9PvzWrEFiW','pemohon',1,'staff.it@company.com','Staff IT Baru',0,'2025-11-22 13:38:31','2025-11-22 14:27:40',NULL);
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
 1 AS `pemohon`,
 1 AS `nama_divisi`,
 1 AS `tanggal_kebutuhan`,
 1 AS `status_permintaan`,
 1 AS `jumlah_barang`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_permintaan_penerimaan`
--

DROP TABLE IF EXISTS `view_permintaan_penerimaan`;
/*!50001 DROP VIEW IF EXISTS `view_permintaan_penerimaan`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_permintaan_penerimaan` AS SELECT 
 1 AS `nomor_permintaan`,
 1 AS `pemohon`,
 1 AS `nama_divisi`,
 1 AS `tanggal_kebutuhan`,
 1 AS `nama_barang`,
 1 AS `spesifikasi`,
 1 AS `jumlah_diminta`,
 1 AS `status_barang`,
 1 AS `tanggal_penerimaan`,
 1 AS `jumlah_diterima`,
 1 AS `diperiksa_oleh`,
 1 AS `foto_bukti`*/;
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
/*!50001 VIEW `view_permintaan_lengkap` AS select `p`.`nomor_permintaan` AS `nomor_permintaan`,`u`.`nama_lengkap` AS `pemohon`,`d`.`nama_divisi` AS `nama_divisi`,`p`.`tanggal_kebutuhan` AS `tanggal_kebutuhan`,`p`.`status` AS `status_permintaan`,count(`bp`.`id`) AS `jumlah_barang`,`p`.`created_at` AS `created_at` from (((`permintaan` `p` join `users` `u` on((`p`.`user_id` = `u`.`id`))) join `divisi` `d` on((`u`.`divisi_id` = `d`.`id`))) left join `barang_permintaan` `bp` on((`p`.`id` = `bp`.`permintaan_id`))) group by `p`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_permintaan_penerimaan`
--

/*!50001 DROP VIEW IF EXISTS `view_permintaan_penerimaan`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_permintaan_penerimaan` AS select `p`.`nomor_permintaan` AS `nomor_permintaan`,`u`.`nama_lengkap` AS `pemohon`,`d`.`nama_divisi` AS `nama_divisi`,`p`.`tanggal_kebutuhan` AS `tanggal_kebutuhan`,`bp`.`nama_barang` AS `nama_barang`,`bp`.`spesifikasi` AS `spesifikasi`,`bp`.`jumlah` AS `jumlah_diminta`,`bp`.`status` AS `status_barang`,`pb`.`tanggal_penerimaan` AS `tanggal_penerimaan`,`pb`.`jumlah_diterima` AS `jumlah_diterima`,`pb`.`diperiksa_oleh` AS `diperiksa_oleh`,`pb`.`foto_bukti` AS `foto_bukti` from ((((`permintaan` `p` join `users` `u` on((`p`.`user_id` = `u`.`id`))) join `divisi` `d` on((`u`.`divisi_id` = `d`.`id`))) join `barang_permintaan` `bp` on((`p`.`id` = `bp`.`permintaan_id`))) left join `penerimaan_barang` `pb` on((`bp`.`id` = `pb`.`barang_permintaan_id`))) */;
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

-- Dump completed on 2025-11-27 10:54:01
