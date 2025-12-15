# Authenticating requests

To authenticate requests, include an **`Authorization`** header with the value **`"Bearer {ACCESS_TOKEN}"`**.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

To authenticate, first call the <b>POST /api/auth/login</b> endpoint with your credentials. Use the returned token in the <code>Authorization</code> header as: <code>Bearer {token}</code>
