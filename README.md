## jwt

# Endpoints
> | REQUEST-METHOD | URI | RESULT | DESCRIPTION |
> | - | - | - | - |
> | GET | /authorize/:user | Returns Access-Token; Sets Refresh-Token as Cookie; Saves Refresh-Token on Server | SignIn Route; Normally POST with Credentials in Body; Refresh-Token normally saved in Database |
> | GET | /token | Verifies Refresh Tokens and returns new Access-Token if valid; Refresh-Token is accessed by Cookie  | - |
> | GET | /data/:at | Verifies Access-Token by Middleware and returns Data if valid | Access Token normally submitted via Authorization Header | 

# Middleware 
> - The AuthMiddleware verifies the Access token before every data Endpoint. 
> - The Access Token is submitted via Authorization Header.
> - If the Token is not returns 401
> - If the Token is invalid returns 403

# Workflow
> - Access Data
> - Is Access-Token set and valid? 
> - Yes: return Data
> - No: Try GET Access-Token by Refresh Token
> - Is Refresh-Token set?
> - Yes: GET new Access-Token and Access Data again
> - No: Redirect to SignIn Route

# Generate Secrets
> - Open Console
> - "node"
> - "require ('crypto').randomBytes(64).toString('hex')"
