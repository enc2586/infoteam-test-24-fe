# Infoteam Midterm Test - Board Web Application Frontend

This repository contains the frontend code for Infoteam's midterm test project: a Board Web Application. The frontend interacts with the backend to allow users to create, read, update, and delete posts and tags.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

### Installation

This Project uses **NPM**. Follow the steps below to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/enc2586/infoteam-test-24-fe.git
   cd infoteam-test-24-fe
   ```

2. **Install the dependencies:**

   ```bash
   npm i
   ```

3. **Set up the environment variables:**

   ~Create a `.env` file in the root directory of the project and add the following environment variables:~

   ```env
   VITE_API_URL=https://api.2024.newbies.gistory.me/
   ```

   **ADDED Sep. 02:** Due to backend CORS issue, you should set .env like this:

   ```env
   VITE_API_URL=/api
   ```

   then set vite.config.ts like this (already configured in the repo):

   ```ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react-swc";
   
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         "/api": {
           target: "https://api.2024.newbies.gistory.me",
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, ""),
         },
       },
     },
   });

   ```
   

5. **Start the development server:**

   ```bash
   npm run dev
   ```

The application should now be running on [http://localhost:5173](http://localhost:5173).

## Backend

The backend is served on [GIST Infoteam server](https://api.2024.newbies.gistory.me).

For API docs, please refer to the [OpenAPI Documentation](https://api.2024.newbies.gistory.me/swagger-ui/index.html#/).

# Technologies Used

- **Page lazy loading**: Implemented lazy loading to each routes to improve performance.
- **Korean Deep Search (only client side)**: When searching for tags, etc. (client-side), applied es-toolkit for Korean deep search (ex. query=붉 => '불금' 검색 가능)
