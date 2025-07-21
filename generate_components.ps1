# Set the base directory for components
$componentsPath = "C:\Users\rxgibsmt\DigitizerX\digitizerxui\src\components"

# Ensure the components folder exists
if (-not (Test-Path $componentsPath)) {
    New-Item -ItemType Directory -Path $componentsPath
    Write-Host "✅ Created components folder."
}

# List of components to create
$components = @{
    "Login.jsx" = 'export default function Login() { return <div>Login Page</div>; }';
    "Signup.jsx" = 'export default function Signup() { return <div>Signup Page</div>; }';
    "Dashboard.jsx" = 'export default function Dashboard() { return <div>Dashboard</div>; }';
    "LandingPage.jsx" = 'export default function LandingPage() { return <div>Landing Page</div>; }';
    "PasswordManagement.jsx" = 'export default function PasswordReset() { return <div>Password Reset</div>; }';
    "PrivateRoute.jsx" = @'
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}
'@;
    "Logout.jsx" = 'export default function Logout() { return <div>Logout</div>; }';
    "UserManagement.jsx" = 'export default function UserManagement() { return <div>User Management</div>; }';
}

# Write each file
foreach ($name in $components.Keys) {
    $filePath = Join-Path $componentsPath $name
    Set-Content -Path $filePath -Value $components[$name] -Encoding UTF8
    Write-Host "✅ Created $name"
}

Write-Host "🚀 All components generated successfully!"
