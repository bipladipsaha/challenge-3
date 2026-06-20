# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of CarbonIQ AI seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities.
2. Email us at **security@carboniq.ai** with the subject line: `[SECURITY] Brief Description`.
3. Include the following details:
   - Type of vulnerability (e.g., XSS, SQL Injection, CSRF)
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Action                    | Timeline        |
| ------------------------- | --------------- |
| Acknowledgment            | Within 24 hours |
| Initial assessment        | Within 48 hours |
| Fix development           | Within 7 days   |
| Security advisory release | Within 14 days  |

### Security Measures

CarbonIQ AI implements the following security measures:

- **Authentication**: JWT with refresh token rotation, bcrypt password hashing
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schema validation on all endpoints
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Prevention**: Content Security Policy (CSP), input sanitization
- **CSRF Protection**: SameSite cookies, CSRF tokens
- **Rate Limiting**: Express rate limiter on all API endpoints
- **Headers**: Helmet.js for security headers
- **CORS**: Strict origin configuration
- **Secrets Management**: Environment variables, no hardcoded credentials
- **Dependency Scanning**: Dependabot, CodeQL, npm audit
- **HTTPS**: Enforced in production via Nginx

### OWASP Top 10 Compliance

| Risk                          | Mitigation                                  |
| ----------------------------- | ------------------------------------------- |
| A01 Broken Access Control     | RBAC, JWT validation, resource ownership     |
| A02 Cryptographic Failures    | bcrypt, TLS, secure cookie flags             |
| A03 Injection                 | Prisma ORM, Zod validation, CSP             |
| A04 Insecure Design           | Threat modeling, security reviews            |
| A05 Security Misconfiguration | Helmet, env-based config, no defaults        |
| A06 Vulnerable Components     | Dependabot, npm audit, CodeQL               |
| A07 Auth Failures             | JWT rotation, account lockout, MFA-ready     |
| A08 Data Integrity Failures   | Input validation, signed tokens              |
| A09 Logging Failures          | Structured logging with Pino, audit logs     |
| A10 SSRF                      | URL validation, allowlisting                 |

## Bug Bounty

Currently, we do not have a formal bug bounty program, but we sincerely appreciate responsible disclosure and will acknowledge contributors in our security advisories.
