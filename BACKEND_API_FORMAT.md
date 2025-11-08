# Backend API Integration Format

## Patient Registration

### Endpoint
```
POST https://medclerk-ai.onrender.com/api/v1/auth/register
```

### Request Format
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

### Frontend Implementation
```javascript
// src/components/PatientSignup.jsx
const response = await register({
  email: basic.email.trim(),
  password: basic.password,
  confirmPassword: basic.password,
  name: basic.name.trim(),
  role: 'PATIENT',
  patientProfile: {
    bloodGroup: medical.bloodGroup,
    heightCm: parseInt(medical.heightCm, 10),
    weightKg: parseInt(medical.weightKg, 10),
    allergies: medical.allergies || '',
    chronicConditions: medical.chronicConditions 
      ? medical.chronicConditions.split(',').map((s) => s.trim()).filter(Boolean) 
      : [],
    emergencyContact: {
      name: emergency.name || '',
      phone: emergency.phone || '',
      email: emergency.email || ''
    }
  }
});
```

---

## Doctor Registration

### Endpoint
```
POST https://medclerk-backend.vercel.app/api/v1/auth/register
```

### Request Format
```json
{
  "email": "doctor@example.com",
  "password": "Doctor123",
  "confirmPassword": "Doctor123",
  "name": "Dr. Smith",
  "role": "DOCTOR",
  "doctorProfile": {
    "licenseNumber": "MD12345",
    "specialization": "Cardiology",
    "clinicName": "Heart Care Clinic",
    "yearsExperience": 10
  }
}
```

### Frontend Implementation
```javascript
// src/components/DoctorSignup.jsx
const response = await register({
  email: basic.email.trim(),
  password: basic.password,
  confirmPassword: basic.password,
  name: basic.name.trim(),
  role: 'DOCTOR',
  doctorProfile: {
    licenseNumber: professional.licenseNumber.trim(),
    specialization: professional.specialization,
    clinicName: professional.clinicName.trim(),
    yearsExperience: clampedYears
  }
});
```

---

## Login

### Endpoint
```
POST https://medclerk-backend.vercel.app/api/v1/auth/login
```

### Request Format
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Frontend Implementation
```javascript
// src/components/Auth.jsx
const response = await login({
  email: formData.email,
  password: formData.password
});
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "PATIENT",
      "patientProfile": {
        "bloodGroup": "O+",
        "heightCm": 175,
        "weightKg": 70,
        ...
      }
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Key Points

1. **Role Format**: Must be uppercase (`PATIENT`, `DOCTOR`)
2. **Nested Profiles**: Patient and doctor data must be in nested objects
3. **Required Fields**:
   - `email`
   - `password`
   - `confirmPassword`
   - `name`
   - `role`
   - Profile object (`patientProfile` or `doctorProfile`)

4. **Data Types**:
   - `heightCm`: Number (integer)
   - `weightKg`: Number (integer)
   - `yearsExperience`: Number (integer)
   - `chronicConditions`: Array of strings
   - All other fields: Strings

5. **Token Storage**:
   - Tokens are saved to localStorage automatically by `authService.js`
   - Access token: `localStorage.getItem('accessToken')`
   - Refresh token: `localStorage.getItem('refreshToken')`
