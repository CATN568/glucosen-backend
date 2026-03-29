# 🧪 P1 Features - Complete Test Guide

## Test Setup

Make sure your local environment is running:

```bash
docker-compose up -d

# Wait for services to be ready
sleep 5

# Check status
docker-compose ps
```

---

## 📋 Test Matrix

### Test 1: Alerts - Create Alert

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "high_glucose",
    "threshold": 200,
    "condition": "above",
    "enable_sms": false,
    "enable_push": false
  }'
```

**Expected Response:**
```json
{
  "message": "Alert created successfully",
  "alert": {
    "id": 1,
    "user_id": 1,
    "type": "high_glucose",
    "threshold": "200.00",
    "condition": "above",
    "enabled": true,
    "created_at": "2026-03-29T02:00:00.000Z"
  }
}
```

---

### Test 2: Alerts - Get All Alerts

```bash
curl http://localhost:3000/api/alerts \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "count": 1,
  "alerts": [
    {
      "id": 1,
      "user_id": 1,
      "type": "high_glucose",
      "threshold": "200.00"
    }
  ]
}
```

---

### Test 3: Alerts - Get Single Alert

```bash
curl http://localhost:3000/api/alerts/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Test 4: Alerts - Update Alert

```bash
curl -X PUT http://localhost:3000/api/alerts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "threshold": 180,
    "enable_sms": true
  }'
```

---

### Test 5: Alerts - Test Alert Notification

```bash
curl -X POST http://localhost:3000/api/alerts/1/test \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "message": "Test alert sent",
  "results": [
    {
      "success": true,
      "method": "email"
    }
  ]
}
```

---

### Test 6: Alerts - Delete Alert

```bash
curl -X DELETE http://localhost:3000/api/alerts/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Reports Testing

### Test 7: Reports - Get Summary Report (Last 7 Days)

```bash
curl "http://localhost:3000/api/reports/summary?days=7" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "period": {
      "start": "2026-03-22T02:00:00.000Z",
      "end": "2026-03-29T02:00:00.000Z",
      "generatedAt": "2026-03-29T02:05:00.000Z"
    },
    "summary": {
      "glucose_readings": 5,
      "meals_logged": 3,
      "exercises_logged": 2,
      "insulin_injections": 4,
      "average": "155.20",
      "min": 120,
      "max": 200,
      "stdDev": "28.15",
      "timeInRange": 80.0
    },
    "glucose_analysis": {
      "average": "155.20",
      "min": 120,
      "max": 200,
      "stdDev": "28.15",
      "timeInRange": {
        "description": "Percentage of time glucose was 70-180 mg/dL",
        "percentage": 80
      }
    },
    "daily_breakdown": {
      "2026-03-22": {
        "readings": [150, 160],
        "count": 2,
        "average": 155
      }
    }
  }
}
```

---

### Test 8: Reports - Get CSV Export

```bash
curl "http://localhost:3000/api/reports/csv?days=7&type=glucose" \
  -H "Authorization: Bearer $TOKEN" \
  -o glucose_report.csv
```

**Output File:**
```
Timestamp,Glucose (mg/dL),Notes
2026-03-29 10:30,185,Post breakfast
2026-03-28 14:15,145,Before lunch
```

---

### Test 9: Reports - Get HbA1c Analysis

```bash
curl "http://localhost:3000/api/reports/hba1c?days=90" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "period_start": "...",
    "period_end": "...",
    "average_glucose": "155.20",
    "hba1c_estimate": 7.2,
    "glucose_variability": {
      "std_dev": "28.15",
      "coefficient_of_variation": 18.15,
      "interpretation": "Moderate to low variability"
    },
    "data_points": 45
  }
}
```

---

### Test 10: Reports - Get Advanced Stats

```bash
curl "http://localhost:3000/api/reports/advanced-stats?days=30" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Test 11: Reports - Full Export (JSON)

```bash
curl "http://localhost:3000/api/reports/export?days=30&format=json" \
  -H "Authorization: Bearer $TOKEN" \
  -o full_report.json
```

---

### Test 12: Reports - Full Export (CSV)

```bash
curl "http://localhost:3000/api/reports/export?days=30&format=csv" \
  -H "Authorization: Bearer $TOKEN" \
  -o full_report.csv
```

---

## 🔄 Full Test Workflow

Run this complete test flow to validate everything:

```bash
#!/bin/bash

# Setup
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }' | jq -r '.token')

echo "✓ User created with token: $TOKEN"

# Create glucose reading
curl -s -X POST http://localhost:3000/api/glucose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "glucoseLevel": 180,
    "readingTime": "2026-03-29T02:00:00Z",
    "notes": "After breakfast"
  }' | jq .

echo "✓ Glucose reading created"

# Create alert
ALERT=$(curl -s -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "high_glucose",
    "threshold": 180
  }' | jq -r '.alert.id')

echo "✓ Alert created: $ALERT"

# Test alert notification
curl -s -X POST http://localhost:3000/api/alerts/$ALERT/test \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "✓ Alert notification tested"

# Get summary report
curl -s "http://localhost:3000/api/reports/summary?days=1" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "✓ Summary report generated"

# Get HbA1c analysis
curl -s "http://localhost:3000/api/reports/hba1c?days=30" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "✓ HbA1c analysis generated"

echo ""
echo "✅ All P1 Features tests completed successfully!"
```

---

## ✅ Test Results Template

Document your results:

```
P1 FEATURES - TEST RESULTS
==========================

Environment: Docker (glucosen-app + glucosen-postgres)
Date: 2026-03-29
Tester: [Your Name]

ALERTS TESTING:
[ ] Test 1: Create Alert - PASS/FAIL
[ ] Test 2: Get Alerts - PASS/FAIL
[ ] Test 3: Get Single Alert - PASS/FAIL
[ ] Test 4: Update Alert - PASS/FAIL
[ ] Test 5: Test Alert - PASS/FAIL
[ ] Test 6: Delete Alert - PASS/FAIL

REPORTS TESTING:
[ ] Test 7: Summary Report - PASS/FAIL
[ ] Test 8: CSV Export - PASS/FAIL
[ ] Test 9: HbA1c Analysis - PASS/FAIL
[ ] Test 10: Advanced Stats - PASS/FAIL
[ ] Test 11: JSON Export - PASS/FAIL
[ ] Test 12: CSV Export Full - PASS/FAIL

ISSUES FOUND:
- [Issue 1]
- [Issue 2]

NOTES:
- [Note 1]
- [Note 2]
```

---

## 🚀 Next Steps

After all tests pass:

1. **Merge to main:**
   ```bash
   git checkout main
   git merge feat/notifications
   git merge feat/reports
   git merge feat/statistics
   ```

2. **Deploy to production:**
   ```bash
   git push origin main
   ```

3. **Monitor deployment:**
   - Check Railway dashboard
   - Monitor logs in CI/CD

---

## 📞 Troubleshooting

### Issue: "Authorization required"
- Make sure you have a valid token
- Check the TOKEN variable is exported

### Issue: "Route not found"
- Verify routes are registered in app.js
- Check your base URL is correct (http://localhost:3000)

### Issue: "Database error"
- Verify postgres is running: `docker-compose ps`
- Check database connection: `docker-compose logs glucosen-postgres`

---

Good luck with testing! 🎯
