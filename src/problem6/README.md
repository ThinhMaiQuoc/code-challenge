# Scoreboard API Module Specification

## Overview

This module provides the backend API to manage a live-updating scoreboard for a website. Users perform actions that increment their score; the frontend displays the top 10 scores in real time.

Key responsibilities:

- Receive and persist score updates.
- Validate and authorize update requests.
- Serve the top-10 leaderboard on demand.
- Push live updates to subscribed clients.

---

## Requirements

1. **User Score Updates**: Accept API calls to increment a user’s score upon completion of a valid action.
2. **Leaderboard**: Provide a REST endpoint to retrieve the top 10 users sorted by score.
3. **Live Updates**: Broadcast leaderboard changes in real time via WebSocket or Server-Sent Events (SSE).
4. **Security**: Ensure only authorized requests can update scores to prevent malicious manipulation.

---

## API Endpoints

### 1. `POST /api/scores`

```http
POST /api/scores
Content-Type: application/json
Authorization: Bearer <token>
{
  "userId": "string",
  "increment": 1
}
```

- **Description**: Increment a user’s score by `increment` amount (default 1).\


- **Response 201**: `{ "userId": "string", "newScore": number }`

- **Errors**:

  - 400 Bad Request: missing or invalid payload.
  - 401 Unauthorized: invalid or missing auth token.
  - 403 Forbidden: user not allowed to update this score.

### 2. `GET /api/leaderboard`

```http
GET /api/leaderboard
```

- **Description**: Retrieve the top 10 users by score.
- **Response 200**:

```json
[
  { "userId": "user123", "score": 42 }
  // …up to 10 entries in total
]
```

- **Errors**:
  - 500 Internal Server Error: unexpected database error.
  - 503 Service Unavailable: leaderboard service temporarily unavailable.

---

## Authentication & Authorization

**JWT Bearer Tokens** for all write operations (`POST /api/scores`).

---

## Real-time Updates

Clients can subscribe via SSE or WebSocket to the `/api/subscribe` endpoint. On each valid `POST /api/scores`, the server:

1. Updates the database.
2. Re-computes the top 10 (if affected).
3. Pushes an event to all subscribers with the updated leaderboard and change details.

---

## Data Model

```sql
CREATE TABLE user_scores (
  user_id    VARCHAR PRIMARY KEY,
  score      BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

**Indexes**:

- \`CREATE INDEX idx\_score\_desc ON user\_scores(score DESC);

---

## Error Handling

- Return structured JSON errors, e.g.:  
    ```json
    { "error": "Unauthorized", "message": "Invalid token." }
    ```

- Log all failed attempts and unusual spikes for security auditing.

---

## Future Improvements and Notes

- **Shard or cache** the leaderboard in Redis for ultra-low-latency reads.
- Add **WebSocket fallback** for clients that don’t support SSE.
- Track **audit logs** of score changes for analytics and fraud detection.
- Provide **pagination** on the leaderboard endpoint for deeper score browsing.
- **Bulk update** endpoint for batch processing (e.g. end-of-day bonuses).

---
