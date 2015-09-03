DROP DATABASE if exists flashcards;
CREATE DATABASE if not exists flashcards;
USE flashcards;

CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) BINARY NOT NULL,
  password varchar(255) NOT NULL,
  fname varchar(255) NOT NULL,
  lname varchar(255) NOT NULL,
  email varchar(255) NOT NULL
);

CREATE TABLE deck (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  deck_name VARCHAR(255) NOT NULL,
  deck_description TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE card (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  deck_id INT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  FOREIGN KEY (deck_id) REFERENCES deck(id)
);

