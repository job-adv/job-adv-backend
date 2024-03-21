/*CREATE TABLE `User` (
    `user_id` VARCHAR(36) PRIMARY KEY,
    `role` ENUM('admin', 'professional', 'customer') NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `firstname` VARCHAR(255),
    `lastname` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `category_id` INT,
    `cv` TEXT,
    `adress` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `verifier` BOOLEAN DEFAULT false,
    `phone_number` VARCHAR(20),
    `profile_picture` VARCHAR(255),
    `facebook_link` VARCHAR(255),
    `instagram_link` VARCHAR(255),
    `tiktok_link` VARCHAR(255)
);*/


/*CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255),
    category_picture VARCHAR(255)
);

CREATE TABLE SubCategory (
    subCategory_id INT AUTO_INCREMENT PRIMARY KEY,
    subCategory_name VARCHAR(255),
    subCategory_picture VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

CREATE TABLE UsageConditions (
    documentID INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT
);

CREATE TABLE User (
    user_id VARCHAR(36) PRIMARY KEY,
    role ENUM('admin', 'professional', 'customer') NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    category_id INT,
    cv TEXT,
    address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verifier BOOLEAN DEFAULT false,
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255),
    facebook_link VARCHAR(255),
    instagram_link VARCHAR(255),
    tiktok_link VARCHAR(255)
);

CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    subcategory_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES SubCategory(subCategory_id) ON DELETE CASCADE
);

CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    service_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);

CREATE TABLE Favorite (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id VARCHAR(36),
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    reported_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE Message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    created_id VARCHAR(36),
    p_id VARCHAR(36),
    c_id VARCHAR(36),
    FOREIGN KEY (created_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    receive_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receive_user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status ENUM('pending', 'confirmed', 'processing', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE,
    time TIME,
    service_id INT,
    p_id VARCHAR(36),
    c_id VARCHAR(36),
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Suggestion (
    suggestionID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    date DATE,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    CONSTRAINT FK_User_Suggestion FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Picture (
    picture_id INT AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255),
    service_id INT,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);

CREATE TABLE Price (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(10, 2),
    description TEXT,
    rate VARCHAR(20),
    service_id INT,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);*/


CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255),
    category_picture VARCHAR(255),
    category_icon VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS SubCategory (
    subCategory_id INT AUTO_INCREMENT PRIMARY KEY,
    subCategory_name VARCHAR(255),
    subCategory_picture VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UsageConditions (
    documentID INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT
);

CREATE TABLE IF NOT EXISTS User (
    user_id VARCHAR(36) PRIMARY KEY,
    role ENUM('admin', 'professional', 'customer') NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    category_id INT,
    cv TEXT,
    adress VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verifier BOOLEAN DEFAULT false,
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255),
    facebook_link VARCHAR(255),
    instagram_link VARCHAR(255),
    tiktok_link VARCHAR(255),
    disponible BOOLEAN DEFAULT true 
);

CREATE TABLE IF NOT EXISTS Conversation (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id VARCHAR(36),
    user2_id VARCHAR(36),
    seen BOOLEAN DEFAULT false,
    FOREIGN KEY (user1_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    subcategory_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES SubCategory(subCategory_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    service_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorite (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id VARCHAR(36),
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    reported_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seen BOOLEAN DEFAULT false,
    sender_id VARCHAR(36),
    receiver_id VARCHAR(36),
    conversation_id INT,
    FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES Conversation(conversation_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    receive_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receive_user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status ENUM('pending', 'confirmed', 'processing', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE,
    time TIME,
    service_id INT,
    p_id VARCHAR(36),
    c_id VARCHAR(36),
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Suggestion (
    suggestionID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    date DATE,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Picture (
    picture_id INT AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255),
    service_id INT,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Price (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(10, 2),
    description TEXT,
    rate VARCHAR(20),
    service_id INT,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);



