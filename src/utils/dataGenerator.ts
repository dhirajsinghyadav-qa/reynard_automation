/**
 * Test Data Factory
 *
 * Generates realistic test data for different test scenarios.
 * Follows the Factory Pattern to create consistent, reusable test data.
 */

// ============================================================================
// CREDENTIAL DATA TYPES
// ============================================================================

export interface Credentials {
  email: string;
  password: string;
  description?: string;
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
}

// ============================================================================
// VALID CREDENTIALS FACTORY
// ============================================================================

export const validCredentialsFactory = (): Credentials => {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@mailinator.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@2025',
    description: 'Valid admin credentials',
  };
};

export const validUserCredentialsFactory = (): Credentials => {
  return {
    email: process.env.VALID_USER_EMAIL || 'user@mailinator.com',
    password: process.env.VALID_USER_PASSWORD || 'User@2025',
    description: 'Valid regular user credentials',
  };
};

// ============================================================================
// INVALID CREDENTIALS FACTORY
// ============================================================================

export const invalidCredentialsFactory = (type: string = 'default'): Credentials => {
  const scenarios: { [key: string]: Credentials } = {
    default: {
      email: 'invalid@mailinator.com',
      password: 'WrongPassword123',
      description: 'Invalid credentials',
    },
    wrongPassword: {
      email: process.env.ADMIN_EMAIL || 'admin@mailinator.com',
      password: 'WrongPassword123',
      description: 'Correct email, wrong password',
    },
    wrongEmail: {
      email: 'nonexistent@mailinator.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@2025',
      description: 'Wrong email, correct password',
    },
    emptyEmail: {
      email: '',
      password: process.env.ADMIN_PASSWORD || 'Admin@2025',
      description: 'Empty email',
    },
    emptyPassword: {
      email: process.env.ADMIN_EMAIL || 'admin@mailinator.com',
      password: '',
      description: 'Empty password',
    },
    bothEmpty: {
      email: '',
      password: '',
      description: 'Both email and password empty',
    },
    invalidEmailFormat: {
      email: 'invalid-email',
      password: process.env.ADMIN_PASSWORD || 'Admin@2025',
      description: 'Invalid email format',
    },
    sqlInjection: {
      email: "admin' OR '1'='1",
      password: "' OR '1'='1",
      description: 'SQL injection attempt',
    },
    scriptInjection: {
      email: "<script>alert('xss')</script>",
      password: "<script>alert('xss')</script>",
      description: 'Script injection attempt',
    },
    longString: {
      email: `${'a'.repeat(200)}@mailinator.com`,
      password: 'b'.repeat(200),
      description: 'Very long input string',
    },
    passwordWithSpaces: {
      email: process.env.ADMIN_EMAIL || 'admin@mailinator.com',
      password: '   Admin@2025   ',
      description: 'Password with leading and trailing spaces',
    },
    specialCharacters: {
      email: 'test+tag@mailinator.com',
      password: 'Pass@123!#$%^',
      description: 'Special characters in credentials',
    },
  };

  return scenarios[type] || scenarios.default;
};

// ============================================================================
// TEST USER FACTORY
// ============================================================================

export const testUserFactory = (
  role: 'admin' | 'user' | 'viewer' = 'user',
  id: string = '1',
): TestUser => {
  const users: { [key: string]: TestUser } = {
    admin: {
      id,
      email: process.env.ADMIN_EMAIL || 'admin@mailinator.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@2025',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
    user: {
      id,
      email: process.env.VALID_USER_EMAIL || 'user@mailinator.com',
      password: process.env.VALID_USER_PASSWORD || 'User@2025',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      isActive: true,
    },
    viewer: {
      id,
      email: `viewer${id}@mailinator.com`,
      password: 'Viewer@2025',
      firstName: 'Viewer',
      lastName: 'User',
      role: 'viewer',
      isActive: true,
    },
  };

  return users[role];
};

// ============================================================================
// BULK DATA FACTORY
// ============================================================================

export const bulkTestUsersFactory = (count: number = 5): TestUser[] => {
  const users: TestUser[] = [];
  const roles: Array<'admin' | 'user' | 'viewer'> = ['admin', 'user', 'viewer'];

  for (let i = 1; i <= count; i++) {
    const roleIndex = (i - 1) % roles.length;
    users.push(testUserFactory(roles[roleIndex], `user-${i}`));
  }

  return users;
};

// ============================================================================
// SCENARIO DATA FACTORIES
// ============================================================================

export const loginTestScenariosFactory = (): {
  name: string;
  credentials: Credentials;
  expectedResult: 'success' | 'failure';
}[] => {
  return [
    {
      name: 'Valid Admin Login',
      credentials: validCredentialsFactory(),
      expectedResult: 'success',
    },
    {
      name: 'Valid User Login',
      credentials: validUserCredentialsFactory(),
      expectedResult: 'success',
    },
    {
      name: 'Invalid Credentials',
      credentials: invalidCredentialsFactory('wrongPassword'),
      expectedResult: 'failure',
    },
    {
      name: 'Empty Email',
      credentials: invalidCredentialsFactory('emptyEmail'),
      expectedResult: 'failure',
    },
    {
      name: 'Empty Password',
      credentials: invalidCredentialsFactory('emptyPassword'),
      expectedResult: 'failure',
    },
    {
      name: 'Special Characters in Password',
      credentials: invalidCredentialsFactory('specialCharacters'),
      expectedResult: 'success', // If password allows special chars
    },
  ];
};

// ============================================================================
// RANDOM DATA GENERATORS
// ============================================================================

export const randomEmailFactory = (domain: string = 'test.com'): string => {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `user_${randomString}@${domain}`;
};

export const randomPasswordFactory = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ============================================================================
// EXPORT FACTORY BUILDER
// ============================================================================

export const DataFactory = {
  validCredentials: validCredentialsFactory,
  validUserCredentials: validUserCredentialsFactory,
  invalidCredentials: invalidCredentialsFactory,
  testUser: testUserFactory,
  bulkTestUsers: bulkTestUsersFactory,
  loginScenarios: loginTestScenariosFactory,
  randomEmail: randomEmailFactory,
  randomPassword: randomPasswordFactory,
};
