// ─────────────────────────────────────────────────────────────
// Jenkinsfile — Playwright TypeScript Automation Pipeline
// Supports: QA
// Framework: Playwright + TypeScript
// Reports : Allure + Playwright HTML
// ─────────────────────────────────────────────────────────────

pipeline {

  agent any

  // ── Parameters ─────────────────────────────────────────────
  parameters {
    choice(
      name: 'ENV',
      choices: ['qa'],
      description: 'Environment to run tests'
    )
    choice(
      name: 'BROWSER',
      choices: ['chromium', 'firefox', 'webkit', 'all'],
      description: 'Browser to run tests on'
    )
    choice(
      name: 'TAG',
      choices: ['all', 'smoke', 'regression'],
      description: 'Test suite'
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
    NODE_VERSION   = '20.19.0'
    ALLURE_RESULTS = 'allure-results'
    PLAYWRIGHT_HTML_REPORT = 'playwright-report'

    // Jenkins credentials (configure in Jenkins > Manage Credentials)
    BASE_URL_QA = credentials("${params.ENV}-base-url")
    ADMIN_EMAIL = credentials("${params.ENV}-username")
    ADMIN_PASSWORD = credentials("${params.ENV}-password")
  }

  // ── Options ────────────────────────────────────────────────
  options {
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    timestamps()
    // ansiColor('xterm')
  }

  // ── Triggers ───────────────────────────────────────────────
  triggers {
    // Scheduled run every day at midnight
    githubPush()  // Trigger on GitHub push events
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
        bat 'npx playwright install --with-deps'
      }
    }

    stage('Lint') {
      steps {
        echo '🔍 Running ESLint...'
        bat 'npm run lint || true'  // non-blocking for now
      }
    }

    // ── PARALLEL EXECUTION ────────────────────────────────────
    stage('Run Tests (Parallel Browsers)') {
      parallel {

        stage('Chromium') {
          when { expression { params.BROWSER == 'chromium' || params.BROWSER == 'all' } }
          steps {
            script {
              runTests("chromium")
            }
          }
        }

        stage('Firefox') {
          when { expression { params.BROWSER == 'firefox' || params.BROWSER == 'all' } }
          steps {
            script {
              runTests("firefox")
            }
          }
        }

        stage('Webkit') {
          when { expression { params.BROWSER == 'webkit' || params.BROWSER == 'all' } }
          steps {
            script {
              runTests("webkit")
            }
          }
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

// ─────────────────────────────────────────────────────────────
// 🔥 SHARED FUNCTION (Reusable)
// ─────────────────────────────────────────────────────────────
def runTests(String browser) {

  def tagCmd = params.TAG != 'all' ? "--grep \"@${params.TAG}\"" : ''
  def workerCmd = "--workers=${params.WORKERS}"

  def cmd = "npx playwright test --project=${browser} ${tagCmd} ${workerCmd}"

  echo "🚀 Running on ${browser}"
  echo "Command: ${cmd}"

  retry(2) {   // ✅ Retry logic
    bat """
    set ENV=${params.ENV}
    ${cmd}
    """
  }
}