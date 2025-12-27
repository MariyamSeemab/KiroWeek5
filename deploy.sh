#!/bin/bash
echo "🚂 Deploying Bambaiyya-Binary to Vercel..."
echo "📦 Installing dependencies..."
npm install
echo "🚀 Deploying to production..."
vercel --prod
echo "✅ Deployment complete!"