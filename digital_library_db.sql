-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2023 at 07:55 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `digital_library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `guid` varchar(100) NOT NULL,
  `is_admin` int(1) NOT NULL,
  `active_user` int(1) DEFAULT NULL,
  `otp` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `guid`, `is_admin`, `active_user`, `otp`) VALUES
(10, 'Maaz H Khan', 'maaz.hk98@gmail.com', '$2a$10$Rl9JlRiQJovjVpqBdgQwS.syXLhj3g3rVGKcQdtV0mqsyq32S1Eey', 'a1ac4728-bda0-400c-907a-7658288435b7', 1, 1, NULL),
(11, 'Test Users 2', 'test.hk98@gmail.com', '$2a$10$BwWMWNa5alExqiMfmN0adeFX6WewQL/09Jk/naGr3oi/k2WofnMhK', '04811866-1952-4f01-aa15-ba0ace3f7706', 0, 1, NULL),
(12, 'Test Users', 'test.hk98@gmail.com', '$2a$10$fbcYA1EZuUQydbpXhueWpeffPNgX.6MRG7skpV60jC8p.G90VGJKC', '360918b0-7ec6-4322-907d-5417e6c76c9d', 0, 1, NULL),
(13, 'testuser', 'mkhan016@odu.edu', '$2a$10$DeZPyXimDdq.8SIfQ..8ruFjq9ptvKMe4bJWy8DXt1YBR.1LwG3vq', '930f6b7c-f3fc-4ca8-8a5f-f3fc715291eb', 0, 1, NULL),
(17, 'Maaz Khan', 'hary.d.crazie98@gmail.com', '$2a$10$08zldcKByarowGZppX0p9esEVAzA5DMzX4Oly8Svs98bhUeETRUpO', 'fdac9b81-5bc4-4f2b-9886-a3e8e40e4195', 0, 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
