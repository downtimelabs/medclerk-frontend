# Doctor Signup Routes - Current State

## Current Doctor Signup Flow

### Route: `/signup`
**Location:** `src/App.jsx` (lines 145-168)

**Flow:**
1. User navigates to `/signup`
2. If no role selected → Shows `RoleSelection` component
3. If role is 'doctor' and not authenticated → Shows `Auth` component with `isSignUpMode={true}`
4. If authenticated → Redirects to `/dashboard`

**Current Implementation:**
```jsx
<Route 
  path="/signup" 
  element={
    !selectedRole ? (
      <RoleSelection onSelect={handleRoleSelect} />
    ) : !isAuthenticated ? (
      selectedRole === 'patient' ? (
        <PatientSignup onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Auth 
          selectedRole={selectedRole}
          onAuthSuccess={handleAuthSuccess}
          isSignUpMode={true}
        />
      )
    ) : (
      <Navigate to="/dashboard" replace />
    )
  } 
/>
```

### Issue Found:
- **DoctorSignup component exists** (`src/components/DoctorSignup.jsx`) but is **NOT being used**
- Currently, doctors get the basic `Auth` component which only collects:
  - Name
  - Email
  - Password
  - Role (DOCTOR)
- **Missing fields** that DoctorSignup component has:
  - License Number
  - Specialization
  - Clinic Name
  - Years of Experience
  - Address
  - Clinic Address

## Components Related to Doctor Signup

### 1. DoctorSignup Component
**File:** `src/components/DoctorSignup.jsx`
- **Status:** EXISTS but NOT USED in routing
- **Fields:** Complete doctor registration form with all profile fields
- **Registration:** Sends full `doctorProfile` object to backend

### 2. Auth Component (Currently Used)
**File:** `src/components/Auth.jsx`
- **Status:** Currently used for doctor signup
- **Fields:** Basic (name, email, password, role only)
- **Registration:** Sends minimal data (no doctorProfile)

### 3. RoleSelection Component
**File:** `src/components/RoleSelection.jsx`
- **Status:** Used for role selection
- **Function:** Allows user to select "I am a Doctor" option

## Recommended Fix

Update `/signup` route to use `DoctorSignup` component for doctors:

```jsx
selectedRole === 'patient' ? (
  <PatientSignup onAuthSuccess={handleAuthSuccess} />
) : selectedRole === 'doctor' ? (
  <DoctorSignup onAuthSuccess={handleAuthSuccess} />
) : (
  <Auth 
    selectedRole={selectedRole}
    onAuthSuccess={handleAuthSuccess}
    isSignUpMode={true}
  />
)
```

## Related Routes

### `/signin` Route
- Also uses `Auth` component for doctor login
- Shows `RoleSelection` first if no role selected

### `/dashboard` Route
- Redirects doctors to `/doctor` route (DoctorDashboard)

### `/doctor` Route
- Doctor dashboard after login/signup

## Summary

**Current Doctor Signup Route:**
- `/signup` → RoleSelection → Auth component (basic form) ❌ Missing doctor profile fields

**Should Be:**
- `/signup` → RoleSelection → DoctorSignup component (complete form) ✅ Has all doctor profile fields

