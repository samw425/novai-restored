---
description: STELAR Category Definitions - HOT 500, The Radar, The Pulse algorithms
---

# STELAR Category Algorithms

## The Pulse (Global Rankings)
- **Purpose**: Global artist rankings by monthly listeners
- **Data Source**: `rankings.global`
- **Sort**: By monthly listeners (powerScore)
- **Count**: 3,000+ artists
- **Update Frequency**: Daily

## HOT 500
- **Purpose**: Top 500 hottest SONGS right now
- **NOT artists** - This is a SONGS chart
- **Data Source**: Needs iTunes/Apple Music hot songs API or similar
- **Features Required**:
  - Song name + Artist name
  - Link to artist profile
  - "Watch Video" button (YouTube embed)
  - Album artwork
- **Sort**: By song popularity/streams (hottest tracks)
- **Count**: Exactly 500 songs
- **Update Frequency**: Weekly
- **Style**: Similar to The Pulse but song-focused

## The Radar
- **Purpose**: Top 150 UP AND COMING artists
- **CRITICAL**: NO established/known artists - ONLY emerging talent
- **Data Source**: Proprietary algorithm that searches:
  - TikTok
  - Instagram  
  - SoundCloud
  - Other platforms for viral/trending artists
- **Criteria**:
  - Getting traction on social platforms
  - Not yet mainstream
  - High growth velocity
  - Independent/unsigned preferred
- **Count**: Exactly 150 artists
- **Update Frequency**: Weekly
- **What Makes This Special**: Proprietary discovery algorithm that finds talent BEFORE they blow up

## YouTube API Keys
- 10 API keys configured for rotation
- Located in: `functions/track/[[path]].js`
- Auto-rotates when quota hit

## CRITICAL RULES
- NEVER break Top 50 Songs functionality
- NEVER break The Pulse
- Always test locally before deploying
- NO downtime allowed
