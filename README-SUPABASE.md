# Supabase Integration for Medical Clinic Website

This document explains how to use the Supabase integration for your medical clinic website.

## Prerequisites

1. A Supabase account (free tier available)
2. A Netlify account for deployment
3. Environment variables configured in Netlify

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Note down your project URL and API keys

### 2. Configure Environment Variables in Netlify

In your Netlify site settings, add these environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key
```

### 3. Create Database Tables

Use the SQL queries from `SUPABASE_SETUP.md` to create the required tables in your Supabase database.

### 4. Initialize Database with Sample Data (Optional)

Run the initialization script to populate your database with sample data:

```bash
node scripts/init-supabase.js
```

### 5. Deploy to Netlify

Deploy your site to Netlify. The functions will automatically use the Supabase integration.

## How It Works

### Data Loading

The admin panel loads data from Supabase using the `/api/load-data` endpoint:
- `/api/load-data?type=doctors` - Load doctors
- `/api/load-data?type=services` - Load services
- `/api/load-data?type=news` - Load news
- `/api/load-data?type=settings` - Load site settings

### Data Saving

When you make changes in the admin panel, data is automatically saved to Supabase using the `/api/save-data` endpoint.

## API Endpoints

### GET /api/load-data

Load data from Supabase database.

Parameters:
- `type` - Type of data to load (doctors, services, news, settings)

### POST /api/save-data

Save data to Supabase database.

Body:
```json
{
  "dataType": "doctors",
  "data": [...]
}
```

## Troubleshooting

### Common Issues

1. **Environment variables not set**
   - Make sure SUPABASE_URL and SUPABASE_KEY are set in Netlify

2. **Database tables not created**
   - Run the SQL queries from SUPABASE_SETUP.md

3. **CORS errors**
   - Check that the headers are properly configured in netlify.toml

### Testing Connection

Run the test script to verify your Supabase connection:

```bash
node test-supabase.js
```

## Support

For issues with the Supabase integration, check:
1. Supabase project logs
2. Netlify function logs
3. Environment variable configuration