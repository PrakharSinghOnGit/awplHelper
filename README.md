# AWPL Helper

A comprehensive web application designed to help AWPL leaders manage and monitor their team members' performance data efficiently.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Business Logic](#business-logic)
- [Billing System](#billing-system)
- [Development](#development)
- [Contributing](#contributing)

## Overview

AWPL Helper is a SaaS application that automates data fetching and management for AWPL (Multi-Level Marketing) leaders. Instead of manually checking individual team member data on the official AWPL website, leaders can now manage their entire team through a centralized dashboard.

## Problem Statement

Previously, AWPL leaders faced several challenges:

- **Manual Data Collection**: Leaders had to manually visit the AWPL website with each member's credentials to check their performance
- **Time Consuming**: Managing large teams (60+ members) was extremely time-intensive
- **Communication Overhead**: Leaders had to contact developers via WhatsApp for any team changes
- **No Centralized View**: No single place to see all team members' data at once
- **Limited Historical Data**: Difficult to track performance trends over time

## Solution

AWPL Helper provides:

- **Automated Data Fetching**: Uses Puppeteer to automatically collect data from AWPL website
- **Centralized Dashboard**: Single interface to view all team members' performance
- **Self-Service Management**: Leaders can add/remove team members independently
- **Real-Time Updates**: Weekly automated data updates for all members
- **Performance Tracking**: Historical data for the last 4 weeks
- **Scalable Billing**: Pay-per-member pricing model

## Features

### For Leaders

- **Team Dashboard**: View all team members' performance at a glance
- **Member Management**: Add, edit, and remove team members
- **Performance Analytics**: Track levels, targets, and achievements
- **Cheque Data**: Monitor earnings and payment status
- **Automatic Updates**: Weekly data refresh without manual intervention
- **Level Tracking**: Visual representation of member levels with tier-based effects

### For Administrators

- **Automated Data Mining**: Puppeteer-based data collection from AWPL website
- **Billing Management**: Track usage and generate invoices
- **System Analytics**: Monitor app usage and performance
- **User Management**: Handle leader accounts and permissions

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Modern UI component library

### Backend & Database

- **Supabase** - PostgreSQL database with real-time features
- **Next.js API Routes** - Server-side logic
- **React Query** - Data fetching and caching

### Authentication & Security

- **Supabase Auth** - User authentication and authorization
- **Row Level Security (RLS)** - Database-level security

### Data Processing

- **Puppeteer** - Web scraping for AWPL data
- **Axios** - HTTP client for API requests

## Database Schema

### Core Tables

#### `profiles`

- **Purpose**: Leader accounts and their AWPL credentials
- **Key Fields**: `id`, `name`, `awpl_id`, `awpl_pass`, `level_SAO`, `level_SGO`, `target_SAO`, `target_SGO`

#### `members`

- **Purpose**: Individual team members and their performance data
- **Key Fields**: `id`, `awpl_id`, `awpl_pass`, `name`, `levelSao`, `levelSgo`, `targetSao`, `targetSgo`, `chequeData`, `status_flag`

#### `leader_members`

- **Purpose**: Many-to-many relationship between leaders and their team members
- **Key Fields**: `leader_id`, `member_id`

### Data Relationships

```
profiles (leaders) ←→ leader_members ←→ members (team members)
     1                      M:N                    1
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- AWPL credentials for testing

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PrakharSinghOnGit/awplHelper.git
   cd awplHelper
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**

   - Run the SQL schema in your Supabase dashboard
   - Enable Row Level Security (RLS)
   - Set up authentication policies

5. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Routes

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Team Management

- `GET /api/members` - Fetch team members
- `POST /api/members` - Add new team member
- `PUT /api/members/:id` - Update member data
- `DELETE /api/members/:id` - Remove team member

### Data Updates

- `POST /api/update-data` - Trigger data refresh for all members
- `GET /api/member-data/:awplId` - Fetch latest data for specific member

## Business Logic

### Member Management Flow

1. **Adding a Member**

   ```typescript
   if (memberExists(awplId)) {
     // Add to leader's team
     addToTeam(leaderId, memberId);
   } else {
     // Create new member and add to team
     const member = createMember(memberData);
     addToTeam(leaderId, member.id);
   }
   ```

2. **Password Management**

   - Multiple valid passwords stored in `valid_passwords` array
   - Automatic password validation during data mining
   - Flag system for invalid credentials

3. **Level Calculation**

   ```typescript
   const level = calcLevel(saoValue, sgoValue);
   // Returns level based on achievement targets
   ```

### Data Mining Process

1. **Weekly Automation**: Puppeteer scripts fetch data for all members
2. **Credential Validation**: Try primary password, then valid_passwords array
3. **Data Updates**: Update member records with latest performance data
4. **Error Handling**: Flag members with invalid credentials

## Billing System

### Pricing Model

- **₹5 per member per week**
- **₹20 per member per month** (4 weeks)
- Automatic billing based on team size

### Payment Features

- Usage tracking and analytics
- Automated invoice generation
- Payment status monitoring
- Flexible billing cycles

## Development

### Database Hooks

```typescript
// Fetch current user's profile
const { data: profile } = useUserProfile();

// Manage team members
const { data: members } = useMembers();
const createMember = useCreateMember();
const updateMember = useUpdateMember();

// Custom queries
const { data } = useCustomQuery(["key"], async (supabase) => {
  // Custom Supabase query
});
```

### Level System

- 19 different levels from "Fresher" to "Brand Ambassador"

### Real-time Features

- React Query for data synchronization
- Supabase real-time subscriptions
- Optimistic updates for better UX

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for AWPL Leaders**

_Empowering team management through automation and analytics_
