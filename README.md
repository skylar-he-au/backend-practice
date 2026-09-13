# backend-practice

A collection of exercises I wrote while learning Node.js and Express. This is a practice repository, **not a finished product** — expect rough edges and unfinished pieces.

## My real projects

- **[careermate-api](https://github.com/skylar-he-au/careermate-api)** — Express/MongoDB API with JWT authentication, presigned S3 uploads and a custom exception hierarchy, deployed on AWS Elastic Beanstalk.
- **[careermate-web](https://github.com/skylar-he-au/careermate-web)** — the React frontend for careermate-api.

## movie-api

A REST API for movies and their reviews. The main thing I was practising here is layering:

```
routes  →  controllers  →  Mongoose models
              ↑
   middleware (cross-cutting concerns)
```

- **Routes** (`src/routes`) only map HTTP verbs and paths to controller functions.
- **Controllers** (`src/controllers`) handle request parsing and responses.
- **Models** (`src/models`) own the schema, validation and derived fields (e.g. `averageRating`).
- **Middleware** (`src/middleware`) holds cross-cutting concerns such as request logging and rate limiting, so they stay out of the business logic.

### Tech stack

- Express 5
- Mongoose (MongoDB)
- helmet for security headers
- express-rate-limit (enabled in production only)
- Winston logger, created per module so every log line carries its source file
- Morgan request logging, piped into the Winston logger
- Swagger UI served at `/api-docs`
- Keyword search (`?keyword=`, matched against title and description) and pagination (`?page=&limit=`)
- Sorting by average rating (`?sort=rating` for highest first, `?sort=-rating` for lowest first)

### Endpoints

All routes are mounted under `/v1/movies`.

| Method | Path            | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/`             | List movies               |
| POST   | `/`             | Create a movie            |
| GET    | `/:id`          | Get a movie               |
| PUT    | `/:id`          | Update a movie            |
| DELETE | `/:id`          | Delete a movie            |
| GET    | `/:id/reviews`  | List reviews for a movie  |
| POST   | `/:id/reviews`  | Add a review to a movie   |

### Running locally

```bash
cd movie-api
npm install
cp .env.example .env-development
npm run dev
```

The config loads `.env-<NODE_ENV>` (so `.env-development` for `npm run dev`) and requires `DB_CONNECTION_STRING` and `JWT_KEY` to be set.

### Known incomplete

- `src/middleware/error/error-middleware.js` is empty and not mounted, so there is no centralized error handling yet — errors fall through to Express's default handler.
- `src/utils/swagger/swagger.yaml` is empty, so `/api-docs` loads but documents no endpoints.
- `user-controller.js` and `user-router.js` are empty placeholders; there are no user or auth routes.
