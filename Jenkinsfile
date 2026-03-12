// ─────────────────────────────────────────────────────────────
// Jenkinsfile — Playwright TypeScript Automation Pipeline
// Supports: QA
// Framework: Playwright + TypeScript
// Reports : Allure + Playwright HTML
// ─────────────────────────────────────────────────────────────

pipeline {

  agent any {
    // Option 1: Run on any agent with Node.js installed
    label 'playwright-node'

    // Option 2: Use Docker (recommended for consistency)
    // docker {
    //   image 'mcr.microsoft.com/playwright:v1.44.0-jammy'
    //   args '--ipc=host -u root'
    // }
  }

  // ── Parameters ─────────────────────────────────────────────
  parameters {
    choice(
      name: 'ENV',
      choices: ['qa'],
      description: 'Target environment'
    )
    choice(
      name: 'BROWSER',
      choices: ['chromium', 'firefox', 'webkit', 'all'],
      description: 'Browser to run tests on'
    )
    choice(
      name: 'TAG',
      choices: ['all', 'smoke', 'regression'],
      description: 'Test tag / suite to run'
    )
    booleanParam(
      name: 'HEADLESS',
      defaultValue: true,
      description: 'Run in headless mode'
    )
    string(
      name: 'WORKERS',
      defaultValue: '4',
      description: 'Number of parallel workers'
    )
  }

  // ── Environment ────────────────────────────────────────────
  environment {
    ENV            = "${params.ENV}"
    HEADLESS       = "${params.HEADLESS}"
    CI             = 'true'
    NODE_ENV       = 'test'
    NODE_VERSION   = '18'
    ALLURE_RESULTS = 'allure-results'
    PLAYWRIGHT_HTML_REPORT = 'playwright-report'

    // Jenkins credentials (configure in Jenkins > Manage Credentials)
    BASE_URL = credentials("${params.ENV}-base-url")
    USERNAME = credentials("${params.ENV}-username")
    PASSWORD = credentials("${params.ENV}-password")
  }

  // ── Options ────────────────────────────────────────────────
  options {
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    timestamps()
    ansiColor('xterm')
  }

  // ── Triggers ───────────────────────────────────────────────
  triggers {
    // Scheduled run every day at midnight
    cron('0 0 * * *')
    // Uncomment to trigger on SCM push:
    // pollSCM('H/5 * * * *')
  }

  // ── Stages ─────────────────────────────────────────────────
  stages {

    stage('Checkout code') {
      steps {
        echo "cloning repository..."
        checkout scm
      }
    }

    stage('Verify Node Installation') {
      steps {

        bat '''
        echo Node Version
        node -v

        echo NPM Version
        npm -v
        '''

      }
    }

    stage('Install NPM Dependencies') {
      steps {
        echo '📦 Installing dependencies...'
        bat 'npm ci'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        echo '🌐 Installing Playwright browsers...'
        bat 'npx playwright install --with-deps chromium firefox webkit'
      }
    }

    stage('Lint') {
      steps {
        echo '🔍 Running ESLint...'
        bat 'npm run lint || true'  // non-blocking for now
      }
    }

    stage('Execute Playwright Tests') {
      steps {
        script {
          // Build the playwright command dynamically
          def grepTag = params.TAG != 'all' ? "--grep @${params.TAG}" : ''
          def project  = params.BROWSER != 'all' ? "--project=${params.BROWSER}" : ''
          def workers  = "--workers=${params.WORKERS}"

          def cmd = "npx playwright test ${grepTag} ${project} ${workers}".trim()

          echo "🚀 Running command: ${cmd}"
          echo "🌍 ENV      : ${params.ENV}"
          echo "🌐 Browser  : ${params.BROWSER}"
          echo "🏷️  Tag      : ${params.TAG}"

          bat """
          set ENV=${params.ENV}
          ${cmd}
          """
        }
      }
      post {
        always {
          echo '📊 Test execution complete'
        }
      }
    }

    stage('Generate Allure Report') {
      steps {
        script {
          if (fileExists('allure-results')) {
            allure([
              includeProperties: false,
              jdk: '',
              properties: [],
              reportBuildPolicy: 'ALWAYS',
              results: [[path: 'allure-results']]
            ])
            echo '✅ Allure report generated'
          } else {
            echo '⚠️ No allure-results found, skipping report'
          }
        }
      }
    }
  }

  // ── Post Actions ───────────────────────────────────────────
  post {
    always {
      echo '📋 Archiving test artifacts...'

      // Publish JUnit results
      junit(
        testResults: 'test-results/junit-report.xml',
        allowEmptyResults: true
      )

      // Archive Playwright HTML report
      publishHTML(target: [
        allowMissing         : true,
        alwaysLinkToLastBuild: true,
        keepAll              : true,
        reportDir            : 'playwright-report',
        reportFiles          : 'index.html',
        reportName           : 'Playwright HTML Report',
        reportTitles         : ''
      ])

      // Archive logs
      archiveArtifacts(
        artifacts: 'logs/*.log, test-results/**/*.png, test-results/**/*.webm',
        allowEmptyArchive: true
      )
    }

    success {
      echo '✅ Pipeline PASSED!'
      // Uncomment to send email on success:
      // emailext(
      //   subject: "✅ [PASSED] ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${params.ENV}",
      //   body: "All tests passed. Report: ${env.BUILD_URL}",
      //   to: 'team@example.com'
      // )
    }

    failure {
      echo '❌ Pipeline FAILED!'
      // Uncomment to send email on failure:
      // emailext(
      //   subject: "❌ [FAILED] ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${params.ENV}",
      //   body: "Tests failed. Report: ${env.BUILD_URL}allureReport/",
      //   to: 'team@example.com'
      // )
    }

    unstable {
      echo '⚠️ Pipeline UNSTABLE (some tests failed)'
    }

    cleanup {
      echo '🧹 Cleanup complete'
      cleanWs(
        cleanWhenAborted: true,
        cleanWhenFailure: false,
        cleanWhenNotBuilt: true,
        cleanWhenSuccess: true,
        cleanWhenUnstable: false
      )
    }
  }
}
