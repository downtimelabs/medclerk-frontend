# Patient Registration Integration Test

## ✅ Configuration Verified

### API Endpoint
```
POST https://medclerk-backend.vercel.app/api/v1/auth/register
```

### Frontend Code (PatientSignup.jsx)
```javascript
const response = await register({
  email: basic.email.trim(),           // ✅ "pushkar1713@gmail.com"
  password: basic.password,            // ✅ "Pushkar1230"
  confirmPassword: basic.password,     // ✅ "Pushkar1230"
  name: basic.name.trim(),             // ✅ "Pushkar"
  role: 'PATIENT',                     // ✅ "PATIENT" (uppercase)
  patientProfile: {                    // ✅ Nested object
    bloodGroup: medical.bloodGroup,    // ✅ "O+"
    heightCm: parseInt(medical.heightCm, 10),  // ✅ 175 (number)
    weightKg: parseInt(medical.weightKg, 10),  // ✅ 70 (number)
    allergies: medical.allergies || '',        // ✅ "Peanuts, Shellfish"
    chronicConditions: [...],                  // ✅ ["Diabetes", "Hypertension"]
    emergencyContact: {                        // ✅ Nested object
      name: emergency.name || '',              // ✅ "Jane Doe"
      phone: emergency.phone || '',            // ✅ "+1-555-123-4567"
      email: emergency.email || ''             // ✅ "jane.doe@example.com"
    }
  }
});
```

## 📋 Expected Postman Format (from screenshot)
```json
{
  "email": "pushkar1713@gmail.com",
  "password": "Pushkar1230",
  "confirmPassword": "Pushkar1230",
  "name": "Pushkar",
  "role": "PATIENT",
  "patientProfile": {
    "bloodGroup": "O+",
    "heightCm": 175,
    "weightKg": 70,
    "allergies": "Peanuts, Shellfish",
    "chronicConditions": [
      "Diabetes",
      "Hypertension"
    ],
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1-555-123-4567",
      "email": "jane.doe@example.com"
    }
  }
}
```

## ✅ Verification Checklist

| Field | Frontend | Postman | Match |
|-------|----------|---------|-------|
| email | ✅ String | ✅ String | ✅ YES |
| password | ✅ String | ✅ String | ✅ YES |
| confirmPassword | ✅ String | ✅ String | ✅ YES |
| name | ✅ String | ✅ String | ✅ YES |
| role | ✅ "PATIENT" | ✅ "PATIENT" | ✅ YES |
| patientProfile | ✅ Object | ✅ Object | ✅ YES |
| bloodGroup | ✅ String | ✅ String | ✅ YES |
| heightCm | ✅ Number | ✅ Number | ✅ YES |
| weightKg | ✅ Number | ✅ Number | ✅ YES |
| allergies | ✅ String | ✅ String | ✅ YES |
| chronicConditions | ✅ Array | ✅ Array | ✅ YES |
| emergencyContact | ✅ Object | ✅ Object | ✅ YES |
| emergencyContact.name | ✅ String | ✅ String | ✅ YES |
| emergencyContact.phone | ✅ String | ✅ String | ✅ YES |
| emergencyContact.email | ✅ String | ✅ String | ✅ YES |

## 🧪 How to Test

### Step 1: Open the App
```
http://localhost:5173 (or your dev server port)
```

### Step 2: Navigate to Patient Signup
1. Click "Get Started"
2. Select "Patient" role
3. You'll see the multi-step patient registration form

### Step 3: Fill the Form

**Step 1 - Basic Info:**
- Name: `Test Patient`
- Email: `test@example.com`
- Password: `Test123!`
- Confirm Password: `Test123!`

**Step 2 - Medical Info:**
- Blood Group: `O+`
- Height (cm): `175`
- Weight (kg): `70`
- Allergies: `Peanuts, Shellfish`
- Chronic Conditions: `Diabetes, Hypertension`

**Step 3 - Emergency Contact:**
- Name: `Jane Doe`
- Phone: `+1-555-123-4567`
- Email: `jane.doe@example.com`

### Step 4: Submit & Check

**Open Browser Console (F12) and watch for:**

1. **Request being sent:**
   ```
   POST https://medclerk-backend.vercel.app/api/v1/auth/register
   ```

2. **Request payload** (should match Postman format exactly)

3. **Response:**
   - Success: `{ success: true, data: { user: {...}, tokens: {...} } }`
   - Error: `{ success: false, error: "..." }`

### Step 5: Verify Success

**On successful registration:**
- ✅ You should be redirected to Patient Dashboard
- ✅ User data saved to localStorage
- ✅ Access token saved
- ✅ Refresh token saved

**Check localStorage:**
```javascript
// In browser console
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Auth:', localStorage.getItem('isAuthenticated'));
console.log('Token:', localStorage.getItem('accessToken'));
```

## 🔍 Troubleshooting

### Issue: 409 Conflict Error
**Cause:** Email already registered
**Fix:** Use a different email address

### Issue: 400 Bad Request
**Cause:** Invalid data format
**Fix:** Check that:
- heightCm and weightKg are numbers (not strings)
- role is uppercase "PATIENT"
- all required fields are present

### Issue: Network Error / CORS
**Cause:** Backend not accessible or CORS not configured
**Fix:** 
- Verify backend is running
- Check backend CORS settings allow your frontend domain

### Issue: 500 Server Error
**Cause:** Backend error
**Fix:** Check backend logs for details

## ✅ Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| API Endpoint | ✅ Correct | https://medclerk-backend.vercel.app/api/v1/auth/register |
| Request Format | ✅ Matches | Exactly matches Postman format |
| Data Types | ✅ Correct | Numbers parsed, strings trimmed |
| Nested Objects | ✅ Correct | patientProfile and emergencyContact |
| Role Format | ✅ Correct | Uppercase "PATIENT" |
| Error Handling | ✅ Present | Try-catch with user feedback |

## 🎯 Conclusion

**The patient registration is correctly configured and should work!**

All fields match the backend API format exactly as shown in the Postman screenshot. The integration is ready for testing.
