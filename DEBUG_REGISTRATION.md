# Debug Registration Issue

## Error Message
```
Invalid response from server
```

## Possible Causes

### 1. Response Structure Mismatch
The frontend expects one of these formats:
```javascript
// Format 1
{ data: { user: {...}, tokens: {...} } }

// Format 2
{ user: {...}, tokens: {...} }

// Format 3
{ data: {...} }  // user data directly in data

// Format 4
{ ...userData }  // user data at root level
```

### 2. Missing Required Fields
The code checks for `userData.email` - if this is missing, it throws the error.

## Debug Steps

### Step 1: Open Browser Console (F12)
Before submitting the form, open the browser console to see logs.

### Step 2: Submit the Form
Fill out the doctor registration form and submit.

### Step 3: Check Console Logs
Look for these logs:
```
📤 Registration request: { endpoint: "...", role: "DOCTOR", email: "..." }
📥 Registration response: { ... }
```

### Step 4: Check Response Structure
The response log will show the actual structure returned by the backend.

**Common scenarios:**

**Scenario A: Success Response**
```javascript
{
  success: true,
  data: {
    user: {
      id: "...",
      email: "...",
      name: "...",
      role: "DOCTOR",
      doctorProfile: { ... }
    },
    tokens: {
      accessToken: "...",
      refreshToken: "..."
    }
  }
}
```
✅ This should work

**Scenario B: User at Root**
```javascript
{
  id: "...",
  email: "...",
  name: "...",
  role: "DOCTOR",
  doctorProfile: { ... },
  tokens: { ... }
}
```
✅ This should work now (after fix)

**Scenario C: Missing Email**
```javascript
{
  data: {
    id: "...",
    // email is missing!
    name: "...",
    role: "DOCTOR"
  }
}
```
❌ This will fail - backend must include email

**Scenario D: Error Response**
```javascript
{
  success: false,
  error: "Email already exists"
}
```
❌ This is an error from backend

## Updated Code

### Better Response Handling
The code now tries multiple formats:
1. `response.data.user`
2. `response.user`
3. `response.data`
4. `response` (root level)

### Better Error Messages
- Console logs show the actual response structure
- Error message tells user to check console

## How to Fix

### If Response Structure is Different
Share the console log output that shows:
```
📥 Registration response: { ... }
```

Then we can adjust the code to match your backend's exact format.

### If Email is Missing
Backend needs to return the user's email in the response.

### If Backend Returns Error
Check the error message - it might be:
- Email already registered
- Invalid data format
- Missing required fields
- Server error

## Test Again

1. Clear browser cache: `Ctrl + Shift + R`
2. Open console: `F12`
3. Try registering again
4. Share the console output showing the response structure
