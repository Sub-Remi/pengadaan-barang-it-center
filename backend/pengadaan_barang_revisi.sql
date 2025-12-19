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
  `validated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_barang_permintaan_status` (`status`),
  KEY `idx_barang_permintaan_permintaan` (`permintaan_id`),
  KEY `idx_penerimaan_barang_id` (`penerimaan_barang_id`),
  KEY `fk_stok_barang_id` (`stok_barang_id`),
  CONSTRAINT `fk_barang_permintaan_permintaan` FOREIGN KEY (`permintaan_id`) REFERENCES `permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_barang_permintaan_stok` FOREIGN KEY (`stok_barang_id`) REFERENCES `stok_barang` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang_permintaan`
--

LOCK TABLES `barang_permintaan` WRITE;
/*!40000 ALTER TABLE `barang_permintaan` DISABLE KEYS */;
INSERT INTO `barang_permintaan` VALUES (34,24,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',1,'Yang Satisfying','selesai',5,0,'tidak',NULL,'2025-12-07 19:07:26','2025-12-07 19:15:13',0,NULL,NULL),(35,24,'ATK (Alat Tulis Kantor)','Pulpen Standard','Hitam, ballpoint',10,'Yang tahan lama tintanya','selesai',4,0,'tidak boleh',NULL,'2025-12-07 19:07:26','2025-12-07 19:16:33',0,NULL,NULL),(36,25,'Elektronik','Mouse Wireless','Bluetooth, 1600 DPI',3,'yang gaming','ditolak',8,0,'k',NULL,'2025-12-07 19:19:02','2025-12-07 19:20:57',0,NULL,NULL),(37,25,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',3,'','ditolak',5,0,'g',NULL,'2025-12-07 19:19:02','2025-12-07 19:26:29',0,NULL,NULL),(38,25,'Perlengkapan Kantor','Meja Kantor','Kayu, 120x60 cm',6,'','ditolak',6,0,'f',NULL,'2025-12-07 19:19:02','2025-12-07 19:38:20',0,NULL,NULL),(39,26,'Elektronik','Monitor 24\"','LED, 1920x1080, HDMI',1,'Buat Nonton','dalam pemesanan',2,0,NULL,NULL,'2025-12-07 19:41:04','2025-12-07 22:27:54',0,NULL,NULL),(40,27,'Lainnya','Meja','Besar, Keras, Kaki 4',4,'Tes Keterangan','dalam pemesanan',9,0,'k\ne\nburukan',NULL,'2025-12-07 19:42:06','2025-12-08 04:06:03',0,NULL,NULL),(41,28,'Perlengkapan Kantor','Kursi Ergonomis','Adjustable height, mesh back',1,'Tes Pembelian','selesai',7,0,NULL,NULL,'2025-12-07 22:31:29','2025-12-07 22:32:31',0,NULL,NULL),(42,29,'Perlengkapan Kantor','Meja Kantor','Kayu, 120x60 cm',1,'Kebutuhan\n','dalam pemesanan',6,0,NULL,NULL,'2025-12-08 04:16:57','2025-12-08 05:19:01',0,NULL,NULL),(43,30,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',5,'..','dalam pemesanan',5,0,NULL,NULL,'2025-12-08 05:23:02','2025-12-08 05:24:12',0,NULL,NULL),(44,30,'Perlengkapan Kantor','Meja Kantor','Kayu, 120x60 cm',5,'.','dalam pemesanan',6,0,NULL,NULL,'2025-12-08 05:23:02','2025-12-08 05:33:10',0,NULL,NULL),(45,31,'Kendaraan','Mobil Limo','8 Kursi, Mesin V8, Roda 4',2,'frt','dalam pemesanan',10,0,NULL,NULL,'2025-12-08 05:55:59','2025-12-08 13:37:58',0,NULL,NULL),(46,32,'Furniture','Kasur','3x2 Meter, Queen Size',6,'p','selesai',11,0,NULL,NULL,'2025-12-08 16:16:57','2025-12-08 18:16:58',0,NULL,NULL),(47,33,'ATK (Alat Tulis Kantor)','Pulpen Standard','Hitam, ballpoint',20,'buat tulis','selesai',4,0,NULL,NULL,'2025-12-08 17:45:12','2025-12-08 17:48:16',0,NULL,NULL),(48,33,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',4,'lkp','selesai',5,0,NULL,NULL,'2025-12-08 17:45:12','2025-12-08 18:12:28',0,NULL,NULL),(49,34,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',1,'d','selesai',5,0,NULL,NULL,'2025-12-08 18:19:40','2025-12-08 18:21:51',0,NULL,NULL),(50,34,'ATK (Alat Tulis Kantor)','Pulpen Standard','Hitam, ballpoint',1,'d','selesai',4,0,NULL,NULL,'2025-12-08 18:19:40','2025-12-08 19:42:27',0,NULL,NULL),(51,34,'ATK (Alat Tulis Kantor)','Kertas A4','80 gram, 1 rim',2,'awd','selesai',3,0,NULL,'revisi kembali','2025-12-08 18:19:40','2025-12-08 20:19:01',0,NULL,NULL),(52,34,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',2,'awd','selesai',5,0,NULL,NULL,'2025-12-08 18:19:40','2025-12-08 21:03:20',0,NULL,NULL),(53,34,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',1,'','selesai',5,0,NULL,NULL,'2025-12-08 18:19:40','2025-12-08 20:20:58',0,NULL,NULL),(54,34,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',1,'','dalam pemesanan',5,0,NULL,'tidak boleh','2025-12-08 18:19:40','2025-12-08 21:30:06',0,NULL,NULL),(55,35,'ATK (Alat Tulis Kantor)','Pulpen Standard','Hitam, ballpoint',20,'mau ATK','menunggu validasi',4,0,NULL,NULL,'2025-12-16 08:11:44','2025-12-16 08:11:44',0,NULL,NULL),(56,35,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',10,'','menunggu validasi',5,0,NULL,NULL,'2025-12-16 08:11:44','2025-12-16 08:11:44',0,NULL,NULL),(60,36,'IT Hardware','Keyboard Mechanical','RGB, Brown Switch, USB',3,'contoh keterangan','menunggu validasi',5,0,NULL,NULL,'2025-12-16 12:22:58','2025-12-16 12:22:58',0,NULL,NULL),(61,36,'Kendaraan','Mobil Limo','8 Kursi, Mesin V8, Roda 4',1,'contoh keterangan 2','menunggu validasi',10,0,NULL,NULL,'2025-12-16 12:22:58','2025-12-16 12:22:58',0,NULL,NULL),(62,36,'Perlengkapan Kantor','Kursi Ergonomis','Adjustable height, mesh back',6,'---','menunggu validasi',7,0,NULL,NULL,'2025-12-16 12:22:58','2025-12-16 12:22:58',0,NULL,NULL),(63,37,'Software','Kasur','3x2 Meter, Queen Size',23,'p','selesai',11,0,NULL,NULL,'2025-12-18 10:36:25','2025-12-18 10:37:01',0,NULL,NULL),(64,38,'ATK (Alat Tulis Kantor)','Kertas A4','80 gram, 1 rim',4,'-','ditolak',3,0,'nanti dulu',NULL,'2025-12-18 10:41:13','2025-12-18 10:42:14',0,NULL,NULL),(65,39,'Elektronik','Monitor 24\"','LED, 1920x1080, HDMI',10,'-','selesai',2,0,NULL,NULL,'2025-12-18 10:44:48','2025-12-18 10:45:17',0,NULL,NULL);
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
INSERT INTO `divisi` VALUES (1,'Technology Division','2025-12-01 09:55:06','2025-12-01 09:55:06'),(2,'Finance','2025-12-01 09:55:06','2025-12-01 09:55:06'),(3,'HRD','2025-12-01 09:55:06','2025-12-01 09:55:06'),(5,'Marketing','2025-12-01 09:55:06','2025-12-01 09:55:06'),(6,'IT Support','2025-12-01 09:55:06','2025-12-01 09:55:06');
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
  `jenis_dokumen` varchar(50) NOT NULL,
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
  KEY `idx_dokumen_barang` (`barang_permintaan_id`),
  KEY `idx_dokumen_status` (`is_valid`),
  KEY `idx_dokumen_jenis` (`jenis_dokumen`),
  CONSTRAINT `fk_dokumen_barang_permintaan` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dokumen_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dokumen_validated_by` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_pembelian`
--

LOCK TABLES `dokumen_pembelian` WRITE;
/*!40000 ALTER TABLE `dokumen_pembelian` DISABLE KEYS */;
INSERT INTO `dokumen_pembelian` VALUES (1,42,'nota','dokumen_1765184657631-411169970.jpg','/uploads/dokumen_pembelian/dokumen_1765184657631-411169970.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 09:04:17',1,'',3,'2025-12-08 09:20:16'),(3,42,'form_penerimaan','dokumen_1765184686707-819619546.png','/uploads/dokumen_pembelian/dokumen_1765184686707-819619546.png','Penerimaan barang.png',10679,2,'2025-12-08 09:04:46',1,'',3,'2025-12-08 09:20:16'),(4,42,'po','dokumen_1765197368508-119946068.png','/uploads/dokumen_pembelian/dokumen_1765197368508-119946068.png','po.png',101977,2,'2025-12-08 12:36:08',1,'',3,'2025-12-08 14:53:07'),(5,45,'nota','dokumen_1765201143854-89560181.jpg','/uploads/dokumen_pembelian/dokumen_1765201143854-89560181.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 13:39:03',1,'',3,'2025-12-08 15:06:30'),(6,45,'po','dokumen_1765201154517-582824046.png','/uploads/dokumen_pembelian/dokumen_1765201154517-582824046.png','po.png',101977,2,'2025-12-08 13:39:14',1,'',3,'2025-12-08 15:06:30'),(7,45,'form_penerimaan','dokumen_1765206350684-697627098.png','/uploads/dokumen_pembelian/dokumen_1765206350684-697627098.png','Penerimaan barang.png',10679,2,'2025-12-08 15:05:50',1,'',3,'2025-12-08 15:06:30'),(8,46,'nota','dokumen_1765210713091-144187136.jpg','/uploads/dokumen_pembelian/dokumen_1765210713091-144187136.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 16:18:33',1,'Dokumen valid',3,'2025-12-08 16:19:49'),(9,46,'po','dokumen_1765210751056-609360755.png','/uploads/dokumen_pembelian/dokumen_1765210751056-609360755.png','po.png',101977,2,'2025-12-08 16:19:11',1,'Dokumen valid',3,'2025-12-08 16:19:49'),(10,46,'form_penerimaan','dokumen_1765210759803-351917612.png','/uploads/dokumen_pembelian/dokumen_1765210759803-351917612.png','Penerimaan barang.png',10679,2,'2025-12-08 16:19:19',1,'Dokumen valid',3,'2025-12-08 16:19:49'),(11,44,'nota','dokumen_1765211049521-123261794.jpg','/uploads/dokumen_pembelian/dokumen_1765211049521-123261794.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 16:24:09',0,'gak boleh, harap revisi',3,'2025-12-08 16:24:43'),(12,44,'po','dokumen_1765211056147-841469237.png','/uploads/dokumen_pembelian/dokumen_1765211056147-841469237.png','po.png',101977,2,'2025-12-08 16:24:16',0,'gak boleh, harap revisi',3,'2025-12-08 16:24:43'),(13,44,'form_penerimaan','dokumen_1765211062538-14629697.png','/uploads/dokumen_pembelian/dokumen_1765211062538-14629697.png','Penerimaan barang.png',10679,2,'2025-12-08 16:24:22',0,'gak boleh, harap revisi',3,'2025-12-08 16:24:43'),(14,47,'nota','dokumen_1765216037790-684818871.jpg','/uploads/dokumen_pembelian/dokumen_1765216037790-684818871.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 17:47:17',1,'Dokumen telah divalidasi',3,'2025-12-08 17:48:16'),(15,47,'po','dokumen_1765216072249-986650047.png','/uploads/dokumen_pembelian/dokumen_1765216072249-986650047.png','po.png',101977,2,'2025-12-08 17:47:52',1,'Dokumen telah divalidasi',3,'2025-12-08 17:48:16'),(16,47,'form_penerimaan','dokumen_1765216080821-719172349.png','/uploads/dokumen_pembelian/dokumen_1765216080821-719172349.png','Penerimaan barang.png',10679,2,'2025-12-08 17:48:00',1,'Dokumen telah divalidasi',3,'2025-12-08 17:48:16'),(17,48,'nota','dokumen_1765217518490-9671560.jpg','/uploads/dokumen_pembelian/dokumen_1765217518490-9671560.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 18:11:58',1,'Dokumen telah divalidasi',3,'2025-12-08 18:12:28'),(18,48,'po','dokumen_1765217525310-342420867.png','/uploads/dokumen_pembelian/dokumen_1765217525310-342420867.png','po.png',101977,2,'2025-12-08 18:12:05',1,'Dokumen telah divalidasi',3,'2025-12-08 18:12:28'),(19,48,'form_penerimaan','dokumen_1765217532463-428824928.png','/uploads/dokumen_pembelian/dokumen_1765217532463-428824928.png','Penerimaan barang.png',10679,2,'2025-12-08 18:12:12',1,'Dokumen telah divalidasi',3,'2025-12-08 18:12:28'),(20,49,'nota','dokumen_1765218083220-95944182.jpg','/uploads/dokumen_pembelian/dokumen_1765218083220-95944182.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 18:21:23',1,'Dokumen telah divalidasi',3,'2025-12-08 18:21:51'),(21,49,'po','dokumen_1765218091220-174747271.png','/uploads/dokumen_pembelian/dokumen_1765218091220-174747271.png','po.png',101977,2,'2025-12-08 18:21:31',1,'Dokumen telah divalidasi',3,'2025-12-08 18:21:51'),(22,49,'form_penerimaan','dokumen_1765218097901-880999307.png','/uploads/dokumen_pembelian/dokumen_1765218097901-880999307.png','Penerimaan barang.png',10679,2,'2025-12-08 18:21:37',1,'Dokumen telah divalidasi',3,'2025-12-08 18:21:51'),(23,50,'nota','dokumen_1765218563634-342236114.jpg','/uploads/dokumen_pembelian/dokumen_1765218563634-342236114.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 18:29:23',1,'Dokumen telah divalidasi',3,'2025-12-08 19:42:27'),(24,50,'po','dokumen_1765218571590-149043627.png','/uploads/dokumen_pembelian/dokumen_1765218571590-149043627.png','po.png',101977,2,'2025-12-08 18:29:31',1,'Dokumen telah divalidasi',3,'2025-12-08 19:42:27'),(25,50,'form_penerimaan','dokumen_1765218579413-716212723.png','/uploads/dokumen_pembelian/dokumen_1765218579413-716212723.png','Penerimaan barang.png',10679,2,'2025-12-08 18:29:39',1,'Dokumen telah divalidasi',3,'2025-12-08 19:42:27'),(27,51,'po','dokumen_1765223515387-136314674.png','/uploads/dokumen_pembelian/dokumen_1765223515387-136314674.png','Penerimaan barang.png',10679,2,'2025-12-08 19:51:55',1,'Dokumen telah divalidasi',3,'2025-12-08 20:19:01'),(28,51,'form_penerimaan','dokumen_1765223522219-497101353.png','/uploads/dokumen_pembelian/dokumen_1765223522219-497101353.png','po.png',101977,2,'2025-12-08 19:52:02',1,'Dokumen telah divalidasi',3,'2025-12-08 20:19:01'),(29,51,'nota','dokumen_1765223566531-495777385.png','/uploads/dokumen_pembelian/dokumen_1765223566531-495777385.png','Penerimaan barang.png',10679,2,'2025-12-08 19:52:46',1,'Dokumen telah divalidasi',3,'2025-12-08 20:19:01'),(30,53,'nota','dokumen_1765225216621-891522888.png','/uploads/dokumen_pembelian/dokumen_1765225216621-891522888.png','Penerimaan barang.png',10679,2,'2025-12-08 20:20:16',1,'Dokumen telah divalidasi',3,'2025-12-08 20:20:58'),(31,53,'po','dokumen_1765225224614-661657013.png','/uploads/dokumen_pembelian/dokumen_1765225224614-661657013.png','Penerimaan barang.png',10679,2,'2025-12-08 20:20:24',1,'Dokumen telah divalidasi',3,'2025-12-08 20:20:58'),(32,53,'form_penerimaan','dokumen_1765225233562-158370542.png','/uploads/dokumen_pembelian/dokumen_1765225233562-158370542.png','Penerimaan barang.png',10679,2,'2025-12-08 20:20:33',1,'Dokumen telah divalidasi',3,'2025-12-08 20:20:58'),(33,52,'nota','dokumen_1765227766881-583841702.png','/uploads/dokumen_pembelian/dokumen_1765227766881-583841702.png','po.png',101977,2,'2025-12-08 21:02:46',1,'Dokumen telah divalidasi',3,'2025-12-08 21:03:20'),(34,52,'po','dokumen_1765227773607-363690314.png','/uploads/dokumen_pembelian/dokumen_1765227773607-363690314.png','po.png',101977,2,'2025-12-08 21:02:53',1,'Dokumen telah divalidasi',3,'2025-12-08 21:03:20'),(35,52,'form_penerimaan','dokumen_1765227780756-771100050.png','/uploads/dokumen_pembelian/dokumen_1765227780756-771100050.png','po.png',101977,2,'2025-12-08 21:03:00',1,'Dokumen telah divalidasi',3,'2025-12-08 21:03:20'),(36,54,'nota','dokumen_1765229360503-277207964.png','/uploads/dokumen_pembelian/dokumen_1765229360503-277207964.png','Penerimaan barang.png',10679,2,'2025-12-08 21:29:20',0,'tidak boleh',3,'2025-12-08 21:30:06'),(37,54,'po','dokumen_1765229368147-302384198.png','/uploads/dokumen_pembelian/dokumen_1765229368147-302384198.png','po.png',101977,2,'2025-12-08 21:29:28',0,'tidak boleh',3,'2025-12-08 21:30:06'),(38,54,'form_penerimaan','dokumen_1765229375453-894860975.jpg','/uploads/dokumen_pembelian/dokumen_1765229375453-894860975.jpg','Contoh-Nota.jpg',16522,2,'2025-12-08 21:29:35',0,'tidak boleh',3,'2025-12-08 21:30:06');
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
-- Table structure for table `pemesanan`
--

DROP TABLE IF EXISTS `pemesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pemesanan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barang_permintaan_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `tanggal_pemesanan` date NOT NULL,
  `estimasi_selesai` date DEFAULT NULL,
  `catatan` text,
  `status` enum('diproses','selesai','ditolak','divalidasi') DEFAULT 'diproses',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pemesanan_barang` (`barang_permintaan_id`),
  KEY `idx_pemesanan_status` (`status`),
  KEY `idx_pemesanan_admin` (`admin_id`),
  CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`barang_permintaan_id`) REFERENCES `barang_permintaan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pemesanan`
--

LOCK TABLES `pemesanan` WRITE;
/*!40000 ALTER TABLE `pemesanan` DISABLE KEYS */;
INSERT INTO `pemesanan` VALUES (11,51,2,'2025-12-08',NULL,'Pemesanan untuk Kertas A4','selesai','2025-12-08 19:50:47','2025-12-08 20:19:01'),(12,53,2,'2025-12-08',NULL,'Pemesanan untuk Keyboard Mechanical','selesai','2025-12-08 20:20:00','2025-12-08 20:20:58'),(13,52,2,'2025-12-08',NULL,'Pemesanan untuk Keyboard Mechanical','selesai','2025-12-08 21:02:28','2025-12-08 21:03:20'),(14,54,2,'2025-12-08',NULL,'Pemesanan untuk Keyboard Mechanical','diproses','2025-12-08 21:21:48','2025-12-08 21:30:06');
/*!40000 ALTER TABLE `pemesanan` ENABLE KEYS */;
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
  `status` varchar(50) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permintaan`
--

LOCK TABLES `permintaan` WRITE;
/*!40000 ALTER TABLE `permintaan` DISABLE KEYS */;
INSERT INTO `permintaan` VALUES (24,'REQ-1765134446944',1,'2025-12-03','selesai','Kebutuhan Kantor','2025-12-07 19:07:26','2025-12-07 19:16:32'),(25,'REQ-1765135142762',1,'2025-12-14','ditolak','Setup Gaming Kantor','2025-12-07 19:19:02','2025-12-07 19:38:20'),(26,'REQ-1765136464684',1,'2025-12-14','diproses','Setup Nobar','2025-12-07 19:41:04','2025-12-07 22:26:22'),(27,'REQ-1765136526932',1,'2025-12-14','diproses','Tes Status Diproses','2025-12-07 19:42:06','2025-12-07 19:43:25'),(28,'REQ-1765146689251',1,'2025-12-14','selesai','tes pembelian','2025-12-07 22:31:29','2025-12-07 22:32:31'),(29,'REQ-1765167417613',1,'2025-12-08','diproses','Permintaan','2025-12-08 04:16:57','2025-12-08 04:53:27'),(30,'REQ-1765171382191',1,'2025-12-08','diproses','Vanesh Gay','2025-12-08 05:23:02','2025-12-08 05:24:12'),(31,'REQ-1765173359500',1,'2025-12-15','diproses','Permintaan','2025-12-08 05:55:59','2025-12-08 13:37:58'),(32,'REQ-1765210617279',1,'2025-12-15','selesai','p','2025-12-08 16:16:57','2025-12-08 18:16:58'),(33,'REQ-1765215912321',1,'2025-12-15','diproses','tes pembelian','2025-12-08 17:45:12','2025-12-08 18:12:28'),(34,'REQ-1765217980749',1,'2025-12-15','diproses','fawd','2025-12-08 18:19:40','2025-12-08 21:30:06'),(35,'REQ-1765872704092',1,'2025-12-16','menunggu','Pengadaan ATK','2025-12-16 08:11:44','2025-12-16 08:11:44'),(36,'REQ-1765887739681',1,'2025-12-17','menunggu','Contoh Judul','2025-12-16 12:22:19','2025-12-16 12:22:58'),(37,'REQ-1766054185344',1,'2025-12-18','selesai','testing koneksi','2025-12-18 10:36:25','2025-12-18 10:37:01'),(38,'REQ-1766054472748',13,'2025-12-18','ditolak','Testing Permintaan','2025-12-18 10:41:12','2025-12-18 10:42:14'),(39,'REQ-1766054688232',13,'2025-12-18','selesai','Contoh Judul','2025-12-18 10:44:48','2025-12-18 10:45:17');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stok_barang`
--

LOCK TABLES `stok_barang` WRITE;
/*!40000 ALTER TABLE `stok_barang` DISABLE KEYS */;
INSERT INTO `stok_barang` VALUES (2,'BRG-002',1,'Monitor 24\"','LED, 1920x1080, HDMI',1,30,3,'2025-12-01 09:55:06','2025-12-18 10:45:17'),(3,'BRG-003',2,'Kertas A4','80 gram, 1 rim',4,70,5,'2025-12-01 09:55:06','2025-12-07 19:05:12'),(4,'BRG-004',2,'Pulpen Standard','Hitam, ballpoint',2,100,20,'2025-12-01 09:55:06','2025-12-07 19:16:32'),(5,'BRG-005',4,'Keyboard Mechanical','RGB, Brown Switch, USB',1,30,2,'2025-12-01 09:55:06','2025-12-07 19:15:13'),(6,'BRG-006',5,'Meja Kantor','Kayu, 120x60 cm',1,46,3,'2025-12-01 09:55:06','2025-12-07 17:01:32'),(7,'BRG-007',5,'Kursi Ergonomis','Adjustable height, mesh back',1,6,2,'2025-12-01 09:55:06','2025-12-07 22:32:31'),(8,'BRG-1764587280800',1,'Mouse Wireless','Bluetooth, 1600 DPI',2,20,5,'2025-12-01 11:08:00','2025-12-01 11:08:00'),(9,'KKB-007',7,'Meja','Besar, Keras, Kaki 4',1,34,5,'2025-12-03 16:43:21','2025-12-07 19:05:37'),(10,'BRG-014',6,'Mobil Limo','8 Kursi, Mesin V8, Roda 4',1,38,5,'2025-12-05 11:46:14','2025-12-07 19:06:03'),(11,'BRG-015',8,'Kasur','3x2 Meter, Queen Size',2,36,0,'2025-12-05 12:09:56','2025-12-18 10:37:01');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kepala_it','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','pemohon',1,'it@company.com','Budi Santoso',1,'2025-12-01 09:55:06','2025-12-18 10:35:29','2025-12-18 10:35:29'),(2,'ga_admin','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','admin',3,'ga@company.com','Siti Rahayu',1,'2025-12-01 09:55:06','2025-12-18 10:35:15','2025-12-18 10:35:15'),(3,'finance_val','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','validator',2,'finance@company.com','Ahmad Wijaya',1,'2025-12-01 09:55:06','2025-12-08 17:35:31','2025-12-08 17:35:31'),(4,'staff_marketing','$2b$10$5BpcgiiM.m2OEdaKrrTdj.gbf4IKZjToNd0pNN8joEjz8sJ6GKYTe','pemohon',5,'marketing@company.com','Dewi Lestari',0,'2025-12-01 09:55:06','2025-12-18 10:38:24',NULL),(5,'hrd_divisi','$2b$10$2ju.xjjcCZ2znDTHrBwcIeuqWRAu0VaUQjBkgn9Y16Nnq/4NJ3loq','pemohon',3,'agabs@itcenter.com','Agabs',0,'2025-12-06 10:05:51','2025-12-06 22:00:47',NULL),(11,'Orang Tech Support','$2b$10$ExYy7NK9puYCdtiEdbapROoTJWuOKrTyv0Tbi85j4/W3Y0mBHqMG6','pemohon',1,'staf-it-support@gmail.com','Tech IT',1,'2025-12-07 07:28:06','2025-12-07 07:59:49','2025-12-07 07:59:49'),(13,'user_hrd','$2b$10$nf3M3q9dSyuKAg9DHixZQetphvZ5p9AMbip.xjViZ4OCdJ0qLrit6','pemohon',3,'gilang@gmail.com','Gilang Sunandar',1,'2025-12-18 10:39:39','2025-12-18 10:44:16','2025-12-18 10:44:16');
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

-- Dump completed on 2025-12-19  8:18:14
