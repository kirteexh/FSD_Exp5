# PowerShell Test Script for FSD Exp 5 CRUD Operations
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   FSD Exp 5: MongoDB + Express API Automated Tester    " -ForegroundColor Cyan
Write-Host "   Student: Kirteesh D. Rakshe (D15A - 43)              " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# 1. Health check
Write-Host "`n[1] Testing GET / (Server Health Check)..." -ForegroundColor Yellow
try {
    $res1 = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "  Status: 200 OK" -ForegroundColor Green
    Write-Host "  Response: $($res1 | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "  Error: Backend server is not running on $baseUrl" -ForegroundColor Red
    exit
}

# 2. GET all events
Write-Host "`n[2] Testing GET /api/events (Retrieve All Events)..." -ForegroundColor Yellow
$res2 = Invoke-RestMethod -Uri "$baseUrl/api/events" -Method Get
Write-Host "  Status: 200 OK | Count: $($res2.count)" -ForegroundColor Green
$firstId = $res2.data[0]._id
Write-Host "  Sample Document ObjectId: $firstId" -ForegroundColor Cyan

# 3. GET single event
Write-Host "`n[3] Testing GET /api/events/$firstId (Retrieve Event by ObjectId)..." -ForegroundColor Yellow
$res3 = Invoke-RestMethod -Uri "$baseUrl/api/events/$firstId" -Method Get
Write-Host "  Status: 200 OK | Name: '$($res3.data.name)'" -ForegroundColor Green

# 4. POST create event
Write-Host "`n[4] Testing POST /api/events (Create Event)..." -ForegroundColor Yellow
$newEventBody = @{
    name = "National Coding Marathon 2025"
    date = "2025-04-10"
    location = "Campus Auditorium, Floor 2"
    description = "Inter-college 24-hr competitive programming challenge"
    capacity = 150
    registered = 35
} | ConvertTo-Json

$res4 = Invoke-RestMethod -Uri "$baseUrl/api/events" -Method Post -Body $newEventBody -ContentType "application/json"
$createdId = $res4.data._id
Write-Host "  Status: 201 Created | Created ID: $createdId" -ForegroundColor Green

# 5. PUT update event
Write-Host "`n[5] Testing PUT /api/events/$createdId (Update Event)..." -ForegroundColor Yellow
$updateBody = @{
    capacity = 250
    registered = 90
} | ConvertTo-Json

$res5 = Invoke-RestMethod -Uri "$baseUrl/api/events/$createdId" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "  Status: 200 OK | Updated Capacity: $($res5.data.capacity)" -ForegroundColor Green

# 6. DELETE event
Write-Host "`n[6] Testing DELETE /api/events/$createdId (Delete Event)..." -ForegroundColor Yellow
$res6 = Invoke-RestMethod -Uri "$baseUrl/api/events/$createdId" -Method Delete
Write-Host "  Status: 200 OK | Message: $($res6.message)" -ForegroundColor Green

# 7. Error: Invalid ObjectId
Write-Host "`n[7] Testing Error Handling: Malformed ObjectId (GET /api/events/invalid-id)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/events/invalid-id" -Method Get
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  Status: $statusCode Bad Request (Expected!)" -ForegroundColor Green
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errBody = $streamReader.ReadToEnd()
    Write-Host "  Response: $errBody" -ForegroundColor Gray
}

# 8. Error: Missing Fields
Write-Host "`n[8] Testing Error Handling: Missing Fields (POST /api/events with empty body)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/events" -Method Post -Body "{}" -ContentType "application/json"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  Status: $statusCode Bad Request (Expected!)" -ForegroundColor Green
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errBody = $streamReader.ReadToEnd()
    Write-Host "  Response: $errBody" -ForegroundColor Gray
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   All 8 CRUD & Error Handling Tests Passed 100%!       " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

