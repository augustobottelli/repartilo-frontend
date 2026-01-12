# Optimization Storage Implementation Plan

## Overview
Store all optimization runs in the database so users can view their history and re-access past optimizations.

---

## ✅ Completed

### 1. **localStorage Persistence (Frontend)**
- Added Zustand persist middleware to `/lib/store.ts`
- **Result**: Excel data now persists between page refreshes and navigation
- **Why it was disappearing**: Zustand state was resetting on navigation without persistence

### 2. **Database Schema Design**
- Created migration file: `/database/002_add_optimizations_table.sql`
- Table stores: input data (vehicles, deliveries), results (routes, QR codes), and summary stats

---

## 📋 Proposed Backend Changes

### 1. **Database Migration**
**File**: `~/github/repartilo/database/002_add_optimizations_table.sql`

**Action**: Run this SQL in your Supabase SQL Editor

```sql
CREATE TABLE optimizations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT,  -- Optional user-provided name
    created_at TIMESTAMP,

    -- Input data
    vehicles JSONB NOT NULL,
    deliveries JSONB NOT NULL,

    -- Results
    routes JSONB NOT NULL,
    qr_codes JSONB,
    efficiency_metrics JSONB,

    -- Summary stats
    total_distance DECIMAL(10, 2),
    total_duration INTEGER,
    vehicles_used INTEGER,
    deliveries_count INTEGER
);
```

---

### 2. **Add Pydantic Models**
**File**: `~/github/repartilo/api/app/models/schemas.py`

**Add these models** (at the end of the file):

```python
# ============================================================================
# Optimization Storage Models
# ============================================================================

class SaveOptimizationRequest(BaseModel):
    """Request to save an optimization run"""
    name: Optional[str] = Field(None, max_length=255)
    vehicles: List[VehicleWithCoordinates]
    deliveries: List[DeliveryWithCoordinates]
    routes: List[Dict[str, Any]]  # VehicleRoute objects
    qr_codes: Optional[List[Dict[str, Any]]] = None
    efficiency_metrics: Optional[Dict[str, Any]] = None
    total_distance: float
    total_duration: int
    vehicles_used: int

class OptimizationSummary(BaseModel):
    """Summary of an optimization run"""
    id: str
    name: Optional[str]
    created_at: str
    total_distance: float
    total_duration: int
    vehicles_used: int
    deliveries_count: int

class SavedOptimization(BaseModel):
    """Complete saved optimization with all data"""
    id: str
    user_id: str
    name: Optional[str]
    created_at: str
    vehicles: List[VehicleWithCoordinates]
    deliveries: List[DeliveryWithCoordinates]
    routes: List[Dict[str, Any]]
    qr_codes: Optional[List[Dict[str, Any]]]
    efficiency_metrics: Optional[Dict[str, Any]]
    total_distance: float
    total_duration: int
    vehicles_used: int
    deliveries_count: int
```

---

### 3. **Create API Router**
**File**: `~/github/repartilo/api/app/routers/saved_optimizations.py` (NEW FILE)

```python
"""
Saved optimizations endpoints
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
import asyncpg

from app.services.database import get_db_connection
from app.services.auth import get_current_user, get_user_id_from_token
from app.models.schemas import (
    SaveOptimizationRequest,
    OptimizationSummary,
    SavedOptimization,
    BaseResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/optimizations", tags=["optimizations"])


@router.post("/save", response_model=Dict[str, str])
async def save_optimization(
    request: SaveOptimizationRequest,
    user_payload: Dict[str, Any] = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """Save an optimization run for later access"""
    try:
        clerk_user_id = get_user_id_from_token(user_payload)

        # Get internal user_id
        user = await conn.fetchrow(
            "SELECT id FROM users WHERE clerk_user_id = $1",
            clerk_user_id
        )

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Insert optimization
        optimization_id = await conn.fetchval(
            """
            INSERT INTO optimizations (
                user_id, name, vehicles, deliveries, routes, qr_codes,
                efficiency_metrics, total_distance, total_duration,
                vehicles_used, deliveries_count
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
            """,
            user["id"],
            request.name,
            [v.dict() for v in request.vehicles],
            [d.dict() for d in request.deliveries],
            request.routes,
            request.qr_codes,
            request.efficiency_metrics,
            request.total_distance,
            request.total_duration,
            request.vehicles_used,
            len(request.deliveries)
        )

        logger.info(f"Saved optimization {optimization_id} for user {clerk_user_id}")

        return {"id": str(optimization_id)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=List[OptimizationSummary])
async def list_optimizations(
    limit: int = 20,
    offset: int = 0,
    user_payload: Dict[str, Any] = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """Get list of user's saved optimizations"""
    try:
        clerk_user_id = get_user_id_from_token(user_payload)

        user = await conn.fetchrow(
            "SELECT id FROM users WHERE clerk_user_id = $1",
            clerk_user_id
        )

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        rows = await conn.fetch(
            """
            SELECT
                id::text,
                name,
                created_at,
                total_distance,
                total_duration,
                vehicles_used,
                deliveries_count
            FROM optimizations
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
            """,
            user["id"],
            limit,
            offset
        )

        return [dict(row) for row in rows]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing optimizations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{optimization_id}", response_model=SavedOptimization)
async def get_optimization(
    optimization_id: str,
    user_payload: Dict[str, Any] = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """Get a single saved optimization with full data"""
    try:
        clerk_user_id = get_user_id_from_token(user_payload)

        user = await conn.fetchrow(
            "SELECT id FROM users WHERE clerk_user_id = $1",
            clerk_user_id
        )

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        row = await conn.fetchrow(
            """
            SELECT
                id::text,
                user_id::text,
                name,
                created_at,
                vehicles,
                deliveries,
                routes,
                qr_codes,
                efficiency_metrics,
                total_distance,
                total_duration,
                vehicles_used,
                deliveries_count
            FROM optimizations
            WHERE id = $1::uuid AND user_id = $2
            """,
            optimization_id,
            user["id"]
        )

        if not row:
            raise HTTPException(status_code=404, detail="Optimization not found")

        return dict(row)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{optimization_id}", response_model=BaseResponse)
async def delete_optimization(
    optimization_id: str,
    user_payload: Dict[str, Any] = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """Delete a saved optimization"""
    try:
        clerk_user_id = get_user_id_from_token(user_payload)

        user = await conn.fetchrow(
            "SELECT id FROM users WHERE clerk_user_id = $1",
            clerk_user_id
        )

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        result = await conn.execute(
            "DELETE FROM optimizations WHERE id = $1::uuid AND user_id = $2",
            optimization_id,
            user["id"]
        )

        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Optimization not found")

        return BaseResponse(success=True, message="Optimization deleted")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

### 4. **Register Router in Main App**
**File**: `~/github/repartilo/api/app/main.py`

**Change**:
```python
from app.routers import validation, optimization, utils, database, users, saved_optimizations  # Add import

# Add this line with other router includes
app.include_router(saved_optimizations.router)
```

---

## 📱 Frontend Changes

### 1. **Add API Service Functions**
**File**: `~/github/repartilo-frontend/services/api.ts`

Add these functions:

```typescript
export async function saveOptimization(data: {
  name?: string;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  routes: VehicleRoute[];
  qr_codes?: any[];
  efficiency_metrics?: any;
  total_distance: number;
  total_duration: number;
  vehicles_used: number;
}): Promise<{ id: string }> {
  const response = await apiClient.post('/api/optimizations/save', data);
  return response.data;
}

export async function listOptimizations(): Promise<OptimizationSummary[]> {
  const response = await apiClient.get('/api/optimizations/list');
  return response.data;
}

export async function getOptimization(id: string): Promise<SavedOptimization> {
  const response = await apiClient.get(`/api/optimizations/${id}`);
  return response.data;
}
```

### 2. **Auto-save after Optimization**
Update `~/github/repartilo-frontend/app/dashboard/optimize/page.tsx` to automatically save after successful optimization.

### 3. **Create History Page**
New page: `~/github/repartilo-frontend/app/dashboard/history/page.tsx`
- Shows list of past optimizations
- Click to view details
- Can re-load optimization

---

## 🎯 Implementation Steps

**Before making any changes, please confirm:**

1. ✅ Should I proceed with the backend changes?
2. ✅ Should optimizations be saved automatically or require user action (click "Save")?
3. ✅ Do you want a name field when saving (like "Morning Routes - Jan 9") or auto-generate names?
4. ✅ Should there be a limit on how many optimizations can be stored per user?

**Once confirmed, I'll:**
1. Add the Pydantic models
2. Create the API router file
3. Update main.py to include router
4. Update frontend to call save endpoint
5. Create history page

Let me know what you'd like me to do!
