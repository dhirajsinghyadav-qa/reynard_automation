// ─────────────────────────────────────────────────────────────
// Jenkinsfile — Playwright Automation Pipeline
// Supports: QA / Staging / Prod environments
// Reports : Allure + JUnit + Playwright HTML
// ─────────────────────────────────────────────────────────────

pipeline {

  agent {
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
      choices: ['qa', 'staging', 'prod'],
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
    NODE_VERSION   = '18'
    ALLURE_RESULTS = 'allure-results'
    REPORT_DIR     = 'playwright-report'

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

    stage('Checkout') {
      steps {
        echo "📥 Checking out branch: ${GIT_BRANCH}"
        checkout scm
      }
    }

    stage('Setup Node.js') {
      steps {
        script {
          // Use nvm if available, otherwise expect node in PATH
          sh '''
            echo "📦 Node version:"
            node --version
            echo "📦 NPM version:"
            npm --version
          '''
        }
      }
    }

    stage('Install Dependencies') {
      steps {
        echo '📦 Installing npm dependencies...'
        sh 'npm ci'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        echo '🌐 Installing Playwright browsers...'
        sh 'npx playwright install --with-deps chromium firefox webkit'
      }
    }

    stage('Lint') {
      steps {
        echo '🔍 Running ESLint...'
        sh 'npm run lint || true'  // non-blocking for now
      }
    }

    stage('Run Tests') {
      steps {
        script {
          // Build the playwright command dynamically
          def grepTag = params.TAG != 'all' ? "--grep @${params.TAG}" : ''
          def project  = params.BROWSER != 'all' ? "--project=${params.BROWSER}" : ''
          def workers  = "--workers=${params.WORKERS}"

          def cmd = "npx playwright test ${grepTag} ${project} ${workers}".trim()

          echo "🚀 Running: ${cmd}"
          echo "🌍 ENV      : ${params.ENV}"
          echo "🌐 Browser  : ${params.BROWSER}"
          echo "🏷️  Tag      : ${params.TAG}"

          sh "ENV=${params.ENV} ${cmd}"
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
