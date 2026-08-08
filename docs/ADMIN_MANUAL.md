# GoldPay ERP - Admin Manual

## User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Full system access, user management, backup, settings |
| **ADMIN** | All except user deletion, can manage employees |
| **MANAGER** | Inventory, billing, customers, reports |
| **SALES** | Billing, customer management, product lookup |
| **ACCOUNTANT** | Accounting, expenses, reports |
| **STAFF** | Basic operations as assigned |

## Managing Employees

### Adding an Employee
1. Go to **Employees** > **Add Employee**
2. Fill in:
   - Name, email, phone
   - Role (select from dropdown)
   - Initial password
   - Employee ID (optional)
3. Click **Save**
4. The employee can login with their credentials

### Deactivating an Employee
1. Go to **Employees**
2. Click on employee name
3. Click **Deactivate**
4. The employee cannot login until reactivated

## Database Backup

### Automatic Backups
- System creates daily backup at 2:00 AM
- Retention period configured in Settings
- Backups stored in `backups/` directory

### Manual Backup
1. Go to **Settings** > **Backup**
2. Click **Create Backup Now**
3. Wait for confirmation
4. Backup appears in backup list

### Restore from Backup
1. Go to **Settings** > **Backup**
2. Find the backup in list
3. Click **Restore**
4. Confirm restoration
5. System will restore and restart

## Audit Logs

### Viewing Activity Logs
- All user actions are logged
- Track who did what and when
- Access via API: `GET /api/audit-logs`
- Filter by user, action type, date range

### System Logs
- Technical logs for debugging
- Error tracking
- Performance monitoring

## System Configuration

### Environment Variables
All sensitive config in `.env` file:
- Database credentials
- JWT secrets
- Email/SMTP settings
- Cloud storage keys
- Rate limiting parameters

### Maintenance Mode
To enable maintenance mode:
```bash
# Add to .env
MAINTENANCE_MODE=true
```

## Monitoring & Alerts

### System Health
Monitor via:
- Application logs
- Database connection pool
- Redis cache hit ratio
- API response times

### Alert Configuration
- Low stock thresholds: Settings > Notifications
- Payment reminders: Automatic for overdue invoices
- Backup reminders: Configurable frequency

## Security Best Practices

### Password Policy
- Minimum 8 characters
- Should include uppercase, lowercase, number
- Change every 90 days recommended

### Session Management
- Sessions expire after 7 days
- Force logout all users if needed
- Rate limiting on API endpoints

### Data Security
- All passwords hashed with bcrypt (12 rounds)
- JWT tokens for API authentication
- SQL injection prevention via Prisma
- XSS protection built-in
- HTTPS required in production

## Troubleshooting

### Common Issues

**User cannot login:**
- Check account is active
- Verify credentials
- Check if IP is rate-limited

**Products not loading:**
- Check database connection
- Verify Redis is running
- Check browser console for errors

**Invoice not generating:**
- Verify all required fields
- Check stock availability
- Ensure customer exists

### Getting Help
- Check system logs for errors
- Review API responses
- Contact support with error details

## Scaling Tips

### Performance Optimization
1. Enable Redis caching
2. Use CDN for images
3. Implement database indexing
4. Schedule heavy reports off-peak

### Database Growth
1. Archive old invoices quarterly
2. Clean activity logs monthly
3. Monitor database size
4. Plan for archiving strategy
