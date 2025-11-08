# Doctor Registration API Format

## Backend API Format (from Postman)

### Endpoint
```
POST https://medclerk-backend.vercel.app/api/v1/auth/register
```

### Request Body
```json
{
  "email": "dr.johnsmith@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "name": "John Smith",
  "role": "DOCTOR",
  "address": {
    "street": "00",
    "city": "JagatPuri",
    "state": "Delhi",
    "country": "India",
    "postalCode": "110051"
  },
  "doctorProfile": {
    "licenseNumber": "MD12345678",
    "specialization": "Cardiology",
    "clinicName": "Heart Care Medical Center",
    "yearsOfExperience": 15,
    "clinicAddress": {
      "street": "00",
      "city": "JagatPuri",
      "state": "Delhi",
      "country": "India",
      "postalCode": "110051"
    }
  }
}
```

## Frontend Implementation

### Updated DoctorSignup.jsx
```javascript
const response = await register({
  email: basic.email.trim(),
  password: basic.password,
  confirmPassword: basic.password,
  name: basic.name.trim(),
  role: 'DOCTOR',
  address: {
    street: address.street || '00',
    city: address.city || 'City',
    state: address.state || 'State',
    country: address.country || 'India',
    postalCode: address.postalCode || '000000'
  },
  doctorProfile: {
    licenseNumber: professional.licenseNumber.trim(),
    specialization: professional.specialization,
    clinicName: professional.clinicName.trim(),
    yearsOfExperience: clampedYears,
    clinicAddress: {
      street: clinicAddress.street || '00',
      city: clinicAddress.city || 'City',
      state: clinicAddress.state || 'State',
      country: clinicAddress.country || 'India',
      postalCode: clinicAddress.postalCode || '000000'
    }
  }
});
```

## Key Changes

1. **Added `address` field** - Doctor's personal address
2. **Added `clinicAddress` inside `doctorProfile`** - Clinic location
3. **Changed `yearsExperience` to `yearsOfExperience`** - Match backend field name
4. **Default values** - Provide defaults if address fields are empty

## Field Mapping

| Postman Field | Frontend Code | Type | Required |
|---------------|---------------|------|----------|
| email | basic.email.trim() | String | ✅ Yes |
| password | basic.password | String | ✅ Yes |
| confirmPassword | basic.password | String | ✅ Yes |
| name | basic.name.trim() | String | ✅ Yes |
| role | 'DOCTOR' | String | ✅ Yes |
| address.street | address.street \|\| '00' | String | ✅ Yes |
| address.city | address.city \|\| 'City' | String | ✅ Yes |
| address.state | address.state \|\| 'State' | String | ✅ Yes |
| address.country | address.country \|\| 'India' | String | ✅ Yes |
| address.postalCode | address.postalCode \|\| '000000' | String | ✅ Yes |
| doctorProfile.licenseNumber | professional.licenseNumber | String | ✅ Yes |
| doctorProfile.specialization | professional.specialization | String | ✅ Yes |
| doctorProfile.clinicName | professional.clinicName | String | ✅ Yes |
| doctorProfile.yearsOfExperience | clampedYears | Number | ✅ Yes |
| doctorProfile.clinicAddress.* | clinicAddress.* | Object | ✅ Yes |

## Status

✅ **Updated to match backend API format**
- Added personal address fields
- Added clinic address fields
- Fixed field name: `yearsOfExperience`
- Provides default values for optional address fields
