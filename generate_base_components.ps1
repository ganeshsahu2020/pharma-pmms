
# Set components directory
$componentsPath = "src\components"

# Create the folder if it doesn't exist
if (!(Test-Path $componentsPath)) {
  New-Item -ItemType Directory -Path $componentsPath
  Write-Host "✅ Created folder: $componentsPath"
}

# Define component templates
$components = @(
  @{ Name = "Login.jsx"; Content = "import React from 'react';`nexport default function Login() { return <div>Login Page</div>; }" },
  @{ Name = "Dashboard.jsx"; Content = "import React from 'react';`nexport default function Dashboard() { return <div>Dashboard</div>; }" },
  @{ Name = "LandingPage.jsx"; Content = "import React from 'react';`nexport default function LandingPage() { return <div>Landing Page</div>; }" },
  @{ Name = "Signup.jsx"; Content = "import React from 'react';`nexport default function Signup() { return <div>Signup Page</div>; }" },
  @{ Name = "Logout.jsx"; Content = "import React, { useEffect } from 'react';`nimport { useNavigate } from 'react-router-dom';`nexport default function Logout() {`nconst navigate = useNavigate(); useEffect(() => { localStorage.clear(); navigate('/login'); }, [navigate]); return <div>Logging out...</div>; }" }
)

# Create each file
foreach ($component in $components) {
  $filePath = Join-Path $componentsPath $component.Name
  Set-Content -Path $filePath -Value $component.Content -Force
  Write-Host "✅ Created: $filePath"
}
