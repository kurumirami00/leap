# LEAP — LMS Backend + Frontend Integration Guide

## What Changed

The project was migrated from **PostgreSQL** (generic `users` table) to **MySQL** with the full **LEAP schema**.

### Key changes
| Area | Before | After |
|---|---|---|
| Database | PostgreSQL (`pg`) | MySQL (`mysql2`) |
| Auth table | `users` (single table) | `User` + `User_Auth` (password separated) |
| Login field | `username` | `email` |
| Roles | `role` column on `users` | Separate `Student` / `Instructor` profile tables |
| API routes | `/api/auth`, `/api/user` | + `/api/courses`, `/api/enrollments`, `/api/grades`, `/api/badges` |

---

## 1. Database Setup

1. Open MySQL Workbench (or any MySQL client).
2. Run **`LEAP_database_setup.sql`** — it creates the `LEAP` database and all tables including the new `User_Auth` table.

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Edit **`.env`** with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=LEAP
JWT_SECRET=change_this_to_a_long_random_string
JWT_ACCESS_EXPIRATION_TIME=12h
PORT=5001
```

Start the server:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

---

## 3. Frontend Setup

```bash
cd Frontend
npm install
```

Edit **`.env`**:
```env
VITE_API_URL=http://localhost:5001
```

Start dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
# dist/ folder is served automatically by the Express backend
```

---

## API Reference

### Auth
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{email, password, first_name, last_name, role, ...}` | Register student or instructor |
| POST | `/api/auth/login` | `{email, password}` | Login, returns JWT + user info |

### Register body fields
**Common (required):** `email`, `password`, `first_name`, `last_name`, `role` (`student`\|`instructor`)

**Student extras (optional):** `middle_name`, `gender`, `address`, `year_level`, `dept_id`

**Instructor extras (optional):** `middle_name`, `gender`, `address`, `specialization`, `contact_no`, `hire_date`, `age`, `birth_date`

### Users (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | All users with role info |
| GET | `/api/users/:id` | Single user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Courses (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | All courses |
| GET | `/api/courses/:id` | Course + lessons |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Enrollments (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/enrollments` | `{student_id, course_id}` Enroll |
| GET | `/api/enrollments/student/:student_id` | Student's courses |
| GET | `/api/enrollments/course/:course_id` | Course's students |
| DELETE | `/api/enrollments/:id` | Unenroll |

### Grades (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/grades/student/:student_id` | Student grades |
| POST | `/api/grades` | `{student_id, course_id, grade_value}` Award/update grade |

### Badges (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/badges` | All badges |
| GET | `/api/badges/student/:student_id` | Student's badges |
| POST | `/api/badges/award` | `{student_id, badge_id}` Award badge |

---

## Database Schema Note

The original LEAP SQL schema has no `password` column on the `User` table.
This integration adds a `User_Auth` table (one-to-one with `User`) to store `password_hash` — keeping the User table clean and matching the LEAP design.
