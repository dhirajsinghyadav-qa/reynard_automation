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
      choices: ['all', 'chromium', 'firefox', 'webkit'],
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
    DEFAULT_BROWSERS = "${params.BROWSER ?: 'all'}"

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
  /* triggers {
    // Scheduled run every day at midnight
    cron('H/10 * * * *')
    // Uncomment to trigger on SCM push:
    // pollSCM('H/10 * * * *')
  } */

  // ── Stages ─────────────────────────────────────────────────
  stages {

    stage('Checkout code') {
      steps {
        echo "cloning repository..."
        checkout scm
      }
    }

    stage('Read CI Config') {
      steps {
        script {
          if (fileExists('ci-config.json')) {

            def config = readJSON file: 'ci-config.json'

            env.DYNAMIC_BROWSER = config.browser ?: 'all'
            env.DYNAMIC_TAG     = config.tag ?: 'all'
            env.DYNAMIC_WORKERS = config.workers?.toString() ?: '4'

            echo "✅ CI Config Loaded:"
            echo "Browser : ${env.DYNAMIC_BROWSER}"
            echo "Tag     : ${env.DYNAMIC_TAG}"
            echo "Workers : ${env.DYNAMIC_WORKERS}"

          } else {
            echo "⚠️ ci-config.json not found, using default params"

            env.DYNAMIC_BROWSER = params.BROWSER
            env.DYNAMIC_TAG     = params.TAG
            env.DYNAMIC_WORKERS = params.WORKERS
          }
        }
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

    /* stage('Execute Playwright Tests') {
      steps {
        script {

          def browser = env.DYNAMIC_BROWSER
          def tag     = env.DYNAMIC_TAG
          def workers = env.DYNAMIC_WORKERS

          def grepTag = tag != 'all' ? "--grep \"@${tag}\"" : ''

          def runTest = { browserName ->
            bat """
            echo Running on ${browserName}
            echo Tag: ${tag}, Workers: ${workers}
            npx playwright test ${grepTag} --project=${browserName} --workers=${workers}
            """
          }

          if (browser == 'all') {
            parallel(
              "Chromium": { runTest('chromium') },
              "Firefox" : { runTest('firefox') },
              "WebKit"  : { runTest('webkit') }
            )
          } else {
            runTest(browser)

          }
        }
      }
    } */

    stage('Execute Playwright Tests') {
      steps {
        script {
          def browser = env.DYNAMIC_BROWSER
          def tag     = env.DYNAMIC_TAG
          def workers = env.DYNAMIC_WORKERS

          def grepTag = tag != 'all' ? "--grep \"@${tag}\"" : ""

          def command = ""

          if (browser == 'all') {
            command = "npx playwright test ${grepTag} --workers=${workers}"
          } else if (browser == 'chromium') {
            command = "npx playwright test ${grepTag} --project=chromium --project=chromium-auth --workers=${workers}"
          } else if (browser == 'firefox') {
            command = "npx playwright test ${grepTag} --project=Firefox --project=firefox-auth --workers=${workers}"
          } else if (browser == 'webkit') {
            command = "npx playwright test ${grepTag} --project=webkit --project=webkit-auth --workers=${workers}"
          }

          bat """
          echo Running Playwright Tests
          ${command}
          """
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
        artifacts: 'logs/*.log, test-results/**/*.png, test-results/**/*.webm, test-results/results.json, test-results/screenshots/**, test-results/**/*.zip',
        allowEmptyArchive: true
      )

      // ✅ results.json se flaky + failed summary print karo
      script {
        if (fileExists('test-results/results.json')) {
          try {
            def results    = readJSON file: 'test-results/results.json'
            def failedList = []
            def flakyList  = []
            def passedCount = 0
            def totalCount  = 0

            results.suites?.each { suite ->
              suite.specs?.each { spec ->
                spec.tests?.each { testCase ->
                  totalCount++
                  def allResults = testCase.results ?: []
                  def lastResult = allResults ? allResults.last() : null

                  if (lastResult) {
                    // ── FLAKY: last result passed but had retries ──
                    if (lastResult.status == 'passed' && allResults.size() > 1) {
                      flakyList << [
                        title:       testCase.title,
                        retryCount:  allResults.size() - 1,
                        firstError:  allResults.first()?.error?.message ?: 'No error info',
                      ]
                      passedCount++
                    }
                    // ── FAILED: last result failed ──
                    else if (lastResult.status == 'failed' || lastResult.status == 'timedOut') {
                      failedList << [
                        title:   testCase.title,
                        status:  lastResult.status,
                        error:   lastResult.error?.message  ?: 'No error message',
                        stack:   lastResult.error?.stack    ?: 'No stack trace',
                        retry:   allResults.size() - 1,
                      ]
                    }
                    // ── PASSED ──
                    else if (lastResult.status == 'passed') {
                      passedCount++
                    }
                  }
                }
              }
            }

            // ─────────────────────────────────────────────────
            // PRINT SUMMARY
            // ─────────────────────────────────────────────────
            echo '========================================='
            echo '         TEST EXECUTION SUMMARY          '
            echo '========================================='
            echo "Total    : ${totalCount}"
            echo "Passed   : ${passedCount}"
            echo "Failed   : ${failedList.size()}"
            echo "Flaky    : ${flakyList.size()}"
            echo '========================================='

            // ── FLAKY tests ──
            if (!flakyList.isEmpty()) {
              echo ''
              echo '⚠️  FLAKY TESTS DETECTED:'
              echo '-----------------------------------------'
              flakyList.each { t ->
                echo "TEST       : ${t.title}"
                echo "RETRIES    : ${t.retryCount}"
                echo "FIRST ERROR: ${t.firstError}"
                echo '-----------------------------------------'
              }
            } else {
              echo '✅ No flaky tests detected'
            }

            // ── FAILED tests ──
            if (!failedList.isEmpty()) {
              echo ''
              echo '❌ FAILED TESTS:'
              echo '-----------------------------------------'
              failedList.each { t ->
                echo "TEST   : ${t.title}"
                echo "STATUS : ${t.status}"
                echo "RETRIES: ${t.retry}"
                echo "REASON : ${t.error}"
                echo "STACK  :\n${t.stack}"
                echo '-----------------------------------------'
              }
            } else {
              echo '✅ No failed tests'
            }

          } catch (Exception e) {
            echo "⚠️ Could not parse results.json: ${e.message}"
          }
        } else {
          echo '⚠️ results.json not found'
        }
      }
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
