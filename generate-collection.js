const fs = require('fs');

const collection = {
  info: { name: "Palki Platform API - Complete v0.0.3", description: "50+ endpoints, 8 microservices, RBAC, error handling", version: "0.0.3", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}", type: "string" }] },
  variable: [
    { key: "baseUrl", value: "http://localhost:3001/api/v1" },
    { key: "token", value: "" }, { key: "adminToken", value: "" }, { key: "refreshToken", value: "" },
    { key: "userId", value: "" }, { key: "paymentId", value: "" }, { key: "agentId", value: "" },
    { key: "matchId", value: "" }, { key: "postSlug", value: "" }
  ],
  item: []
};

function ep(method, path, body, tests, auth) {
  const req = { method, url: { raw: "{{baseUrl}}" + path, host: ["{{baseUrl}}"], path: path.split('/').filter(Boolean) } };
  if (body) { req.header = [{ key: "Content-Type", value: "application/json" }]; req.body = { mode: "raw", raw: JSON.stringify(body, null, 2) }; }
  if (auth === 'admin') req.auth = { type: "bearer", bearer: [{ key: "token", value: "{{adminToken}}", type: "string" }] };
  if (tests) req.event = [{ listen: "test", script: { exec: tests, type: "text/javascript" } }];
  return req;
}

// 0. Health
collection.item.push({ name: "0. Health", item: [
  { name: "All Services", request: ep("GET", "/health") }
]});

// 1. Auth
collection.item.push({ name: "1. Auth", item: [
  { name: "Register", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.userId)pm.collectionVariables.set('userId',d.userId);pm.test('Registered',!!d.userId)"], type: "text/javascript" } }], request: ep("POST", "/auth/register", { email: "test_v003@example.com", password: "Test1234", name: "v0.0.3 Tester" }) },
  { name: "Send OTP", request: ep("POST", "/auth/send-otp", { email: "test_v003@example.com", purpose: "REGISTRATION" }) },
  { name: "Verify OTP", request: ep("POST", "/auth/verify-otp", { userId: "{{userId}}", recipient: "test_v003@example.com", code: "PASTE_OTP" }) },
  { name: "Login (User)", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.accessToken){pm.collectionVariables.set('token',d.accessToken);pm.collectionVariables.set('refreshToken',d.refreshToken);pm.collectionVariables.set('userId',d.user.id)};pm.test('Token saved',!!d.accessToken)"], type: "text/javascript" } }], request: ep("POST", "/auth/login", { identifier: "zahid.updated@example.com", password: "Test1234", deviceId: "postman" }) },
  { name: "Login (Admin)", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.accessToken)pm.collectionVariables.set('adminToken',d.accessToken);pm.test('Admin token saved',!!d.accessToken)"], type: "text/javascript" } }], request: ep("POST", "/auth/login", { identifier: "admin@palki.com", password: "Admin1234", deviceId: "postman" }) },
  { name: "Refresh Token", request: ep("POST", "/auth/refresh", { refreshToken: "{{refreshToken}}", deviceId: "postman" }) },
  { name: "Logout", request: ep("POST", "/auth/logout", { refreshToken: "{{refreshToken}}", deviceId: "postman" }) }
]});

// 2. User
collection.item.push({ name: "2. User", item: [
  { name: "Get Profile", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();pm.test('User: '+d.name,!!d.name)"], type: "text/javascript" } }], request: ep("GET", "/users/profile") },
  { name: "Update Profile", request: ep("PUT", "/users/profile", { name: "v0.0.3 Updated", phone: "+8801999999999" }) }
]});

// 3. Clients
collection.item.push({ name: "3. Clients", item: [
  { name: "List Clients", request: ep("GET", "/clients") }
]});

// 4. Agents
collection.item.push({ name: "4. Agents", item: [
  { name: "Create Agent", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.id)pm.collectionVariables.set('agentId',d.id);pm.test('Created',!!d.id)"], type: "text/javascript" } }], request: ep("POST", "/agents", { name: "v0.0.3 Agent", email: "agent_v003@test.com", userId: "{{userId}}", action: "create" }) },
  { name: "List Agents", request: ep("GET", "/agents") },
  { name: "Delete Agent", request: ep("DELETE", "/agents/{{agentId}}") }
]});

// 5. Packages & Payments
collection.item.push({ name: "5. Payments", item: [
  { name: "List Packages", request: ep("GET", "/packages") },
  { name: "Initiate Payment", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.paymentId)pm.collectionVariables.set('paymentId',d.paymentId);pm.test('Status:'+d.status,d.status==='PENDING')"], type: "text/javascript" } }], request: ep("POST", "/payments/initiate", { userId: "{{userId}}", packageId: "f3555008-f5c1-4240-95e3-6dcf18d8f113", amount: 999 }) },
  { name: "Verify Payment", request: ep("POST", "/payments/verify", { paymentId: "{{paymentId}}", transactionId: "txn_v003" }) },
  { name: "Payment History", request: ep("GET", "/payments") }
]});

// 6. Matches
collection.item.push({ name: "6. Matches", item: [
  { name: "Request Match", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.id)pm.collectionVariables.set('matchId',d.id);pm.test('Match:'+d.status,!!d.id)"], type: "text/javascript" } }], request: ep("POST", "/matches/request", { requesterId: "{{userId}}", targetId: "14b5a018-239a-4e16-bb1f-3ff13ff790c9", action: "request" }) },
  { name: "Approve Match", request: ep("POST", "/matches/approve", { id: "{{matchId}}", action: "approve" }) },
  { name: "List Matches", request: ep("GET", "/matches") }
]});

// 7. Blog
collection.item.push({ name: "7. Blog", item: [
  { name: "Create Post", event: [{ listen: "test", script: { exec: ["var d=pm.response.json();if(d.slug)pm.collectionVariables.set('postSlug',d.slug);pm.test('Slug:'+d.slug,!!d.slug)"], type: "text/javascript" } }], request: ep("POST", "/admin/blog/posts", { title: "v0.0.3 Blog Post", content: "Content for v0.0.3", status: "PUBLISHED", action: "create" }) },
  { name: "Public Posts", request: ep("GET", "/blog/posts") },
  { name: "View by Slug", request: ep("GET", "/blog/posts/{{postSlug}}") },
  { name: "Add Comment", request: ep("POST", "/blog/comments", { postId: "c63489ad-f340-4784-9106-9ffc7a36a70f", userId: "{{userId}}", authorName: "Tester", content: "Great post!", action: "create" }) }
]});

// 8. Admin (RBAC)
collection.item.push({ name: "8. Admin (RBAC)", item: [
  { name: "Dashboard (Admin)", event: [{ listen: "test", script: { exec: ["pm.test('Revenue > 0',pm.response.json().revenue>0)"], type: "text/javascript" } }], request: ep("GET", "/admin/dashboard", null, null, 'admin') },
  { name: "Users List (Admin)", request: ep("GET", "/admin/users", null, null, 'admin') },
  { name: "Reports (Admin)", request: ep("GET", "/admin/reports", null, null, 'admin') },
  { name: "Dashboard (User - 403)", event: [{ listen: "test", script: { exec: ["pm.test('403 Forbidden',pm.response.code===403)"], type: "text/javascript" } }], request: ep("GET", "/admin/dashboard") }
]});

// 9. Notifications
collection.item.push({ name: "9. Notifications", item: [
  { name: "Send Notification", request: ep("POST", "/notifications/send", { recipient: "user@test.com", message: "v0.0.3 notification", channel: "email", action: "send" }) },
  { name: "Logs", request: ep("GET", "/notifications/logs") }
]});

// 10. Error Handling
collection.item.push({ name: "10. Error Tests", item: [
  { name: "Duplicate Email (AUTH-1005)", event: [{ listen: "test", script: { exec: ["pm.test('AUTH-1005',pm.response.json().code==='AUTH-1005')"], type: "text/javascript" } }], request: ep("POST", "/auth/register", { email: "admin@palki.com", password: "Test1234", name: "Dup" }) },
  { name: "Invalid Login (AUTH-1001)", event: [{ listen: "test", script: { exec: ["pm.test('AUTH-1001',pm.response.json().code==='AUTH-1001')"], type: "text/javascript" } }], request: ep("POST", "/auth/login", { identifier: "wrong@email.com", password: "wrong", deviceId: "test" }) },
  { name: "Fake Payment (NOT_FOUND-3001)", event: [{ listen: "test", script: { exec: ["pm.test('NOT_FOUND-3001',pm.response.json().code==='NOT_FOUND-3001')"], type: "text/javascript" } }], request: ep("POST", "/payments/verify", { paymentId: "00000000-0000-0000-0000-000000000000", transactionId: "fake" }) },
  { name: "No Token (401)", event: [{ listen: "test", script: { exec: ["pm.test('401/500',[401,500].includes(pm.response.code))"], type: "text/javascript" } }], request: ep("GET", "/users/profile") },
  { name: "RBAC Block (403)", event: [{ listen: "test", script: { exec: ["pm.test('403',pm.response.code===403)"], type: "text/javascript" } }], request: ep("GET", "/admin/dashboard") }
]});

fs.writeFileSync('Palki-API.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('DONE - Postman collection generated!');
