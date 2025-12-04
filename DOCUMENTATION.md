# Lost and Found - Complete Documentation

## Project Overview

**Lost and Found** is a full-stack web application designed to help users report and recover lost or found items. The platform connects people who have found items with those searching for lost possessions, facilitating the return of valuable belongings to their rightful owners.

### Key Features

-   **User Authentication**: Secure registration and login system
-   **Item Posting**: Users can report lost or found items with detailed information
-   **Item Discovery**: Browse lost and found items in a searchable database
-   **Item Claiming**: Mark items as claimed when recovered
-   **Contact Information**: WhatsApp integration and email contact for item owners
-   **Item Images**: Upload and display images of items for better identification

---

## Project Structure

```
LostAndFound/
├── controllers/          # Business logic controllers
│   ├── auth.js          # Authentication logic
│   └── lost.js          # Item management logic
├── routes/              # API endpoint routes
│   ├── auth.js          # Authentication routes
│   └── item.js          # Item routes
├── models/              # Database schemas
│   ├── User.js          # User model
│   └── Item.js          # Item model
├── middleware/
│   └── auth-middeware.js # Authentication middleware
├── db/
│   └── db.js            # Database connection
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md            # Quick start guide
```

---

## Technology Stack

| Technology                | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| **Express.js**            | Web framework for Node.js                |
| **MongoDB**               | NoSQL database for data storage          |
| **Mongoose**              | MongoDB object modeling                  |
| **JWT (JSON Web Tokens)** | User authentication and authorization    |
| **bcryptjs**              | Password hashing and security            |
| **CORS**                  | Cross-origin resource sharing            |
| **Cookie-parser**         | Cookie handling                          |
| **Body-parser**           | Request body parsing                     |
| **dotenv**                | Environment variable management          |
| **Nodemon**               | Development auto-reload (dev dependency) |

---

## API Endpoints Documentation

### Authentication Endpoints

#### 1. **Register User**

-   **Endpoint**: `POST /auth/register`
-   **Description**: Create a new user account
-   **Request Body**:
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securePassword123"
    }
    ```
-   **Response** (Success - 201):
    ```json
    {
        "message": "User created",
        "userId": "user_id_here",
        "token": "jwt_token_here"
    }
    ```
-   **Response** (Error - 409 if email exists):
    ```json
    {
        "message": "Email already registered"
    }
    ```

#### 2. **Login User**

-   **Endpoint**: `POST /auth/login`
-   **Description**: Authenticate user and receive JWT token
-   **Request Body**:
    ```json
    {
        "email": "john@example.com",
        "password": "securePassword123"
    }
    ```
-   **Response** (Success - 200):
    ```json
    {
        "message": "Logged in",
        "userId": "user_id_here",
        "token": "jwt_token_here"
    }
    ```
-   **Response** (Error - 401):
    ```json
    {
        "message": "Invalid credentials"
    }
    ```

#### 3. **Check Authentication Status**

-   **Endpoint**: `GET /auth/status`
-   **Description**: Verify if user is authenticated (requires valid token)
-   **Headers**: Cookie with JWT token
-   **Response** (Success - 200):
    ```json
    {
        "message": "User is authenticated",
        "userId": "user_id_here"
    }
    ```

#### 4. **Logout User**

-   **Endpoint**: `GET /auth/logout`
-   **Description**: Clear user session and logout
-   **Response** (Success - 200):
    ```json
    {
        "message": "Logged out successfully"
    }
    ```

### Item Endpoints

#### 1. **Get All Lost Items**

-   **Endpoint**: `GET /item/lost`
-   **Description**: Retrieve all items reported as lost
-   **Response** (Success - 200):
    ```json
    [
        {
            "_id": "item_id",
            "type": "lost",
            "itemName": "Wallet",
            "description": "Brown leather wallet",
            "location": "Central Park",
            "date": "2025-12-01T10:00:00Z",
            "imageUrl": "url_to_image",
            "whatsAppNumber": "+1234567890",
            "email": "owner@example.com",
            "claimed": false,
            "createdAt": "2025-12-01T10:00:00Z"
        }
    ]
    ```

#### 2. **Get All Found Items**

-   **Endpoint**: `GET /item/found`
-   **Description**: Retrieve all items reported as found
-   **Response**: Same structure as lost items with `"type": "found"`

#### 3. **Get Single Item Details**

-   **Endpoint**: `GET /item/:id`
-   **Description**: Retrieve detailed information about a specific item
-   **URL Parameters**: `id` - Item MongoDB ID
-   **Response** (Success - 200): Single item object

#### 4. **Add New Item (Lost/Found)**

-   **Endpoint**: `POST /item/add`
-   **Description**: Post a new lost or found item
-   **Authentication**: Required (JWT token)
-   **Request Body**:
    ```json
    {
        "type": "lost",
        "itemName": "Keys",
        "description": "Silver house keys with blue keychain",
        "location": "Bus Station",
        "date": "2025-12-02T14:30:00Z",
        "imageUrl": "url_to_image",
        "whatsAppNumber": "+1234567890",
        "email": "user@example.com"
    }
    ```
-   **Response** (Success - 201):
    ```json
    {
      "message": "Item created successfully",
      "item": { ...item_data }
    }
    ```

#### 5. **Delete Item**

-   **Endpoint**: `DELETE /item/:id`
-   **Description**: Delete an item posting
-   **Authentication**: Required (JWT token)
-   **URL Parameters**: `id` - Item MongoDB ID
-   **Response** (Success - 200):
    ```json
    {
        "message": "Item deleted successfully"
    }
    ```

#### 6. **Mark Item as Claimed**

-   **Endpoint**: `PUT /item/:id/claimed`
-   **Description**: Mark an item as claimed/found
-   **Authentication**: Required (JWT token)
-   **URL Parameters**: `id` - Item MongoDB ID
-   **Request Body**:
    ```json
    {
        "claimedBy": "user_id_who_claimed_it"
    }
    ```
-   **Response** (Success - 200):
    ```json
    {
      "message": "Item marked as claimed",
      "item": { ...updated_item_data }
    }
    ```

---

## Database Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, hashed),
  createdAt: Date (default: current date)
}
```

### Item Model

```javascript
{
  _id: ObjectId,
  type: String (enum: ['found', 'lost'], required),
  itemName: String (required),
  description: String,
  location: String,
  date: Date,
  imageUrl: String,
  whatsAppNumber: String,
  userId: ObjectId (ref: 'User'),
  email: String,
  claimed: Boolean (default: false),
  claimedBy: ObjectId (ref: 'User', default: null),
  createdAt: Date (default: current date)
}
```

---

## Security Features

### Password Security

-   Passwords are hashed using **bcryptjs** with a salt factor of 10
-   Passwords are never stored in plain text
-   Password comparison uses secure bcrypt comparison

### Authentication & Authorization

-   **JWT (JSON Web Tokens)** for stateless authentication
-   Tokens expire after 7 days
-   Tokens stored securely in HTTP-only cookies
-   `isAuthenticated` middleware protects sensitive endpoints
-   CORS configured to allow only trusted origins

### Secure Cookie Configuration

-   `httpOnly: true` - Prevents JavaScript access to cookies
-   `secure: true` - Cookies sent only over HTTPS
-   `sameSite: 'none'` - Allows cross-site requests (configured for security)

---

## Installation & Setup

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB instance running locally or Atlas
-   npm or yarn package manager

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/murtazajoo/LostAndFound.git
    cd LostAndFound
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    - Create a `.env` file in the root directory
    - Add the following variables:

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/lostandfound
    JWT_SECRET=your_secret_key_here
    ```

4. **Start the server**

    - Development (with auto-reload):
        ```bash
        npm run dev
        ```
    - Production:
        ```bash
        npm start
        ```

5. **Access the API**
    - Server runs on `http://localhost:5000`
    - Frontend deployed at: `https://lost-and-found-asc.vercel.app`

---

## Environment Variables

| Variable     | Description                | Example                                          |
| ------------ | -------------------------- | ------------------------------------------------ |
| `PORT`       | Server port                | `5000`                                           |
| `MONGO_URI`  | MongoDB connection string  | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key`                                |

---

## CORS Configuration

The application is configured to accept requests from:

-   `http://localhost:3001` (local development)
-   `https://lost-and-found-asc.vercel.app` (production frontend)

Credentials are enabled for cross-origin requests.

---

## Middleware

### Authentication Middleware (`auth-middeware.js`)

-   Verifies JWT token from cookies
-   Extracts user ID from token
-   Protects routes requiring authentication
-   Returns 401 Unauthorized if token is invalid/missing

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning                                     |
| ------ | ------------------------------------------- |
| `200`  | OK - Request successful                     |
| `201`  | Created - Resource created successfully     |
| `400`  | Bad Request - Missing or invalid fields     |
| `401`  | Unauthorized - Invalid credentials or token |
| `409`  | Conflict - Email already registered         |
| `500`  | Server Error - Internal server error        |

---

## Use Cases

### For Users Who Lost Items

1. Register/Login to the platform
2. Post details about the lost item (name, description, location, date, contact info)
3. Include a photo for better identification
4. Monitor the lost items list for matches
5. Mark item as claimed when found

### For Users Who Found Items

1. Register/Login to the platform
2. Post details about the found item
3. Upload a clear photo
4. Provide contact information (WhatsApp/Email)
5. Wait for the owner to claim the item

---

## Future Enhancements

-   [ ] Email notifications when items match lost/found criteria
-   [ ] User ratings and reviews
-   [ ] Advanced search filters (date range, item category)
-   [ ] Real-time notifications
-   [ ] Admin dashboard for moderation
-   [ ] Social media sharing integration
-   [ ] Map-based location display
-   [ ] AI-based image recognition for item matching
-   [ ] Mobile app development

---

## Troubleshooting

### MongoDB Connection Issues

-   Ensure MongoDB is running
-   Verify `MONGO_URI` in `.env` file
-   Check database credentials

### JWT Token Errors

-   Clear browser cookies and re-login
-   Ensure `JWT_SECRET` is set in `.env`
-   Check token expiration (7 days)

### CORS Errors

-   Verify frontend URL is in CORS whitelist
-   Check if credentials flag is enabled on frontend

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

ISC License - See `package.json` for details

---

## Contact & Support

For issues, questions, or suggestions, please contact:

-   **Author**: Murtaza Joo
-   **Repository**: https://github.com/murtazajoo/LostAndFound
-   **Email**: Available in repository contact

---

**Last Updated**: December 4, 2025
