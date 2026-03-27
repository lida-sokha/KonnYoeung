# KonnYoeung

**Smart Parenting Starts with KonnYoeung**

Your trusted digital partner for children's health in Cambodia. Check your child's symptoms, learn about common diseases, and find nearby hospitals—all in one safe and easy-to-use platform.

## 🌟 Features

- **Symptom Checker**: AI-powered disease prediction based on symptoms using machine learning
- **Disease Information**: Comprehensive articles about 30+ childhood illnesses
- **Hospital Finder**: Locate nearby hospitals with interactive maps and detailed information
- **User Dashboard**: Personalized health tracking and history
- **Admin Panel**: Complete content management system for administrators
- **Secure Authentication**: JWT-based user authentication with Google OAuth support
- **Responsive Design**: Mobile-first design optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Cloudinary** - Cloud image storage and management
- **Swagger** - API documentation
- **Nodemailer** - Email services

### Machine Learning
- **Python** - ML model implementation
- **Scikit-learn** - Machine learning library
- **Logistic Regression** - Disease prediction model
- **Pandas** - Data manipulation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
KonnYoeung/
├── client/                 # React frontend application
│   ├── public/
│   │   └── images/         # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── ui/         # Basic UI elements
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin panel pages
│   │   │   ├── Article/    # Article-related pages
│   │   │   ├── Auth/       # Authentication pages
│   │   │   ├── Hospitals/  # Hospital pages
│   │   │   └── Symptoms/   # Symptom checker pages
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── contexts/       # React contexts
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── ml/                 # Machine learning components
│   │   ├── predict_bridge.py    # Python prediction script
│   │   ├── save_logistic_model.py # ML model training
│   │   └── final_dataset.csv    # Training dataset
│   ├── saved_models/       # Trained ML models
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for ML development)
- MongoDB Atlas account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KonnYoeung
   ```

2. **Environment Setup**

   Create `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   PORT=5000
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Local Development

1. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **ML Model Training** (if needed)
   ```bash
   cd server/ml
   python save_logistic_model.py
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/signup` - User registration
- `POST /api/users/verify-otp` - OTP verification
- `POST /api/users/forgot-password` - Password reset request

### Symptoms
- `POST /api/symptoms/predict` - Predict diseases from symptoms

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create new article (Admin)
- `PUT /api/articles/:id` - Update article (Admin)
- `DELETE /api/articles/:id` - Delete article (Admin)

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/:id` - Get hospital by ID
- `POST /api/hospitals` - Add new hospital (Admin)
- `PUT /api/hospitals/:id` - Update hospital (Admin)
- `DELETE /api/hospitals/:id` - Delete hospital (Admin)

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🤖 Machine Learning Model

The symptom checker uses a logistic regression model trained on medical data to predict potential diseases based on user-inputted symptoms.

### Model Features
- Multi-class classification
- Top-k predictions with confidence scores
- Trained on curated medical dataset
- Python bridge for seamless integration with Node.js backend

### Usage
```javascript
// Example API call
const response = await axios.post('/api/symptoms/predict', {
  symptoms: ['fever', 'cough', 'fatigue'],
  k: 3
});

// Response
{
  "predictions": [
    {"disease": "Common Cold", "confidence": 0.85},
    {"disease": "Flu", "confidence": 0.72},
    {"disease": "COVID-19", "confidence": 0.45}
  ]
}
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens stored in HTTP-only cookies
- **Google OAuth**: Social login integration
- **Role-based Access**: User and Admin roles with different permissions

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed
  role: String, // 'user' | 'admin'
  avatar: String, // Cloudinary URL
  verified: Boolean,
  otp: String,
  otpExpires: Date
}
```

### Article Model
```javascript
{
  title: String,
  content: String,
  author: ObjectId, // Reference to User
  image: String, // Cloudinary URL
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Hospital Model
```javascript
{
  name: String,
  address: String,
  phone: String,
  latitude: Number,
  longitude: Number,
  services: [String],
  image: String, // Cloudinary URL
  createdAt: Date
}
```

## 🧪 Testing

```bash
# Frontend tests
cd client
npm run lint

# Backend development
cd server
npm run dev
```

## 🚀 Deployment

### Production Build

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Environment Variables**
   - Set production MongoDB URI
   - Configure production Cloudinary credentials
   - Set secure JWT secrets

3. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact

For questions or support, please contact the development team.

---

**Made with ❤️ for Cambodian families**
