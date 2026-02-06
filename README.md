# University Student Life-Cycle Management System

A comprehensive full-stack web application for managing the complete student life cycle from application to graduation.

## 🎯 Features

### Core Modules
- **Application Management**: Online application submission with document upload
- **Merit-Based Admission**: Automated merit list generation based on percentage
- **Enrollment System**: Auto-generated enrollment and roll numbers
- **Academic Management**: Course registration, attendance tracking, exam management
- **Fee Management**: Fee tracking with demo payment integration
- **Hostel Management**: Automated hostel allocation for selected students
- **Document Vault**: Digital storage for certificates and documents
- **Role-Based Access**: Separate dashboards for Applicant, Student, Faculty, and Admin

### User Roles
1. **Applicant**: Submit applications, track application status
2. **Student**: View enrollment details, attendance, marks, fees, hostel info
3. **Faculty**: Manage assigned subjects, mark attendance, upload marks
4. **Admin**: Comprehensive system management and analytics

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS (Custom "Old Money Tech" design system)
- Shadcn/UI Components
- Framer Motion (animations)
- Axios (API calls)
- Sonner (toast notifications)

### Backend
- Node.js + Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- Bcrypt (password hashing)
- Cloudinary (file uploads)
- Multer (file handling)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd university-management
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
yarn install
```

4. **Environment Configuration**

Backend (.env):
```
PORT=8001
MONGO_URL=mongodb://localhost:27017/
DB_NAME=university_db
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

Frontend (.env):
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

5. **Seed Initial Data**
```bash
cd backend
node seed.js
```

This creates:
- Admin user: `admin@uniportal.edu` / `admin123`
- 4 Departments (CS, EC, ME, MBA)
- 5 Sample Courses (3 UG + 2 PG)
- 2 Hostels (Boys & Girls)

6. **Start the Application**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
yarn start
```

Application will be available at: `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/my-applications` - Get user applications
- `GET /api/applications` - Get all applications (Admin)

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course (Admin)
- `GET /api/courses/departments/all` - List departments

### Merit & Enrollment
- `POST /api/merit/generate` - Generate merit list (Admin)
- `GET /api/enrollments/my-enrollment` - Get enrollment details

### Attendance
- `POST /api/attendance/mark` - Mark attendance (Faculty)
- `GET /api/attendance/my-attendance` - Student attendance

### Exams & Results
- `POST /api/exams` - Create exam (Admin)
- `POST /api/exams/results` - Upload marks (Faculty)
- `GET /api/exams/my-results` - Student results

### Fees
- `GET /api/fees/my-fees` - Student fee details
- `POST /api/fees/:id/pay` - Pay fee (Demo)

### Hostels
- `GET /api/hostels` - List hostels
- `GET /api/hostels/my-allocation` - Student hostel info
- `POST /api/hostels/allocate` - Allocate hostel (Admin)

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/my-documents` - Get user documents

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/course-stats` - Course-wise enrollment stats

## 🎨 Design System

The application uses a custom "Old Money Tech" design aesthetic:

### Colors
- Primary: Deep Royal Blue (#1e3a8a)
- Secondary: Academic Gold (#d97706)
- Background: Bone White (#f8fafc)

### Typography
- Headings: Playfair Display (serif)
- Body: Manrope (sans-serif)
- Code: JetBrains Mono (monospace)

## 📱 Key User Journeys

### Application to Enrollment Flow
1. User registers as Applicant
2. Fills application form with academic details
3. Admin generates merit list for course
4. System auto-selects candidates based on percentage
5. Selected candidates become Students
6. Auto-generates Enrollment Number and Roll Number
7. Auto-allocates hostel (if requested)
8. Sends notifications to applicants

### Admin Course Management
1. Create departments
2. Create courses with seat limits
3. Set eligibility percentage
4. Review applications
5. Generate merit lists
6. Monitor seat allocation

### Student Academic Flow
1. View enrollment details
2. Track attendance
3. View exam results
4. Check fee status
5. Access document vault

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation on all forms
- Protected API routes
- CORS configuration

## 📊 Database Schema

### Collections
- **users**: Authentication and basic user info
- **student_profiles**: Detailed student information
- **applications**: Application submissions
- **courses**: Course master data
- **departments**: Department information
- **subjects**: Subject details per course
- **enrollments**: Student enrollment records
- **attendance**: Attendance tracking
- **exams**: Exam schedules
- **results**: Exam marks and grades
- **fees**: Fee records and payments
- **hostels**: Hostel information
- **hostel_allocations**: Student hostel assignments
- **faculty**: Faculty profiles
- **documents**: Document storage references
- **notifications**: User notifications

## 🧪 Testing

The application has been tested for:
- User registration and login
- Application submission
- Merit list generation
- Role-based dashboards
- API endpoints functionality

## 🎯 Future Enhancements

- PDF generation for certificates and receipts
- Email notifications
- SMS integration
- Advanced analytics dashboard
- Mobile application
- Payment gateway integration
- Biometric attendance
- Online exam system
- Library management
- Alumni portal

## 📝 License

This project is created for educational/demonstration purposes.

## 👥 Support

For any queries or support:
- Email: admin@uniportal.edu
- Create an issue in the repository

---

**Note**: This is a hackathon prototype demonstrating a complete university management workflow. It's production-ready in terms of architecture but may need additional security hardening and testing for actual deployment.
