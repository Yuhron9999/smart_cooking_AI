# 📋 Sample Issues để tạo trên GitHub

## 🐛 Bug Report Sample

**Title:** [BUG] Mobile app crashes when switching languages in settings

**Body:**

```
## 🐛 Bug Description
The mobile app crashes immediately when user tries to change language from Vietnamese to English in the settings screen.

## 📱 Platform/Component
- [x] 📱 Mobile App (Flutter)

## 🔄 Steps to Reproduce
1. Open Smart Cooking AI mobile app
2. Navigate to Settings screen
3. Tap on Language settings
4. Select 'English' from Vietnamese
5. App crashes immediately

## ✅ Expected Behavior
App should smoothly change language and update all UI text to English.

## ❌ Actual Behavior
App crashes with white screen and returns to home screen.

## 🌍 Environment
### Mobile Device
- Device: Samsung Galaxy S21
- OS: Android 12
- App Version: 1.0.0

## 🌐 Language/Locale
- Current Language: vi (Vietnamese)
- Target Language: en (English)
- Region: VN

## 📈 Priority
- [x] 🟠 High (major feature broken)
```

## ✨ Feature Request Sample

**Title:** [FEATURE] Add voice-guided cooking instructions

**Body:**

```
## ✨ Feature Summary
Add voice-guided step-by-step cooking instructions that users can activate during cooking.

## 📱 Component/Platform
- [x] 🌐 Web Frontend (Next.js)
- [x] 📱 Mobile App (Flutter)
- [x] 🤖 AI Service (FastAPI)
- [x] 🗣️ Voice Assistant

## 🎯 Problem/Need
**Is your feature request related to a problem?**
Yes, users often have their hands dirty while cooking and cannot easily read instructions on screen or scroll through steps.

## 💡 Proposed Solution
Implement text-to-speech functionality that reads cooking instructions aloud, with voice commands to navigate between steps.

## 🔄 User Story
**As a home cook, I want voice-guided cooking instructions so that I can follow recipes hands-free while my hands are busy cooking.**

## 🤖 AI/ML Requirements
- [x] Natural Language Processing
- [x] Speech Recognition/Synthesis
- [x] OpenAI integration

## 📱 Mobile Considerations
- [x] Cross-platform
- [x] Offline functionality
- [x] Microphone access

## 📈 Priority/Impact
- [x] 🟠 High (significant improvement)

**Expected user impact:**
- [x] All users

## 📋 Acceptance Criteria
- [ ] Users can activate voice mode from any recipe
- [ ] Voice clearly reads each cooking step
- [ ] Voice commands "next step", "previous step", "repeat" work
- [ ] Works in multiple languages (vi, en, ja)
- [ ] Hands-free navigation through entire recipe
```

## 📚 Documentation Sample

**Title:** [DOCS] Add comprehensive API documentation for AI endpoints

**Body:**

```
## 📚 Documentation Type
- [x] 📖 New documentation
- [x] 📊 API documentation

## 📍 Location/Section
- [x] API documentation
- [x] AI integration guides

## 📝 Current Issue
- [x] Information is missing
- [x] Missing examples

## ✨ Proposed Changes
Create comprehensive API documentation for all AI service endpoints including:
- Recipe generation endpoints
- Image recognition endpoints
- Voice processing endpoints
- Chat/conversation endpoints

Each endpoint should include:
- Request/response schemas
- Authentication requirements
- Code examples in multiple languages
- Error handling examples
- Rate limiting information

## 🎯 Target Audience
- [x] New developers
- [x] Experienced developers

## 🌍 Language/Localization
- [x] English documentation
- [x] Vietnamese translation

## 📖 Content Suggestions
Include interactive API explorer, request/response examples, and integration tutorials for each programming language.

## 📈 Priority
- [x] 🟠 High (important for users)
```
