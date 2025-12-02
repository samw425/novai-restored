#!/bin/bash
timestamp=$(date "+%Y-%m-%d %H:%M:%S")
git add .
git commit -m "Auto-save: $timestamp"
echo "✅ Work saved at $timestamp"
