# Palki API Tests — v0.0.3

Postman collection and test scenarios for Palki Platform API.

## Quick Start
1. Import \Palki-API.postman_collection.json\ into Postman
2. Set \aseUrl\ variable to \http://localhost:3001/api/v1\
3. Run tests in order:
   - **0. Health** — Verify all services
   - **1. Auth** — Register ? Login (User & Admin)
   - **2-7** — Feature modules
   - **8. Admin (RBAC)** — Role-based access tests
   - **10. Error Tests** — Validation & security

## Test Data
| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@palki.com | Admin1234 | ADMIN |
| Client | flowtest2@example.com | Test1234 | CLIENT |

## Collection Variables
| Variable | Auto-set by |
|----------|-------------|
| \{{token}}\ | Login (User) |
| \{{adminToken}}\ | Login (Admin) |
| \{{userId}}\ | Login |
| \{{paymentId}}\ | Initiate Payment |
| \{{agentId}}\ | Create Agent |
| \{{matchId}}\ | Request Match |
| \{{postSlug}}\ | Create Blog Post |

## Test Scenarios
1. **Registration Flow**: 1.1 ? 1.2 ? 1.3 ? 1.4 ? 2.1 ? 5.2 ? 5.3 ? 3.1
2. **Agent CRUD**: 1.5 ? 4.1 ? 4.2 ? 4.3
3. **Matchmaking**: 6.1 ? 6.2 ? 6.3
4. **Blog**: 7.1 ? 7.2 ? 7.3 ? 7.4
5. **Error Handling**: 10.1 through 10.5
6. **RBAC**: 1.5 ? 8.1 ? 8.4

## Version
- 0.0.3 — RBAC, error handling, 50+ endpoints, 8 microservices
