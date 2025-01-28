# File Uploader

This project is a simple file uploader application.
# File Uploader Application

This is a Node.js application for uploading, managing, and viewing files. It uses Express.js for the server, Multer for handling file uploads, and Cloudinary for file storage. The application also includes user authentication and session management.

## Features

- User authentication (sign-up, log-in, log-out)
- File upload and storage using Multer and Cloudinary
- View and manage uploaded files
- Session management with Express Session and Passport.js
- EJS templating for dynamic views

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Cloudinary account
- Prisma (for database management)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KLightiam/file-uploader.git
   cd file-uploader
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a 

.env

 file in the root directory and add your environment variables:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   ```

4. Run Prisma migrations to set up the database:

   ```bash
   npx prisma migrate dev
   ```

## Usage

1. Start the application:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
/file-uploader
├── public
│   ├── data
│   │   └── uploads
│   └── viewFile.css
├── routes
│   ├── indexRouter.js
│   ├── logoutRouter.js
│   ├── signUpRouter.js
│   └── userRouter.js
├── utils
│   └── expressSession.js
├── views
│   ├── index.ejs
│   └── view-file.ejs
├── .env
├── index.js
├── package.json
└── prisma
    ├── schema.prisma
    └── migrations
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Cloudinary](https://cloudinary.com/)
- [Prisma](https://www.prisma.io/)
- [Passport.js](http://www.passportjs.org/)
- [EJS](https://ejs.co/)

---