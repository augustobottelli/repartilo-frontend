# Database Schema for Optimizations

## Table: `optimizations`

This table stores all optimization runs for users.

```sql
CREATE TABLE optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- Clerk user ID

    -- Metadata
    name VARCHAR(255) DEFAULT NULL,  -- Optional user-provided name
    created_at TIMESTAMP DEFAULT NOW(),

    -- Input Data (JSON)
    vehicles JSONB NOT NULL,  -- Array of Vehicle objects
    deliveries JSONB NOT NULL,  -- Array of Delivery objects

    -- Results (JSON)
    routes JSONB NOT NULL,  -- Array of VehicleRoute objects
    qr_codes JSONB DEFAULT NULL,  -- Array of QR code data
    efficiency_metrics JSONB DEFAULT NULL,  -- Distance/time/fuel savings

    -- Statistics (for quick querying/display)
    total_distance DECIMAL(10, 2),  -- Total km
    total_duration INTEGER,  -- Total seconds
    vehicles_used INTEGER,
    deliveries_count INTEGER,

    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC)
);
```

## Example Data Structure

### vehicles (JSONB)
```json
[
  {
    "id": "VEH001",
    "name": "Vehicle 1",
    "start_lat": -34.6037,
    "start_lng": -58.3816,
    "capacity": 100,
    "working_hours": 480
  }
]
```

### deliveries (JSONB)
```json
[
  {
    "id": "DEL001",
    "address": "Av. Corrientes 1234",
    "lat": -34.6037,
    "lng": -58.3816,
    "demand": 10,
    "time_window_start": null,
    "time_window_end": null
  }
]
```

### routes (JSONB)
```json
[
  {
    "vehicle": "VEH001",
    "steps": [...],
    "distance": 15234.5,
    "duration": 1800,
    "load": 45
  }
]
```

## Migration Script

If you're using PostgreSQL migrations:

```sql
-- migrations/001_create_optimizations.sql
CREATE TABLE IF NOT EXISTS optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    vehicles JSONB NOT NULL,
    deliveries JSONB NOT NULL,
    routes JSONB NOT NULL,
    qr_codes JSONB DEFAULT NULL,
    efficiency_metrics JSONB DEFAULT NULL,
    total_distance DECIMAL(10, 2),
    total_duration INTEGER,
    vehicles_used INTEGER,
    deliveries_count INTEGER
);

CREATE INDEX idx_optimizations_user_id ON optimizations(user_id);
CREATE INDEX idx_optimizations_created_at ON optimizations(created_at DESC);
```

## Query Examples

### Get user's optimizations (paginated)
```sql
SELECT
    id,
    name,
    created_at,
    total_distance,
    total_duration,
    vehicles_used,
    deliveries_count
FROM optimizations
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

### Get single optimization with full data
```sql
SELECT * FROM optimizations
WHERE id = $1 AND user_id = $2;
```

### Get user's total stats
```sql
SELECT
    COUNT(*) as total_optimizations,
    SUM(deliveries_count) as total_deliveries_optimized,
    SUM(total_distance) as total_km_planned
FROM optimizations
WHERE user_id = $1;
```
