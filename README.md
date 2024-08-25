# ai-tutor3

![Banner](https://github.com/user-attachments/assets/0bef7def-b75d-4ace-8c8f-bde145ea7949 =300x169)

AI-powered learning with blockchain credibility

Demo: https://ai-tutor3-web.vercel.app/

## Description

This web application combines AI-powered personalized tutoring, blockchain-based verification, and practical skill demonstration to provide a comprehensive solution for modern education. Let's explore the key features and their potential impact:

## AI-Powered Personalization

### Custom AI Tutors

The application allows students to create or choose from specialized AI tutors for different subjects. These tutors adapt to individual learning styles, providing personalized instruction tailored to each student's needs.

### Interactive Quizzes

Dynamic quizzes that adjust difficulty based on user performance ensure optimal knowledge retention and skill development. This adaptive approach helps students learn at their own pace while continuously challenging them to improve.

## Blockchain Integration

### Blockchain-Verified Certificates

Upon completing courses or mastering skills, students can mint NFT certificates. These on-chain verifications serve as tamper-proof credentials, enhancing the value and credibility of their achievements.

## AI-Enhanced Career Development

### AI-Powered Resume Builder

The platform's AI-powered resume builder generates professional curricula vitae by incorporating users' personal information, skills, and achievements. This feature helps students showcase their verified accomplishments and skills effectively to potential employers or educational institutions.

## Community Engagement

### Community-Driven Content

Students can create and share their own AI tutors, fostering a collaborative learning environment. This feature expands the platform's educational offerings and encourages peer-to-peer learning.

## Gamification

### Experience Points and Leveling System

The application incorporates gamification elements, allowing users to gain experience points and level up as they perform learning actions. This feature adds an engaging and motivational aspect to the learning process.

## Impact and Benefits

- **Personalized Learning**: The AI tutors and adaptive quizzes cater to individual learning needs.
- **Credential Verification**: Blockchain-verified certificates provide a secure and transparent way to validate educational achievements.
- **Skill Demonstration**: The AI resume builder helps students showcase their skills and achievements to potential employers.
- **Community Building**: The platform fosters a collaborative learning environment through user-generated content and peer interaction.
- **Engagement and Motivation**: Gamification elements like experience points and leveling up can increase user engagement and motivation to learn.

This web application addresses key challenges in personalization, credential verification, and skill demonstration, providing a comprehensive and engaging learning ecosystem.

## Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## App Structure

The app is structured into the following components:

- `apps/web`: This is the main web application.
- `apps/web/src`: This is the source code for the web application.
- `apps/web/src/app`: This is the main application code.
- `apps/web/src/app/contexts`: This is where the application contexts are defined.
- `apps/web/src/app/contexts/CreditsContext.tsx`: This is the credits context file.
- `apps/web/src/app/credits`: This is the credits page.
- `apps/web/src/app/credits/page.tsx`: This is the credits page file.
- `apps/web/src/app/layout.tsx`: This is the main layout file.
- `apps/web/src/app/actions`: This is where the application actions are defined.
- `apps/web/src/app/actions/db.ts`: This is the database actions file.
- `apps/web/src/components`: This is where the application components are defined.
- `apps/web/src/components/header.tsx`: This is the header component file.
