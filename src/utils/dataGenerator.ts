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

// ============================================================================
// COMPANY DATA TYPES
// ============================================================================

export interface CompanyData {
  usualFirstName: string;
  firstNamePassport: string;
  lastNamePassport: string;
  email: string;
  password: string;
  country: string;
  companyName: string;
  logoPath: string;
  address: string;
  contactCountry: string;
  contactNumber: string;
  emergencyContactCountry?: string;
  emergencyContactNumber?: string;
  description?: string;
}

// ============================================================================
// VALID CREDENTIALS FACTORY (ROLE BASED)
// ============================================================================

export const validCredentialsFactory = (
  role: 'SUPER_ADMIN' | 'CUSTOM' | 'WEB_USER' | 'ADMIN',
): Credentials => {
  const scenarios: { [key: string]: Credentials } = {
    // 🔥 SUPER ADMIN
    SUPER_ADMIN: {
      email: 'toolbox@reynard.nl',
      password: 'Admin@12345',
    },

    // 🔥 CUSTOM ROLE USER
    CUSTOM: {
      email: 'mihai.brezeanu@reynard.nl',
      password: 'Admin@12345',
    },

    // 🔥 WEB ACCESS USER
    WEB_USER: {
      email: 'webuser@example.com',
      password: 'WebUser@12345',
    },
  };

  return scenarios[role] || scenarios.ADMIN;
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

    // 12. Only Mobile Access User
    ONLY_MOBILE_USER: {
      email: 'se@mailinator.com',
      password: 'Admin@12345',
      description: 'Only mobile access user',
    },
  };

  return scenarios[type] || scenarios.default;
};

// ============================================================================
// COMPANY DATA FACTORY
// ============================================================================

const TEST_FILES = {
  VALID_IMAGE: 'test-data/files/KiwiQA_LOGO.png',
  INVALID_PDF: 'test-data/files/test-file.pdf',
};

const getUniqueSuffix = () => Date.now() + Math.floor(Math.random() * 1000);
export const companyDataFactory = (type: string = 'validWithAllFields'): CompanyData => {
  const unique = getUniqueSuffix();
  const scenarios: { [key: string]: CompanyData } = {
    // ── TC_H_M_08 — All fields including optional ──
    validWithAllFields: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: `org.${unique}allafields@mailinator.com`,
      password: 'Admin@12345',
      country: 'India',
      companyName: `KiwiQA AllFields ${unique}`,
      logoPath: TEST_FILES.VALID_IMAGE,
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: '+91 87874-56214',
      emergencyContactCountry: 'India+',
      emergencyContactNumber: '+91 98985-63214',
      description: 'Valid company data with all fields including optional',
    },

    // ── TC_H_M_09 — Only mandatory fields ──
    validMandatoryOnly: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: 'org.mandatory@mailinator.com',
      password: 'Admin@12345',
      country: 'India',
      companyName: 'KiwiQA Mandatory',
      logoPath: TEST_FILES.VALID_IMAGE,
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: '+91 87874-56214',
      description: 'Valid company data with mandatory fields only',
    },

    // ── TC_H_M_012 — Invalid email format ──
    invalidEmailFormat: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: 'org@mai',
      password: 'Admin@12345',
      country: 'India',
      companyName: 'KiwiQA InvalidEmail',
      logoPath: TEST_FILES.VALID_IMAGE,
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: '+91 87874-56214',
      description: 'Invalid email format',
    },

    // ── TC_H_M_013 — Invalid contact number (alphabets) ──
    invalidContactAlpha: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: 'org.invalidcontact@mailinator.com',
      password: 'Admin@12345',
      country: 'India',
      companyName: 'KiwiQA InvalidContact',
      logoPath: TEST_FILES.VALID_IMAGE,
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: 'abcdefghij',
      description: 'Try to enter Alphabets in contact number',
    },

    // ── TC_H_M_014 — Invalid emergency contact (alphabets) ──
    invalidEmergencyAlpha: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: 'org.invalidemergency@mailinator.com',
      password: 'Admin@12345',
      country: 'India',
      companyName: 'KiwiQA InvalidEmergency',
      logoPath: TEST_FILES.VALID_IMAGE,
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: '+91 87874-56214',
      emergencyContactCountry: 'India+',
      emergencyContactNumber: 'abcdefghij',
      description: 'Try to enter Alphabets in emergency contact number',
    },

    // ── TC_H_M_015 — Invalid logo format ──
    invalidLogoFormat: {
      usualFirstName: 'Org',
      firstNamePassport: 'Org',
      lastNamePassport: 'Admin',
      email: 'org.invalidlogo@mailinator.com',
      password: 'Admin@12345',
      country: 'India',
      companyName: 'KiwiQA InvalidLogo',
      logoPath: TEST_FILES.INVALID_PDF, // invalid format
      address: 'Plot 12, Tech Park, Bangalore',
      contactCountry: 'India',
      contactNumber: '+91 87874-56214',
      description: 'Invalid file format for company logo',
    },
  };

  return scenarios[type] ?? scenarios['validWithAllFields'];
};

// ============================================================================
// ORG ADMIN PROFILE DATA TYPES
// ============================================================================

export interface ProfileData {
  usualFirstName: string;
  firstNames: string;
  lastNames: string;
  country: string;
  language: string;
  address: string;
  email: string;
  phone: string;
  emergencyContactCountry?: string;
  emergencyContactNumber?: string;
  description?: string;
}

// ============================================================================
// ORG ADMIN PROFILE DATA FACTORY
// ============================================================================


const getUniqueSuffixforProfile = () => Date.now() + Math.floor(Math.random() * 1000);

export const profileDataFactory = (type: string = 'validProfile'): ProfileData => {
  const unique = getUniqueSuffixforProfile();

  const scenarios: { [key: string]: ProfileData } = {
    validProfile: {
      usualFirstName: 'Org',
      firstNames: 'Org Admin',
      lastNames: 'User',
      country: 'India',
      language: 'English',
      address: 'Test Address Bangalore',
      email: `org.profile.${unique}@mailinator.com`,
      phone: '+91 9876543210',
      description: 'Valid profile update',
    },

    // Invalid email scenario
    invalidEmailFormat: {
      usualFirstName: 'Org',
      firstNames: 'Org Admin',
      lastNames: 'User',
      country: 'India',
      language: 'English',
      address: 'Test Address',
      email: 'org.@com',
      phone: '+91 9876543210',
      description: 'Invalid email format',
    },

    invalidPhone: {
      usualFirstName: 'Org',
      firstNames:     'Org',
      lastNames:      'Admin',
      country:        'India',
      language:       'English',
      address:        'Add.',
      email:          `org.phone.${unique}@mailinator.com`,
      phone:          'abcdefghij',
      description:    'Invalid phone number format',
    },

    // Empty mandatory fields
    emptyMandatory: {
      usualFirstName: ' ',
      firstNames: ' ',
      lastNames: ' ',
      country: ' ',
      language: ' ',
      address: ' ',
      email: ' ',
      phone: '',
      description: 'Empty mandatory fields',
    },
  };

  return scenarios[type] ?? scenarios['validProfile'];
};

// ============================================================================
// EXPORT FACTORY BUILDER
// ============================================================================

export const DataFactory = {
  validCredentials: validCredentialsFactory,
  invalidCredentials: invalidCredentialsFactory,
  companyData: companyDataFactory,
  profileData: profileDataFactory,
};
