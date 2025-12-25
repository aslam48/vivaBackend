# VivaFemini Backend API

NestJS RESTful API backend for the VivaFemini cycle tracking application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vivafemini
CORS_ORIGIN=http://localhost:3001
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

## Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- Sample user (Emmanuelle)
- Sample cycle data
- Sample daily logs
- Sample activities
- Sample tips and articles

## API Endpoints

### Users

- `GET /users` - Get all users (optional `?userId=id` filter)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Create User Example:**
```json
{
  "name": "Emmanuelle",
  "email": "emmanuelle@example.com",
  "profilePicture": "https://example.com/avatar.jpg",
  "averageCycleLength": 28
}
```

### Cycles

- `GET /cycles` - Get all cycles (optional `?userId=id` filter)
- `GET /cycles/current?userId=id` - Get current active cycle
- `GET /cycles/:id` - Get cycle by ID
- `GET /cycles/:id/predictions` - Get cycle predictions (fertile window, ovulation)
- `GET /cycles/calendar?userId=id&month=10&year=2025` - Get calendar data with highlighted dates
- `POST /cycles` - Create new cycle
- `PATCH /cycles/:id` - Update cycle
- `DELETE /cycles/:id` - Delete cycle

**Create Cycle Example:**
```json
{
  "userId": "user_id_here",
  "startDate": "2025-10-01T00:00:00.000Z",
  "periodStartDate": "2025-10-01T00:00:00.000Z",
  "periodEndDate": "2025-10-05T00:00:00.000Z",
  "cycleLength": 28
}
```

### Daily Logs

- `GET /daily-logs` - Get all logs (optional `?userId=id` filter)
- `GET /daily-logs/date-range?userId=id&startDate=2025-10-01&endDate=2025-10-31` - Get logs by date range
- `GET /daily-logs/trends?userId=id&startDate=2025-10-01&endDate=2025-10-31` - Get symptom trends
- `GET /daily-logs/most-frequent?userId=id` - Get most frequent symptoms
- `GET /daily-logs/:id` - Get log by ID
- `POST /daily-logs` - Create new log entry
- `PATCH /daily-logs/:id` - Update log
- `DELETE /daily-logs/:id` - Delete log

**Create Daily Log Example:**
```json
{
  "userId": "user_id_here",
  "date": "2025-10-14T00:00:00.000Z",
  "cycleDay": 21,
  "physicalPainSymptoms": ["Bloating", "Cramps"],
  "moodMentalStates": ["Happy", "Cravings"],
  "flowIntensity": 3,
  "periodIndicators": ["Spotting"],
  "sexualHealthIndicators": [],
  "notes": "Feeling good today"
}
```

**Physical Pain Symptoms:** Cramps, Diarrhoea, Fatigue, Headache, Nausea, Breast tenderness, Abdominal pain, Pelvic pain, Lower back pain, Appetite changes, Water retention

**Mood & Mental States:** Happy, Neutral, Sad, Low Motivation, Mood swings, Irritability, Cravings, Tearfulness, Difficulty Concentrating

**Period Indicators:** Spotting, heavier flow, lighter flow, Vaginal Dryness

**Sexual Health Indicators:** Increased sex drive, Decreased sex drive, Vaginal discharge

### Activities

- `GET /activities` - Get all activities (optional `?userId=id` filter)
- `GET /activities/:id` - Get activity by ID
- `POST /activities` - Log new activity
- `PATCH /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity

**Create Activity Example:**
```json
{
  "userId": "user_id_here",
  "date": "2025-10-14T00:00:00.000Z",
  "activityName": "Pilates",
  "duration": 30,
  "notes": "Great session"
}
```

### Pregnancy Tests

- `GET /pregnancy-tests` - Get all tests (optional `?userId=id` filter)
- `GET /pregnancy-tests/:id` - Get test by ID
- `POST /pregnancy-tests` - Log test result
- `PATCH /pregnancy-tests/:id` - Update test
- `DELETE /pregnancy-tests/:id` - Delete test

**Test Result Values:** `positive`, `negative`, `faint_line`, `not_taken`

**Create Pregnancy Test Example:**
```json
{
  "userId": "user_id_here",
  "date": "2025-10-14T00:00:00.000Z",
  "result": "not_taken"
}
```

### Tips

- `GET /tips` - Get all tips
- `GET /tips/cycle-day/:day` - Get tips for specific cycle day
- `GET /tips/phase/:phase` - Get tips by cycle phase
- `GET /tips/:id` - Get tip by ID
- `POST /tips` - Create new tip
- `PATCH /tips/:id` - Update tip
- `DELETE /tips/:id` - Delete tip

**Cycle Phases:** `menstrual`, `follicular`, `ovulation`, `luteal`

### Articles

- `GET /articles` - Get all articles
- `GET /articles/recommended?userId=id&limit=3` - Get recommended articles
- `GET /articles/:id` - Get article by ID
- `POST /articles` - Create new article
- `PATCH /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article

### Health Reports

- `GET /health-reports/monthly?userId=id&month=10&year=2025` - Get monthly health report
- `GET /health-reports/cycle/:cycleId` - Get cycle-specific report
- `GET /health-reports/symptoms?userId=id&startDate=2025-10-01&endDate=2025-10-31` - Get symptom frequency data
- `GET /health-reports/flow-pattern?userId=id&startDate=2025-10-01&endDate=2025-10-31` - Get flow pattern graph data

**Monthly Report Response:**
```json
{
  "month": 10,
  "year": 2025,
  "cycleSummary": {
    "cycleLength": 28,
    "periodDuration": 5,
    "estimatedNextPeriod": "2025-11-12T00:00:00.000Z",
    "ovulationWindow": {
      "start": "2025-10-13T00:00:00.000Z",
      "end": "2025-10-15T00:00:00.000Z"
    }
  },
  "symptomFrequency": {
    "physicalPain": 55,
    "moodMental": 75,
    "digestionAppetite": 62,
    "sexualHealth": 32
  },
  "flowPattern": [...],
  "historicalLogs": [...],
  "summary": "Your average cycle length is 28 days...",
  "tips": ["Low sleep nights -> higher cramp scores"]
}
```

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── users/          # User management
│   │   ├── cycles/         # Cycle tracking and predictions
│   │   ├── daily-logs/     # Daily symptom and health logging
│   │   ├── activities/     # Activity logging
│   │   ├── pregnancy-tests/ # Pregnancy test tracking
│   │   ├── tips/           # Cycle tips and recommendations
│   │   ├── articles/       # Content articles
│   │   └── health-reports/  # Health report aggregations
│   ├── config/             # Configuration modules
│   ├── scripts/           # Seed scripts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Cycle Calculation Logic

The backend automatically calculates:

- **Cycle Day**: Based on period start date and current date
- **Next Period Prediction**: Based on average cycle length from historical data
- **Fertile Window**: Typically days 8-19 of the cycle
- **Ovulation Window**: Typically days 13-15 of the cycle

## Data Validation

All endpoints use DTOs with `class-validator` for input validation:
- Required fields are enforced
- Email format validation
- Date validation
- Enum validation for status fields
- Numeric range validation (e.g., flow intensity 0-10)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (for DELETE)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## CORS Configuration

CORS is enabled for frontend integration. Update `CORS_ORIGIN` in `.env` to match your frontend URL.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Building for Production

```bash
npm run build
```

The compiled JavaScript will be in the `dist/` directory.

## License

Private - VivaFemini Test Project

