# SECURITY.md

## Security Best Practices

### ⚠️ Important Security Notes

1. **Never enable `TYPEORM_SYNCHRONIZE=true` in production**
   - This can cause data loss
   - Use proper migrations instead

2. **Generate Strong Secrets**
   ```bash
   # Generate a secure NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

3. **Environment Variables**
   - Never commit `.env` files to version control
   - Use `.env.example` as a template
   - Rotate secrets regularly

4. **CORS Configuration**
   - In production, set `WEB_ORIGIN` to your actual frontend domain
   - Never use wildcards (`*`) in production

5. **Database Security**
   - Use strong passwords for PostgreSQL
   - Never expose database ports publicly
   - Enable SSL/TLS for database connections in production

6. **Authentik Configuration**
   - Use HTTPS for all Authentik endpoints
   - Regularly update Authentik to the latest version
   - Implement proper OAuth2 flow with PKCE

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly.
Do not create public GitHub issues for security vulnerabilities.
