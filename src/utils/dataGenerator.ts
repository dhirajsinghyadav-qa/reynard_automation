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

    // 1. Unregistered email valid password
    unregisteredEmail: {
      email: 'invalid@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      description: 'Unregistered email with valid password',
    },
    // 2. Valid email invalid password
    wrongPassword: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: 'Wrong@12345',
      description: 'Valid email with invalid password',
    },
    // 3. Invalid email format
    invalidEmailFormat: {
      email: 'abc@com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      description: 'Invalid email format',
    },

    // 4. Empty email
    emptyEmail: {
      email: '',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      description: 'Empty email',
    },

    // 5. Empty password
    emptyPassword: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: '',
      description: 'Empty password',
    },

    // 6. Leading trailing spaces in email and password
    leadingTrailingSpaces: {
      email: ' johan.piet@reynard.nl ',
      password: ' Admin@12345 ',
      description: 'Email and password with leading and trailing spaces',
    },

    // 7. Password less than 8 characters
    passwordLessThan8: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: 'Admin',
      description: 'Password less than 8 characters',
    },

    // 8. Password more than 16 characters
    passwordMoreThan16: {
      email: 'valid@gmail.com',
      password: '1234567890123456789',
      description: 'Password more than 16 characters',
    },

    // 9. Password without uppercase
    passwordWithoutUppercase: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: 'admin@12345',
      description: 'Password without uppercase letter',
    },

    // 10. Password without symbol
    passwordWithoutSymbol: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: 'Admin123456',
      description: 'Password without special symbol',
    },

    // 11. Password without number
    passwordWithoutNumber: {
      email: process.env.ADMIN_EMAIL || 'johan.piet@reynard.nl',
      password: 'Admin@admin',
      description: 'Password without number',
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
