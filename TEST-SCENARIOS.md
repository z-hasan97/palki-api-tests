# Palki Platform — Test Scenarios v0.0.3

## How to Run

### Option 1: Postman Flows (Automated)
Open **Flows** in Postman and run any of the 6 pre-built flows:
1. Full Registration + Payment
2. Admin RBAC Test
3. Error Handling Tests
4. Agent CRUD
5. Blog + Comments
6. Matchmaking

### Option 2: Manual Step-by-Step
Run each request in order. Variables auto-set between requests.

---

## Scenario 1: New User Registration & Purchase

**Pre-requisites:** Services running, clean state

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 1.1 Register | user-id, state: PENDING_VERIFICATION |
| 2 | 1.2 Send OTP | Check auth-service logs for code |
| 3 | 1.3 Verify OTP | verified: true, state: ACTIVE |
| 4 | 1.4 Login (User) | accessToken, refreshToken, roles: CLIENT |
| 5 | 2.1 Get Profile | user-id, email, name, account-state |
| 6 | 2.2 Update Profile | Update name/phone |
| 7 | 5.1 List Packages | 3 packages: Basic, Premium, Enterprise |
| 8 | 5.2 Initiate Payment | paymentId, status: PENDING |
| 9 | 5.3 Verify Payment | status: COMPLETED |
| 10 | 5.4 Payment History | List of payments |
| 11 | 3.1 List Clients | New client created with package |

**? All pass = Registration + Payment flow works**

---

## Scenario 2: Admin RBAC Verification

**Pre-requisites:** Admin user exists

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 1.5 Login (Admin) | roles: ADMIN, adminToken saved |
| 2 | 8.1 Dashboard (Admin) | totalUsers, revenue, stats |
| 3 | 8.2 Users List (Admin) | User list |
| 4 | 8.3 Reports (Admin) | Monthly stats |
| 5 | 8.4 Dashboard (User - 403) | 403 Forbidden |

**? Admin accesses dashboard, user gets 403 = RBAC works**

---

## Scenario 3: Error Handling

**Pre-requisites:** Existing user data

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 10.1 Duplicate Email | code: AUTH-1005 |
| 2 | 10.2 Invalid Login | code: AUTH-1001 |
| 3 | 10.3 Fake Payment | code: NOT_FOUND-3001 |
| 4 | 10.4 No Token | statusCode: 401 |
| 5 | 10.5 RBAC Block | statusCode: 403 |

**? All error codes correct = Error handling works**

---

## Scenario 4: Agent Lifecycle

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 4.1 Create Agent | agent-id, name, email |
| 2 | 4.2 List Agents | Array with new agent |
| 3 | 4.3 Delete Agent | Confirmation |

**? Agent CRUD works**

---

## Scenario 5: Blog Content

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 7.1 Create Post | title, slug, status: PUBLISHED |
| 2 | 7.2 Public Posts | Array with new post |
| 3 | 7.3 View by Slug | Single post returned |
| 4 | 7.4 Add Comment | Comment saved with PENDING status |

**? Blog + Comments works**

---

## Scenario 6: Matchmaking

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 6.1 Request Match | match-id, status: PENDING |
| 2 | 6.3 List Matches | Array with new match |
| 3 | 6.2 Approve Match | status: APPROVED |

**? Matchmaking flow works**

---

## Scenario 7: Notifications

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 9.1 Send Notification | sent: true, to, channel |
| 2 | 9.2 Logs | Notification history |

**? Notifications work**

---

## Scenario 8: Health Check

| Step | Request | Expected Result |
|------|---------|-----------------|
| 1 | 0. Health / All Services | All 8 services + Kafka + DB up |

**? All infrastructure healthy**

---

## Quick Regression Test (Run Before Demo)
1. 0. Health ?
2. 1.5 Login (Admin) ?
3. 8.1 Dashboard ?
4. 10.1 Duplicate Email ? AUTH-1005 ?
5. 10.2 Invalid Login ? AUTH-1001 ?
6. 10.3 Fake Payment ? NOT_FOUND ?
7. 10.4 No Token ? 401 ?
8. 10.5 RBAC Block ? 403 ?

**All 8 pass = Platform ready!**

---

## Test Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@palki.com | Admin1234 |
| Client | zahid.updated@example.com | Test1234 |
| Client | flowtest2@example.com | Test1234 |

## Packages

| Name | Price | Duration |
|------|-------|----------|
| Basic | 999 | 30 days |
| Premium | 2999 | 90 days |
| Enterprise | 9999 | 365 days |
