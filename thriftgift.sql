-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: thriftandgift
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add user',7,'add_user'),(26,'Can change user',7,'change_user'),(27,'Can delete user',7,'delete_user'),(28,'Can view user',7,'view_user'),(29,'Can add clothing item',8,'add_clothingitem'),(30,'Can change clothing item',8,'change_clothingitem'),(31,'Can delete clothing item',8,'delete_clothingitem'),(32,'Can view clothing item',8,'view_clothingitem'),(33,'Can add cart item',9,'add_cartitem'),(34,'Can change cart item',9,'change_cartitem'),(35,'Can delete cart item',9,'delete_cartitem'),(36,'Can view cart item',9,'view_cartitem'),(37,'Can add chat',10,'add_chat'),(38,'Can change chat',10,'change_chat'),(39,'Can delete chat',10,'delete_chat'),(40,'Can view chat',10,'view_chat'),(41,'Can add payment',11,'add_payment'),(42,'Can change payment',11,'change_payment'),(43,'Can delete payment',11,'delete_payment'),(44,'Can view payment',11,'view_payment'),(45,'Can add order',12,'add_order'),(46,'Can change order',12,'change_order'),(47,'Can delete order',12,'delete_order'),(48,'Can view order',12,'view_order'),(49,'Can add clothing bank',13,'add_clothingbank'),(50,'Can change clothing bank',13,'change_clothingbank'),(51,'Can delete clothing bank',13,'delete_clothingbank'),(52,'Can view clothing bank',13,'view_clothingbank'),(53,'Can add order',14,'add_order'),(54,'Can change order',14,'change_order'),(55,'Can delete order',14,'delete_order'),(56,'Can view order',14,'view_order'),(57,'Can add review',15,'add_review'),(58,'Can change review',15,'change_review'),(59,'Can delete review',15,'delete_review'),(60,'Can view review',15,'view_review');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `item_id_idx` (`item_id`),
  CONSTRAINT `cart_item_fk` FOREIGN KEY (`item_id`) REFERENCES `clothing_item` (`item_id`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (95,1,43,21),(96,2,44,18),(98,2,46,20),(99,1,46,13),(100,1,44,23),(101,1,43,18),(102,1,43,23);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `sender_id_idx` (`sender_id`),
  KEY `receiver_id_idx` (`receiver_id`),
  CONSTRAINT `receiver_id` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `sender_id` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,32,38,'Hello tyo hajur le halna vako clothing bank ko Black Tshirt aja donation ko lagi avaliable cha?','2025-03-22 17:25:44'),(2,38,32,'Cha hajur','2025-03-22 17:26:11'),(3,32,36,'Hello...hajur ko location kata ko ho','2025-03-22 17:27:07'),(4,36,32,'Bhaktapur','2025-03-22 17:27:37'),(10,32,36,'Aaa','2025-03-22 18:52:07'),(11,32,36,'Hajur','2025-03-22 18:52:32'),(12,36,32,'Kina ra','2025-03-22 18:58:51'),(13,32,38,'Malai chayeko thyo hajur ko location ra number dinus na','2025-03-23 06:15:50'),(14,38,32,'Ok...deuso tir send gari dinchu','2025-03-23 06:16:21'),(15,32,38,'Huss','2025-03-23 06:16:38'),(16,32,37,'Hello niraj','2025-03-23 08:16:36'),(17,32,37,'hi','2025-03-27 12:41:55'),(18,37,32,'Yes?','2025-03-27 19:25:04'),(19,32,41,'hi','2025-03-30 08:17:04'),(20,41,32,'hi','2025-03-30 08:17:22'),(21,32,37,'Kata ho','2025-04-02 05:46:16'),(22,43,37,'Hi niraj is the black jacket you added for donation still avaliable?','2025-04-23 20:29:24'),(23,32,41,'k,','2025-04-25 07:27:09'),(24,32,44,'hi','2025-04-30 00:11:35');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_bank`
--

DROP TABLE IF EXISTS `clothing_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothing_bank` (
  `donation_id` int NOT NULL AUTO_INCREMENT,
  `donator_user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `phonenumber` varchar(15) NOT NULL,
  `category` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `removed` tinyint(1) DEFAULT '0',
  `removal_reason` varchar(255) DEFAULT NULL,
  `removed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`donation_id`),
  KEY `donator_user_id_idx` (`donator_user_id`),
  CONSTRAINT `donator_user_id` FOREIGN KEY (`donator_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_bank`
--

LOCK TABLES `clothing_bank` WRITE;
/*!40000 ALTER TABLE `clothing_bank` DISABLE KEYS */;
INSERT INTO `clothing_bank` VALUES (3,37,'niraj','7602885143','Winter Jacket','L','Very warm but the pocket is torn','clothing_images/Winter_9Eq9n8i.jpeg',0,NULL,NULL),(4,36,'sid','9800862667','Coat','XL','Used formal coat good condition','clothing_images/coat_E5TSE32.jpeg',0,NULL,NULL),(6,36,'sid','9840259912','Feather Jacket','L','Clean and used only once','clothing_images/00000001_zi_a21a014d-fb2d-4821-ae4f-f69709c35f1b.webp',1,'unavailable','2025-04-07 05:09:38'),(7,38,'Kritika','9853265472','Black Tshirt','L','Suitable for wearing at home','clothing_images/168773782582fd7e93e7.webp',0,NULL,NULL),(10,44,'Seller','961786006','Blue Shirt','XL','Used this shirt only once donating it since it no longer fits me','clothing_images/OIP_VsrQayv_cEmkZPt.jpeg',0,NULL,NULL),(11,44,'Seller','4234324234','dsf','f','dfs','clothing_images/RR-Blog-The-Environmental-Crisis-Caused-By-Textile-Waste-Hero.webp',1,'not_donating','2025-04-30 00:19:04');
/*!40000 ALTER TABLE `clothing_bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clothing_item`
--

DROP TABLE IF EXISTS `clothing_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothing_item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `size` varchar(45) NOT NULL,
  `price` int NOT NULL,
  `condition` varchar(45) NOT NULL,
  `tags` varchar(45) NOT NULL,
  `location` varchar(45) DEFAULT NULL,
  `clothing_user_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `removed` tinyint(1) DEFAULT '0',
  `removal_reason` varchar(255) DEFAULT NULL,
  `removed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `clothing_user_id_idx` (`clothing_user_id`),
  CONSTRAINT `clothing_user_id` FOREIGN KEY (`clothing_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothing_item`
--

LOCK TABLES `clothing_item` WRITE;
/*!40000 ALTER TABLE `clothing_item` DISABLE KEYS */;
INSERT INTO `clothing_item` VALUES (13,'Black Jacket','Pure Leather','Medium',1300,'new','Classy','Kapan',36,'clothing_images/OIPPPP_5t5rtOG_e3fbUnV.jpg',0,NULL,NULL),(14,'Blue sweater','Used only once','XL',1999,'used','Warm','Maitidevi',36,'clothing_images/OIP_1_rtjd2xP.jpeg',1,'not_selling','2025-04-07 04:50:42'),(15,'White Tshirt','Clean and Minimal','Large',500,'refurbished','Cool','Jorpati',37,'clothing_images/R_L27a9mP.jpeg',0,NULL,NULL),(18,'Black Pant','Jet Black','Small',1000,'used','Casual pants','Jorpati',37,'clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg',0,NULL,NULL),(20,'White Joggers','Very comfortable','L',700,'refurbished','Comfortable','Maitidevi',36,'clothing_images/R_l8ZToB4.jpeg',0,NULL,NULL),(21,'Lenin T-Shirt','Perfect for summers','M',400,'used','Stylish','Maharajgunj',38,'clothing_images/OIP_2.jpeg',0,NULL,NULL),(23,'Tracksuit','Best for gym','M',500,'used','Gym wear','Harion',36,'clothing_images/tracksuit.jpg',0,NULL,NULL),(24,'dsa','das','ddas',3423,'new','sadd','sadas',44,'clothing_images/OIP_VsrQayv_18XL9Pc.jpeg',1,NULL,NULL),(25,'Tracksuit','dsf','dsf',43,'new','dfs','dsf',44,'clothing_images/System-Architecture-Diagram-1024x645.png',1,NULL,NULL),(26,'Tracksuiteee','dss','dsa',4234,'new','dsa','sad',44,'clothing_images/Blue_Flat_Illustrative_Human_Artificial_Intelligence_Technology_Logo_53sAzI4.png',1,'not_selling','2025-04-30 00:22:49'),(27,'fdsf','dsf','34534',43543,'new','dsf','dsf',44,'clothing_images/System-Architecture-Diagram-1024x645_nmwnMDH.png',1,'unavailable','2025-04-30 00:36:51'),(28,'Wwww','dsf','d',345,'new','dsf','dsf',44,'clothing_images/RR-Blog-The-Environmental-Crisis-Caused-By-Textile-Waste-Hero_4ZPKYHt.webp',1,'Dont want to sell this','2025-04-30 00:54:10');
/*!40000 ALTER TABLE `clothing_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(9,'cart','cartitem'),(10,'chat','chat'),(8,'clothing','clothingitem'),(13,'clothing_bank','clothingbank'),(5,'contenttypes','contenttype'),(12,'order','order'),(14,'orders','order'),(11,'payment','payment'),(15,'reviews','review'),(6,'sessions','session'),(7,'users','user');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-02-14 17:46:06.853797'),(2,'auth','0001_initial','2025-02-14 17:46:07.903868'),(3,'admin','0001_initial','2025-02-14 17:46:08.161723'),(4,'admin','0002_logentry_remove_auto_add','2025-02-14 17:46:08.171043'),(5,'admin','0003_logentry_add_action_flag_choices','2025-02-14 17:46:08.180116'),(6,'contenttypes','0002_remove_content_type_name','2025-02-14 17:46:08.366742'),(7,'auth','0002_alter_permission_name_max_length','2025-02-14 17:46:08.478818'),(8,'auth','0003_alter_user_email_max_length','2025-02-14 17:46:08.564222'),(9,'auth','0004_alter_user_username_opts','2025-02-14 17:46:08.572988'),(10,'auth','0005_alter_user_last_login_null','2025-02-14 17:46:08.670676'),(11,'auth','0006_require_contenttypes_0002','2025-02-14 17:46:08.675161'),(12,'auth','0007_alter_validators_add_error_messages','2025-02-14 17:46:08.685295'),(13,'auth','0008_alter_user_username_max_length','2025-02-14 17:46:08.794865'),(14,'auth','0009_alter_user_last_name_max_length','2025-02-14 17:46:08.908458'),(15,'auth','0010_alter_group_name_max_length','2025-02-14 17:46:08.931113'),(16,'auth','0011_update_proxy_permissions','2025-02-14 17:46:08.943432'),(17,'auth','0012_alter_user_first_name_max_length','2025-02-14 17:46:09.060258'),(18,'sessions','0001_initial','2025-02-14 17:46:09.113569'),(19,'cart','0001_initial','2025-02-15 14:46:53.539036'),(20,'chat','0001_initial','2025-02-15 14:46:53.579727'),(21,'clothing','0001_initial','2025-02-15 14:46:53.589632'),(22,'order','0001_initial','2025-02-15 14:46:53.605651'),(23,'payment','0001_initial','2025-02-15 14:46:53.626091'),(24,'users','0001_initial','2025-02-15 14:46:53.639314'),(25,'clothing_bank','0001_initial','2025-02-15 17:36:29.450197'),(26,'orders','0001_initial','2025-02-17 16:19:05.751176'),(27,'orders','0002_alter_order_table','2025-02-17 16:19:05.768196'),(28,'users','0002_alter_user_options','2025-02-20 12:13:20.921515'),(29,'users','0003_remove_user_address_remove_user_phone_and_more','2025-02-20 17:17:05.147264'),(30,'users','0004_alter_user_date_joined_alter_user_password','2025-02-20 19:06:47.877252'),(31,'cart','0002_alter_cartitem_options','2025-02-22 07:39:58.410110'),(32,'cart','0003_cartitem_item_cartitem_user','2025-03-03 09:59:32.152949'),(33,'cart','0004_alter_cartitem_item_alter_cartitem_user','2025-03-03 09:59:32.187638'),(34,'reviews','0001_initial','2025-03-03 09:59:43.321139');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_user_id` int NOT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` int NOT NULL,
  `order_status` varchar(45) NOT NULL,
  `shipping_address` text NOT NULL,
  `payment_type` varchar(50) NOT NULL,
  `order_item_id` int NOT NULL,
  `order_name` varchar(255) NOT NULL,
  `order_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `order_user_id_idx` (`order_user_id`),
  KEY `order_item_id_idx` (`order_item_id`),
  CONSTRAINT `order_item_fk` FOREIGN KEY (`order_item_id`) REFERENCES `clothing_item` (`item_id`),
  CONSTRAINT `order_user_id` FOREIGN KEY (`order_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,32,'2025-03-26 18:47:55',600,'completed','Kapan-Sapredhunga','khalti',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(2,32,'2025-03-26 18:50:57',1400,'shipped','Maitidevi','khalti',13,'Black Jacket','clothing_images/OIPPPP_5t5rtOG_e3fbUnV.jpg'),(3,32,'2025-03-26 18:52:28',2099,'pending','Jorpati','cod',14,'Blue sweater','clothing_images/OIP_1_rtjd2xP.jpeg'),(4,40,'2025-03-27 11:15:27',500,'completed','Jorpati','cod',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(5,32,'2025-03-27 11:46:00',1100,'pending','Dhulikhel','khalti',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(6,32,'2025-03-27 12:20:26',900,'completed','Balkot','cod',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(7,32,'2025-03-27 18:41:06',800,'pending','Jhapa','khalti',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(8,32,'2025-03-27 19:18:03',1100,'pending','Test','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(9,42,'2025-04-02 04:04:47',500,'completed','Bhaisepati- Near Bhat-Bhateni','cod',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(10,42,'2025-04-02 04:07:39',1100,'pending','Narayantar','khalti',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(11,42,'2025-04-02 04:09:18',2099,'cancelled','Rajkot','khalti',14,'Blue sweater','clothing_images/OIP_1_rtjd2xP.jpeg'),(12,43,'2025-04-23 20:26:04',1100,'completed','Lazimpat,Thamel','khalti',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(13,32,'2025-04-25 06:46:49',1100,'pending','fff','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(14,32,'2025-04-25 07:14:29',28086,'pending','Kathmandu, Nepal Asia','cod',14,'Blue sweater','clothing_images/OIP_1_rtjd2xP.jpeg'),(15,32,'2025-04-25 07:14:29',4100,'pending','Kathmandu, Nepal Asia','cod',23,'Tracksuit','clothing_images/tracksuit.jpg'),(16,32,'2025-04-25 07:14:29',10600,'pending','Kathmandu, Nepal Asia','cod',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(17,32,'2025-04-25 07:14:29',12100,'pending','Kathmandu, Nepal Asia','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(18,32,'2025-04-25 07:14:29',5300,'pending','Kathmandu, Nepal Asia','cod',13,'Black Jacket','clothing_images/OIPPPP_5t5rtOG_e3fbUnV.jpg'),(19,32,'2025-04-25 07:14:29',1100,'pending','Kathmandu, Nepal Asia','cod',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(20,32,'2025-04-25 07:16:00',10600,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(21,32,'2025-04-25 07:16:00',4100,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',23,'Tracksuit','clothing_images/tracksuit.jpg'),(22,32,'2025-04-25 07:16:00',12100,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(23,32,'2025-04-25 07:16:00',28086,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',14,'Blue sweater','clothing_images/OIP_1_rtjd2xP.jpeg'),(24,32,'2025-04-25 07:16:00',5300,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',13,'Black Jacket','clothing_images/OIPPPP_5t5rtOG_e3fbUnV.jpg'),(25,32,'2025-04-25 07:16:00',1100,'pending','ghfffhnfn,kyguguiuiouioyuioyui','cod',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(26,32,'2025-04-25 07:22:19',1100,'pending','Just a testing address','khalti',15,'White Tshirt','clothing_images/R_L27a9mP.jpeg'),(27,32,'2025-04-25 07:26:05',1100,'pending','glulhulhhlhjlhkjlhkjl','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(28,32,'2025-04-29 23:42:40',2100,'pending','dsadasdasd','cod',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(29,43,'2025-04-30 00:47:54',500,'completed','jkjkjhbhbjhbj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(30,43,'2025-04-30 01:03:49',500,'pending','ggfdgdgdgdf','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(31,46,'2025-04-30 01:44:46',1500,'pending','mmmmmmmmmmm','khalti',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(32,46,'2025-04-30 01:44:46',1100,'pending','mmmmmmmmmmm','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(33,46,'2025-04-30 01:45:21',1100,'pending','hjjjjhbjhbjbhj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(34,46,'2025-04-30 01:45:21',1500,'pending','hjjjjhbjhbjbhj','khalti',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(35,46,'2025-04-30 01:47:46',1500,'pending','sdaasdsdasda','khalti',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(36,46,'2025-04-30 01:47:46',1100,'pending','sdaasdsdasda','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(37,46,'2025-04-30 01:48:06',1500,'pending','dsadasdsdaas','khalti',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(38,46,'2025-04-30 01:50:20',1400,'pending','w4erertwefwefwef','cod',13,'Black Jacket','clothing_images/OIPPPP_5t5rtOG_e3fbUnV.jpg'),(39,46,'2025-04-30 01:50:20',1500,'pending','w4erertwefwefwef','cod',20,'White Joggers','clothing_images/R_l8ZToB4.jpeg'),(40,43,'2025-04-30 02:39:03',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(41,43,'2025-04-30 02:39:03',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(42,43,'2025-04-30 02:39:13',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(43,43,'2025-04-30 02:39:13',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(44,43,'2025-04-30 02:39:13',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(45,43,'2025-04-30 02:39:13',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(46,43,'2025-04-30 02:39:13',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(47,43,'2025-04-30 02:39:13',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(48,43,'2025-04-30 02:39:13',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(49,43,'2025-04-30 02:39:13',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(50,43,'2025-04-30 02:39:13',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(51,43,'2025-04-30 02:39:14',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(52,43,'2025-04-30 02:39:14',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(53,43,'2025-04-30 02:39:14',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(54,43,'2025-04-30 02:39:14',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(55,43,'2025-04-30 02:39:14',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(56,43,'2025-04-30 02:39:14',500,'pending','vhjvhjhbjbkj','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(57,43,'2025-04-30 02:39:14',1100,'pending','vhjvhjhbjbkj','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(58,43,'2025-04-30 02:41:07',1100,'pending','Kapan,Sapredhunga','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(59,43,'2025-04-30 02:41:07',500,'pending','Kapan,Sapredhunga','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(60,43,'2025-04-30 02:43:55',500,'pending','Kapan,Sapredhunga','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(61,43,'2025-04-30 02:43:55',1100,'pending','Kapan,Sapredhunga','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(62,43,'2025-04-30 02:54:36',1100,'pending','Kapan,Sapredhunga','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(63,43,'2025-04-30 02:54:36',500,'pending','Kapan,Sapredhunga','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(64,43,'2025-04-30 02:55:08',600,'pending','csdsczczxc','khalti',23,'Tracksuit','clothing_images/tracksuit.jpg'),(65,43,'2025-04-30 02:55:08',1100,'pending','csdsczczxc','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(66,43,'2025-04-30 02:55:08',500,'pending','csdsczczxc','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(67,43,'2025-04-30 02:58:42',600,'pending','csdsczczxc','khalti',23,'Tracksuit','clothing_images/tracksuit.jpg'),(68,43,'2025-04-30 02:58:42',1100,'pending','csdsczczxc','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(69,43,'2025-04-30 02:58:42',500,'pending','csdsczczxc','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(70,43,'2025-04-30 03:00:25',1100,'pending','csdsczczxc','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(71,43,'2025-04-30 03:00:25',600,'pending','csdsczczxc','khalti',23,'Tracksuit','clothing_images/tracksuit.jpg'),(72,43,'2025-04-30 03:00:25',500,'pending','csdsczczxc','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg'),(73,43,'2025-04-30 03:04:00',1100,'pending','csdsczczxc','khalti',18,'Black Pant','clothing_images/OIP_6XfMrKy_DhbK8w5.jpeg'),(74,43,'2025-04-30 03:04:00',600,'pending','csdsczczxc','khalti',23,'Tracksuit','clothing_images/tracksuit.jpg'),(75,43,'2025-04-30 03:04:00',500,'cancelled','csdsczczxc','khalti',21,'Lenin T-Shirt','clothing_images/OIP_2.jpeg');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_order_name_before_insert` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE item_title VARCHAR(255);
    SELECT title INTO item_title FROM thriftandgift.clothing_item WHERE item_id = NEW.order_item_id;
    SET NEW.order_name = item_title;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_order_details_before_insert` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE item_title VARCHAR(255);
    DECLARE item_image VARCHAR(255);

    
    SELECT title, image INTO item_title, item_image 
    FROM thriftandgift.clothing_item 
    WHERE item_id = NEW.order_item_id;

    
    SET NEW.order_name = item_title;
    SET NEW.order_image = item_image;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_order_name_before_update` BEFORE UPDATE ON `orders` FOR EACH ROW BEGIN
    DECLARE item_title VARCHAR(255);

    
    SELECT title INTO item_title FROM thriftandgift.clothing_item WHERE item_id = NEW.order_item_id;

    
    IF NEW.order_item_id != OLD.order_item_id THEN
        SET NEW.order_name = item_title;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_order_details_before_update` BEFORE UPDATE ON `orders` FOR EACH ROW BEGIN
    DECLARE item_title VARCHAR(255);
    DECLARE item_image VARCHAR(255);

    
    SELECT title, image INTO item_title, item_image 
    FROM thriftandgift.clothing_item 
    WHERE item_id = NEW.order_item_id;

    
    IF NEW.order_item_id != OLD.order_item_id THEN
        SET NEW.order_name = item_title;
        SET NEW.order_image = item_image;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_status` varchar(45) NOT NULL,
  `payment_sender_id` int NOT NULL,
  `payment_item_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `sender_id_idx` (`payment_sender_id`),
  KEY `payment_item_id_idx` (`payment_item_id`),
  CONSTRAINT `payment_fk` FOREIGN KEY (`payment_item_id`) REFERENCES `clothing_item` (`item_id`) ON DELETE CASCADE,
  CONSTRAINT `payment_sender_id` FOREIGN KEY (`payment_sender_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,600,'2025-03-26 18:47:55','pending',32,15),(2,1400,'2025-03-26 18:50:58','pending',32,13),(3,1100,'2025-03-27 11:46:00','pending',32,15),(4,800,'2025-03-27 18:41:06','pending',32,20),(5,1100,'2025-04-02 04:07:39','pending',42,15),(6,2099,'2025-04-02 04:09:18','pending',42,14),(7,1100,'2025-04-23 20:26:04','pending',43,15),(8,1100,'2025-04-25 07:22:19','pending',32,15),(9,500,'2025-04-30 00:47:55','pending',43,21),(10,500,'2025-04-30 01:03:49','pending',43,21),(11,1500,'2025-04-30 01:48:06','pending',46,20),(12,2000,'2025-04-30 03:04:00','pending',43,21);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `reviewer_user_id` int NOT NULL,
  `reviewer_user_name` varchar(45) NOT NULL,
  `product_item_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `reviewer_user_id_idx` (`reviewer_user_id`),
  KEY `product_item_id_idx` (`product_item_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `product_item_id` FOREIGN KEY (`product_item_id`) REFERENCES `clothing_item` (`item_id`),
  CONSTRAINT `reviewer_user_id` FOREIGN KEY (`reviewer_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,'Great product!','2025-03-03 10:31:41',36,'sid',14,NULL),(2,4,'Honest Seller','2025-03-03 18:58:10',32,'Dhiraj',15,NULL),(4,1,'The pant was faded and the quality was bad','2025-03-08 18:58:55',37,'niraj',18,NULL),(5,2,'Amazing Quality and Worth the price','2025-03-09 05:00:46',38,'Kritika',13,NULL),(7,4,'Loved it looks like new :)','2025-03-27 18:30:26',32,'Dhiraj',13,2),(8,4,'Amazing Quality','2025-03-27 18:48:42',32,'Dhiraj',21,6),(10,3,'hinkn','2025-03-30 08:10:33',32,'Dhiraj',15,1),(11,4,'Satisfactory','2025-04-02 04:06:28',42,'Bishal',21,9),(12,4,'Loved the fabric quality','2025-04-23 17:34:06',32,'Dhiraj',15,1),(13,4,'Fast Delivery and good product','2025-04-23 20:31:08',43,'Buyer',15,12),(14,3,'NICE','2025-04-29 23:43:56',32,'Dhiraj',15,1),(15,2,'Decent','2025-04-30 00:52:56',43,'Buyer',21,29);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(128) NOT NULL,
  `role` varchar(45) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_staff` tinyint(1) NOT NULL DEFAULT '0',
  `is_superuser` tinyint(1) NOT NULL DEFAULT '0',
  `date_joined` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'John Doe','johndoe@example.com','securepassword123','seller',1,0,0,'2025-02-20 18:01:18',NULL),(32,'Dhiraj','dhiraj@gmail.com','pbkdf2_sha256$870000$P1BAcKhBo9BiMFAlngfq9j$A+WU76PSPPE5DJTNm3hHSCtwcvHb9UU74AKBObCETM8=','buyer',1,0,0,'2025-02-28 06:27:25','2025-02-28 06:27:26'),(36,'sid','sid@gmail.com','pbkdf2_sha256$870000$JAExjaJkYMGC6Dl1lewtm2$IwTv1NJ1SrN5XVDvfHJViqtV7ZsD1kaFZmeyFEJtPCw=','seller',1,0,0,'2025-03-02 04:16:48','2025-03-02 04:16:50'),(37,'niraj','niraj@gmail.com','pbkdf2_sha256$870000$m9b3luyTl9Sj1jc6wwVX3v$xz07Q/OuHfzsZraF8PjjenwxGWfYJji5KPRDzFjTO40=','seller',1,0,0,'2025-03-02 04:17:53','2025-03-02 04:17:54'),(38,'Kritika','Kritika@gmail.com','pbkdf2_sha256$870000$y6UtE5AMAa3SRSLQ2XbNW0$b8dp2/46aulvi2ln4lbwtqelK0GJms8oNoDTc3t2D4M=','seller',1,0,0,'2025-03-09 04:55:28','2025-03-09 04:55:30'),(39,'Tester','tester@gmail.com','pbkdf2_sha256$870000$bTz8VDmpBRSpAyuGlMN6VO$fSQuXcXM6ms0I5Eq7gRuzjWxRhv76CYrgMRozks0Mdo=','buyer',1,0,0,'2025-03-21 10:53:22','2025-03-21 10:53:23'),(40,'Siddhant Bhurtel','siddhantbhurtel@gmail.com','pbkdf2_sha256$870000$ZAnx4WXCq900uUZQ9ZhmKQ$ZZgqn49phhyACQ8V07H4XvbUED7uy1ido7qZQwi2tT0=','buyer',1,0,1,'2025-03-25 09:26:01','2025-03-25 09:26:03'),(41,'inni','inni@gmail.com','pbkdf2_sha256$870000$cVfC3cy76zjGIXmHV7p0J0$HybiOiBXywf8sqw+UOa0Uak1KGrhfthvWnOe5JZ4nEk=','seller',1,0,0,'2025-03-30 08:12:02','2025-03-30 08:12:16'),(42,'Bishal','bishal@gmail.com','pbkdf2_sha256$870000$d91AJI2NZIiyw3HMQ2Vpjv$tivhF35w7mkNgtprkFl+Zviw+BE5G6H95i8oAdDdnLs=','buyer',1,0,0,'2025-04-02 04:00:48','2025-04-02 04:00:51'),(43,'Buyer','Buyer@gmail.com','pbkdf2_sha256$870000$cM5znIP2wj1RhG1PPlEcYY$AYAXS4oWehjrY2vFoKTpqSH0crsRqxJOFbsiYJtD/Ks=','buyer',1,0,0,'2025-04-23 20:22:03','2025-04-23 20:22:05'),(44,'Seller','Seller@gmail.com','pbkdf2_sha256$870000$UidPdcZefbUzI7PjF2P5yr$i8pUvkeV5EpNzuH5b7MV/mNYwnPZhDQLXp/PUstTUuY=','seller',1,0,0,'2025-04-23 20:36:46','2025-04-23 20:36:48'),(45,'roshan','roshan@gmail.com','pbkdf2_sha256$870000$oliH23nbnmLe78hcLytt0e$O+TRvpPdIJgv8N9JuAD3qsPZF3PDmimqDQsdhxyLA+U=','seller',1,0,0,'2025-04-25 07:32:27','2025-04-25 07:32:29'),(46,'asd','asd@gmail.com','pbkdf2_sha256$870000$ivezVDqxBC7ZEwM9J9tAbv$QmsBrA2fRZ9Ldzyg5axpH51aot1kOJu/+GM+53Z3CV4=','buyer',1,0,0,'2025-04-30 01:24:49','2025-04-30 01:24:52');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-30  9:12:05
