# Iris — AI Student Productivity Assistant

Iris is an AI-powered academic assistant that reads your Canvas courses, assignments, and announcements, then sends you a daily morning text with exactly what you need to know. No noise. Just what matters.

This is a personal project I'm working on.

## Why I'm building it

I noticed it's easy to get mixed around or confused when you're juggling a lot of classes scattered over many different websites — Canvas, email, your calendar, syllabus PDFs. Things slip through the cracks. Iris pulls all of that into one place so you can stop hunting for what's due and just focus on doing it.

## What it does

- Syncs Canvas data via a Chrome extension using your existing browser session
- Generates a personalized daily briefing using xAI Grok
- Texts you every morning at your chosen time via Twilio SMS
- Lets you ask questions about your schedule and deadlines from the dashboard
- Learns your priorities, stressors, and tone from onboarding

## What it uses

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: xAI Grok
- **SMS**: Twilio
- **Styling**: Tailwind CSS
- **Chrome Extension**: Manifest V3
- **Deployment**: Vercel
