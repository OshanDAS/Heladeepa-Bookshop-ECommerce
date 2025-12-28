# Heladeepa Bookshop E-Commerce

A full-stack e-commerce platform for a bookshop with comprehensive inventory management, user authentication, payment processing, and administrative features.

## 🚀 Features

### Customer Features
- **User Authentication**: Registration, login, email verification, password reset
- **Product Catalog**: Browse books with filtering by category, author, publisher, price range
- **Search Functionality**: Advanced search with barcode scanning support
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite books, get notifications when back in stock
- **Pre-Orders**: Place orders for upcoming book releases
- **Order Management**: View order history and track status
- **Payment Integration**: PayHere payment gateway integration
- **User Profile**: Manage personal information and preferences

### Admin Features
- **Dashboard**: Analytics and overview of sales, orders, and inventory
- **Product Management**: Add, edit, delete products with image upload
- **Bulk Import**: CSV/Excel file upload for batch product creation
- **Inventory Management**: Stock tracking with low-stock alerts
- **Order Management**: Process orders, update status, view details
- **User Management**: Manage customer accounts and permissions
- **Manual Sales**: Record in-store transactions
- **Promotions**: Create and manage promotional campaigns
- **OCR Integration**: Extract text from images using Tesseract

### Advanced Features
- **Stock Notifications**: Email alerts for low stock and restocking
- **Barcode Management**: Automatic barcode generation and scanning
- **Email Service**: Automated notifications and marketing emails
- **File Upload**: Cloudinary integration for image management
- **Data Validation**: Comprehensive validation for file imports
- **Security**: JWT authentication with role-based access control

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Email**: Spring Mail
- **File Processing**: Apache POI (Excel), Tesseract OCR
- **Cloud Storage**: Cloudinary
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Material-UI, Ant Design
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **UI Components**: Framer Motion, Lucide React
- **File Handling**: React Dropzone, PapaParse


## 📁 Project Structure

```
Heladeepa-Bookshop-ECommerce/
├── Backend/
│   └── demo/
│       ├── src/main/java/com/example/demo/
│       │   ├── config/          # Security, CORS, Database config
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── entity/         # JPA Entities
│       │   ├── filter/         # JWT Authentication filter
│       │   ├── repository/     # Data access layer
│       │   ├── service/        # Business logic
│       │   └── util/           # Utility classes
│       ├── src/main/resources/
│       │   ├── tessdata/       # OCR language data
│       │   └── application.properties
│       ├── Dockerfile
│       ├── pom.xml
│       └── Procfile
└── frontend/
    ├── src/
    │   ├── api/               # API service functions
    │   ├── components/        # Reusable UI components
    │   ├── hooks/            # Custom React hooks
    │   ├── pages/            # Page components
    │   └── routes/           # Route configuration
    ├── package.json
    └── vite.config.js
```

## 🚦 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Heladeepa-Bookshop-ECommerce/Backend/demo
   ```

2. **Configure Database**
   ```sql
   CREATE DATABASE heladeepaBP;
   CREATE USER 'heladeepaBP'@'localhost' IDENTIFIED BY 'HBP123';
   GRANT ALL PRIVILEGES ON heladeepaBP.* TO 'heladeepaBP'@'localhost';
   ```

3. **Update application.properties**
   ```properties
   spring.datasource.username=${DB_USERNAME:heladeepaBP}
   spring.datasource.password=${DB_PASSWORD:HBP123}
   spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/heladeepaBP}
   ```

4. **Configure External Services**
   - Set up Cloudinary account for image storage
   - Configure email SMTP settings
   - Set up PayHere merchant account
   - Update credentials in your .env file

5. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables
The application uses environment variables for secure configuration management.

1. **Copy the environment template**
   ```bash
   cd Backend/demo
   cp .env.example .env
   ```

2. **Update the .env file with your credentials**
   ```env
   # Database Configuration
   DB_USERNAME=heladeepaBP
   DB_PASSWORD=HBP123
   DB_URL=jdbc:mysql://localhost:3306/heladeepaBP
   
   # JWT Configuration
   JWT_SECRET=your-jwt-secret-key
   JWT_ACCESS_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   
   # Email Configuration
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # PayHere Configuration
   PAYHERE_MERCHANT_ID=your-merchant-id
   PAYHERE_MERCHANT_SECRET=your-merchant-secret
   ```

### External Services Setup
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for image storage
- **Gmail SMTP**: Enable 2FA and generate an app password for email service
- **PayHere**: Create a merchant account at [payhere.lk](https://payhere.lk) for payment processing

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)
- `GET /api/products/search` - Search products
- `POST /api/products/import` - Bulk import (Admin)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status (Admin)

### Cart & Wishlist
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove from cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Password encryption with BCrypt
- CORS configuration
- Input validation and sanitization
- SQL injection prevention

## 📊 Database Schema

### Key Entities
- **User**: Customer and admin accounts
- **Product**: Book inventory with categories
- **Category**: Product categorization
- **Order**: Purchase transactions
- **OrderProduct**: Order line items
- **Cart**: Shopping cart items
- **Wishlist**: User's favorite products
- **PreOrder**: Future release orders
- **Promotion**: Marketing campaigns

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Copy `.env.example` to `.env` and configure your environment
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

---

**Heladeepa Bookshop** - Bringing books to your doorstep with modern technology! 📚✨