# Heckto CRM Backend

## Overview

A comprehensive CRM backend system built with Express.js, MongoDB, and Socket.io. This system provides complete functionality for managing users, projects, tasks, invoices, chat, and analytics with role-based access control.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens
- **Role-based Access Control**: Admin, Employee, and Client roles
- **User Management**: Create, read, update, and delete users
- **Project Management**: Complete project lifecycle management
- **Task System**: Task assignment, tracking, and progress monitoring
- **Invoice System**: Invoice generation with QR code support
- **Real-time Chat**: Socket.io powered messaging system
- **Notifications**: In-app notification system
- **Analytics & Reports**: Comprehensive reporting and analytics
- **File Uploads**: Support for document and image uploads
- **Export Functionality**: CSV export for reports

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads
- **QRCode** - QR code generation
- **Nodemailer** - Email sending
- **Joi** - Input validation

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file with the following configuration:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string_here

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Your App <your_email@gmail.com>

MANAGER_EMAIL=manager_email@gmail.com
FRONTEND_URL=http://localhost:3000

MANAGER_SEED_NAME=Manager Name
MANAGER_SEED_EMAIL=manager@example.com
MANAGER_SEED_PASSWORD=password123
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on port 5000 by default.

## Project Structure

```
backend/
|-- src/
|   |-- controllers/          # API controllers
|   |-- models/              # Database models
|   |-- routes/              # API routes
|   |-- middlewares/         # Custom middlewares
|   |-- sockets/             # Socket.io handlers
|   |-- config/              # Database configuration
|   |-- utils/               # Utility scripts
|   |-- app.js               # Express app setup
|-- uploads/                 # File upload directory
|-- .env                     # Environment variables
|-- .gitignore              # Git ignore file
|-- package.json            # Dependencies
|-- server.js               # Main server file
|-- README.md               # Documentation
```

## API Documentation

### Authentication APIs
#### POST /api/auth/signup
**Description**: Register a new user
**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "department": "Sales"
}
```
**Response**: 201 Created

#### POST /api/auth/login
**Description**: Login user and get tokens
**Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response**: 200 OK with access and refresh tokens

#### POST /api/auth/refresh
**Description**: Refresh access token
**Headers**: Authorization: Bearer refresh_token
**Response**: 200 OK

#### GET /api/auth/profile
**Description**: Get current user profile
**Headers**: Authorization: Bearer access_token
**Response**: 200 OK

### Admin APIs (Protected)
#### GET /api/users
**Description**: Get all users
**Headers**: Authorization: Bearer admin_token
**Response**: 200 OK with users list

#### POST /api/users/create
**Description**: Create a new user
**Headers**: Authorization: Bearer admin_token
**Body**: User details with role assignment
**Response**: 201 Created

#### GET /api/projects
**Description**: Get all projects
**Headers**: Authorization: Bearer admin_token
**Response**: 200 OK with projects list

#### POST /api/projects
**Description**: Create a new project
**Headers**: Authorization: Bearer admin_token
**Body**: Project details with client and employees
**Response**: 201 Created

#### GET /api/tasks
**Description**: Get all tasks
**Headers**: Authorization: Bearer admin_token
**Response**: 200 OK with tasks list

#### POST /api/tasks
**Description**: Create a new task
**Headers**: Authorization: Bearer admin_token
**Body**: Task details with project and assignment
**Response**: 201 Created

#### GET /api/invoices
**Description**: Get all invoices
**Headers**: Authorization: Bearer admin_token
**Response**: 200 OK with invoices list

#### POST /api/invoices
**Description**: Create a new invoice
**Headers**: Authorization: Bearer admin_token
**Body**: Invoice details with items and QR code
**Response**: 201 Created

### Employee APIs (Protected)
#### GET /api/employee/projects
**Description**: Get projects assigned to employee
**Headers**: Authorization: Bearer employee_token
**Response**: 200 OK with assigned projects

#### GET /api/employee/tasks
**Description**: Get tasks assigned to employee
**Headers**: Authorization: Bearer employee_token
**Response**: 200 OK with assigned tasks

#### GET /api/employee/dashboard
**Description**: Get employee dashboard statistics
**Headers**: Authorization: Bearer employee_token
**Response**: 200 OK with dashboard data

### Client APIs (Protected)
#### GET /api/client/projects
**Description**: Get projects for client
**Headers**: Authorization: Bearer client_token
**Response**: 200 OK with client projects

#### GET /api/client/invoices
**Description**: Get invoices for client
**Headers**: Authorization: Bearer client_token
**Response**: 200 OK with client invoices

#### GET /api/client/dashboard
**Description**: Get client dashboard statistics
**Headers**: Authorization: Bearer client_token
**Response**: 200 OK with dashboard data

### Shared APIs
#### GET /api/notifications
**Description**: Get user notifications
**Headers**: Authorization: Bearer token
**Response**: 200 OK with notifications

#### POST /api/notifications
**Description**: Create a notification (Admin only)
**Headers**: Authorization: Bearer admin_token
**Body**: Notification details
**Response**: 201 Created

#### GET /api/messages/conversations
**Description**: Get user conversations
**Headers**: Authorization: Bearer token
**Response**: 200 OK with conversations

#### POST /api/messages/send
**Description**: Send a message
**Headers**: Authorization: Bearer token
**Body**: Message details
**Response**: 201 Created

#### GET /api/reports/analytics
**Description**: Get system analytics (Admin only)
**Headers**: Authorization: Bearer admin_token
**Response**: 200 OK with analytics data

## Role-Based Access Control

### Admin Role
- Full access to all APIs
- User management (CRUD)
- Project and task management
- Invoice creation and management
- System analytics and reports

### Employee Role
- View assigned projects and tasks
- Update task status
- Submit reports
- View dashboard statistics

### Client Role
- View own projects
- View own invoices
- View dashboard statistics
- Limited access to project details

## Socket.io Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events
- `join_room`: Join a chat room
- `send_message`: Send a message
- `typing_indicator`: Typing status
- `message_seen`: Mark message as seen
- `disconnect`: Leave room

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin|employee|client),
  phone: String,
  department: String,
  profileImage: String,
  isActive: Boolean
}
```

### Project Schema
```javascript
{
  title: String,
  description: String,
  client: ObjectId (User),
  employees: [ObjectId] (User),
  budget: Number,
  startDate: Date,
  deadline: Date,
  status: String,
  notes: String
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  priority: String,
  status: String,
  progress: Number,
  dueDate: Date,
  notes: String
}
```

### Invoice Schema
```javascript
{
  invoiceNumber: String (auto-generated),
  project: ObjectId (Project),
  client: ObjectId (User),
  amount: Number,
  tax: Number,
  total: Number,
  paymentMethod: String,
  status: String,
  dueDate: Date,
  items: [Object],
  qrCode: String,
  notes: String
}
```

## Utility Scripts

### Database Management
```bash
# Seed admin user
node src/utils/seedAdmin.js

# Debug users
node src/utils/debugUsers.js

# Update user role
node src/utils/updateUserRole.js
```

### Token Generation
```bash
# Get admin token
node src/utils/getAdminToken.js

# Get employee token
node src/utils/getEmployeeToken.js

# Get client token
node src/utils/getClientToken.js
```

## Testing

The system has been thoroughly tested with:
- All authentication endpoints
- Role-based access control
- CRUD operations for all entities
- Real-time messaging
- File uploads
- Error handling

## Security Features

- JWT authentication with access/refresh tokens
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS configuration
- Security headers (Helmet)
- File upload restrictions

## Deployment

### Environment Variables Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `EMAIL_HOST` - SMTP server
- `EMAIL_USER` - Email credentials
- `EMAIL_PASS` - Email password

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper email service
4. Configure domain CORS
5. Use process manager (PM2)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Your App Name <your_email@gmail.com>

MANAGER_EMAIL=manager@example.com

FRONTEND_URL=http://localhost:3000

MANAGER_SEED_NAME=Manager Name
MANAGER_SEED_EMAIL=manager@example.com
MANAGER_SEED_PASSWORD=manager_password
```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

### Production

Start the production server:
```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Signup (Client only)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "department": "Sales"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

### Admin APIs

#### Users
- `POST /api/users/create` - Create new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `PUT /api/tasks/:id` - Update task
- `GET /api/tasks/my-tasks` - Get current employee's tasks

#### Invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id/status` - Update invoice status

### Employee APIs

#### Projects
- `GET /api/employee/projects` - Get assigned projects

#### Tasks
- `GET /api/employee/tasks` - Get assigned tasks
- `POST /api/employee/reports/submit` - Submit work report

#### Dashboard
- `GET /api/employee/dashboard` - Get dashboard statistics

### Client APIs

#### Projects
- `GET /api/client/projects` - Get my projects

#### Invoices
- `GET /api/client/invoices` - Get my invoices

#### Dashboard
- `GET /api/client/dashboard` - Get dashboard statistics

### Chat System

#### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/:messageId/seen` - Mark as seen
- `DELETE /api/messages/:messageId` - Delete message

### Notifications

- `GET /api/notifications` - Get notifications
- `GET /api/notifications/count` - Get unread count
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Reports & Analytics

- `GET /api/reports/analytics` - Get dashboard analytics
- `GET /api/reports/projects` - Get project reports
- `GET /api/reports/tasks` - Get task reports
- `GET /api/reports/financial` - Get financial reports
- `GET /api/reports/export?type=projects` - Export reports

## Socket.io Events

### Client Events
- `send_message` - Send a message
- `mark_seen` - Mark message as seen
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server Events
- `receive_message` - Receive a message
- `message_seen` - Message marked as seen
- `user_typing` - User typing indicator
- `users_online` - List of online users
- `new_message_notification` - New message notification

## Database Models

### User
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['admin', 'employee', 'client'],
  phone: String,
  department: String,
  profileImage: String,
  isActive: Boolean
}
```

### Project
```javascript
{
  title: String,
  description: String,
  client: ObjectId,
  employees: [ObjectId],
  budget: Number,
  startDate: Date,
  deadline: Date,
  status: ['pending', 'in_progress', 'completed', 'cancelled'],
  progress: Number,
  attachments: Array,
  notes: String
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId,
  assignedTo: ObjectId,
  priority: ['low', 'medium', 'high', 'urgent'],
  dueDate: Date,
  status: ['pending', 'in_progress', 'completed', 'cancelled'],
  progress: Number,
  attachments: Array,
  notes: String
}
```

### Invoice
```javascript
{
  invoiceNumber: String,
  project: ObjectId,
  client: ObjectId,
  amount: Number,
  tax: Number,
  total: Number,
  paymentMethod: ['cash', 'bank_transfer', 'credit_card', 'paypal', 'other'],
  status: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
  qrCode: String,
  dueDate: Date,
  items: Array,
  notes: String
}
```

## Error Handling

All API responses follow a consistent format:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Input validation with Joi
- CORS configuration
- Helmet security headers
- File upload restrictions

## File Uploads

- Supported formats: Images (jpeg, jpg, png, gif), Documents (pdf, doc, docx, xls, xlsx, ppt, pptx, txt), Archives (zip, rar)
- Maximum file size: 10MB
- Upload location: `/uploads/images` and `/uploads/documents`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No |
| NODE_ENV | Environment | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_ACCESS_SECRET | JWT access token secret | Yes |
| JWT_REFRESH_SECRET | JWT refresh token secret | Yes |
| JWT_ACCESS_EXPIRY | Access token expiry | No |
| JWT_REFRESH_EXPIRY | Refresh token expiry | No |
| EMAIL_HOST | Email server host | Yes |
| EMAIL_PORT | Email server port | Yes |
| EMAIL_USER | Email username | Yes |
| EMAIL_PASS | Email password | Yes |
| EMAIL_FROM | From email address | Yes |
| FRONTEND_URL | Frontend URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.

---

**Author**: Innvoelous CRM Backend Team
**Version**: 1.0.0
**Last Updated**: 2026
