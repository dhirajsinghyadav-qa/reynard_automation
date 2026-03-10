# Reynard Playwright TypeScript Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-Automation-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Framework-blue)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen)
![CI/CD](https://img.shields.io/badge/Jenkins-CI%2FCD-red)
![License](https://img.shields.io/badge/license-ISC-orange)

A **Playwright + TypeScript based end-to-end automation testing framework** designed for scalable UI testing with **Page Object Model, centralized test data generation, structured logging, environment-based configuration, and Jenkins CI/CD integration**.

This framework is structured to support **maintainable automation, cross-browser execution, robust reporting, and CI-ready pipelines**.

---

# Table of Contents

- Project Overview
- Framework Structure
- Prerequisites
- Installation
- Environment Setup
- Running Tests
- Test Data & Utilities
- Reporting
- Linting & Formatting
- CI/CD Pipeline
- Best Practices
- Notes
- Author
- License

---

# Project Overview

This framework provides a **scalable automation architecture** for web application testing using **Playwright and TypeScript**.

The goal is to maintain **clean test design, reusable utilities, centralized configuration, and CI-ready automation pipelines**.

### Key Features

- **Page Object Model (POM)** for maintainable test structure
- **Centralized DataFactory** for generating valid and invalid test data
- **Custom Helper utilities** for common actions
- **Structured logging system** for test execution
- **Environment-based configuration using `.env`**
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Allure reporting integration**
- **Jenkins CI/CD pipeline support**
- **Linting and formatting with ESLint + Prettier**
- **Failure artifacts (screenshots, videos, traces)**

---

# Framework Structure

```
.
├── src/
│
│   ├── config/
│   │   └── env.ts                 # Environment configuration loader
│
│   ├── fixtures/
│   │   ├── baseTest.ts
│   │   └── pageObjectsFixture.ts # Custom Playwright fixtures
│
│   ├── pages/
│   │   ├── LoginPage.ts          # Login Page Object
│   │   └── Settings.ts           # Settings Page Object (placeholder)
│
│   ├── tests/
│   │   └── login.spec.ts         # Login test scenarios
│
│   ├── utils/
│   │   ├── dataGenerator.ts      # DataFactory for dynamic test data
│   │   ├── helpers.ts            # Helper utilities (actions, random data)
│   │   └── logger.ts             # Structured logger
│
├── env/
│   └── .env                      # Environment variable template
│
├── logs/                         # Runtime logs
│
├── test-results/
│   └── .last-run.json            # Playwright last run metadata
│
├── global-setup.ts               # Pre-test global setup
├── playwright.config.ts          # Playwright configuration
├── Jenkinsfile                   # Jenkins CI/CD pipeline
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json                # ESLint rules
├── .prettierrc.json              # Prettier formatting rules
├── .gitignore
└── README.md
```

---

# Prerequisites

Before running the framework ensure the following tools are installed:

- **Node.js >= 18**
- **npm >= 9**
- **Playwright browsers**
- **nvm (optional)** for Node version management
- **Jenkins** (optional for CI/CD)
- **Allure Commandline**

Install Allure CLI globally:

```bash
npm install -g allure-commandline --save-dev
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
cd reynard-playwright-jenkins-framework
```

Install project dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install --with-deps
```

---

# Environment Setup

Copy the environment template:

```bash
cp env/.env .env.local
```

Add environment variables:

```
BASE_URL=https://example.com

ADMIN_EMAIL=email
ADMIN_PASSWORD=password

TEST_ENV=qa
```

Environment variables can also be configured through **Jenkins credentials or CI/CD pipelines**.

---

# Running Tests

Run all tests:

```bash
npm test
```

Run tests with browser UI:

```bash
npm run test:headed
```

Run specific test file:

```bash
npm run test:login
```

Run tagged tests:

```bash
npm run test:smoke
npm run test:regression
```

Run tests in specific environments:

```bash
npm run test:qa
npm run test:staging
npm run test:prod
```

Debug mode:

```bash
npm run test:debug
```

---

# Test Data & Utilities

### DataFactory

`DataFactory` provides reusable test data generators:

- Valid admin and user credentials
- Invalid login scenarios
- Empty input tests
- Injection test values
- Random email and password generation
- Bulk test users

Example:

```ts
const user = DataFactory.randomUser();
```

---

### Helpers

Helper utilities provide reusable browser actions:

- clickElement
- typeText
- waitForElement
- random data generators
- file upload helper
- retry logic
- timestamp utilities

---

### Logger

Structured logging is provided via a custom logger:

- INFO
- WARN
- ERROR

Logs are written to the **logs/** folder during execution.

Example:

```ts
logger.info('Login test started');
```

---

# Reporting

### Allure Reports

Generate report:

```bash
npm run allure:generate
```

Open report:

```bash
npm run allure:open
```

---

### Playwright HTML Report

Generate report:

```bash
npm run report
```

Failure artifacts are captured automatically:

- Screenshot → `only-on-failure`
- Video → `retain-on-failure`
- Trace → `retain-on-failure`

---

# Linting & Formatting

Run ESLint:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

Format code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

---

# CI/CD Pipeline (Jenkins)

This framework includes **Jenkins pipeline automation** using `Jenkinsfile`.

Supported pipeline parameters:

- ENV
- BROWSER
- TAG
- HEADLESS
- WORKERS

### Pipeline Workflow

1. Checkout repository
2. Setup Node.js
3. Install dependencies
4. Install Playwright browsers
5. Run ESLint
6. Execute tests
7. Generate Allure report
8. Archive logs and artifacts

Artifacts stored by pipeline:

- Test logs
- Screenshots
- Videos
- Allure results
- JUnit reports

---

# Best Practices

Follow these guidelines when extending the framework:

- Use **Page Object Model** for all UI interactions
- Reuse **DataFactory** for test data
- Avoid hardcoded values in tests
- Use **Logger instead of console.log**
- Apply retry logic for flaky interactions
- Always commit **linted and formatted code**
- Store sensitive credentials in `.env` or CI secrets
- Keep tests **independent and atomic**

---

# Notes

- Framework supports **cross-browser testing** (Chromium, Firefox, WebKit).
- Environment configuration is centralized via `.env`.
- Global setup automatically creates the **logs/** directory.
- Additional modules can be added under `pages/` and `tests/`.
- The framework is designed to be easily extendable for **large automation suites**.

---

# Author

**Dhirajsingh Yadav – KiwiQA**

Automation QA Engineer specializing in **Playwright + TypeScript test automation frameworks**.

---

# License

This project is licensed under the **ISC License**.
