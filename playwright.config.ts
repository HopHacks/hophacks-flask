// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const FRONTEND_URL = process.env.PW_FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.PW_BACKEND_URL || 'http://localhost:5000';

const FLASK_COMMAND =
  process.env.PW_BACKEND_CMD || 'python -m flask run --host=127.0.0.1 --port=5000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',

  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  //start servers
  webServer: [
    {
      //frontend
      command: process.env.PW_FRONTEND_CMD || 'npm start',
      cwd: './frontend',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        ...process.env,
        REACT_APP_BACKENDURL: BACKEND_URL,
      },
    },
    {
      //backend
      command: FLASK_COMMAND,
      cwd: './api/src',
      url: BACKEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        ...process.env,
        FLASK_APP: 'app.py',
        FLASK_ENV: process.env.FLASK_ENV || 'development',
      },
    },
  ],
});
