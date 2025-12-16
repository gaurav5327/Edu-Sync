// Form validation utilities with enhanced error messages

export const validateEmail = (email) => {
  if (!email) {
    return 'Email address is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePassword = (password, options = {}) => {
  const { minLength = 6, requireSpecialChar = false, requireNumber = false, requireUppercase = false } = options;
  
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'Name can only contain letters and spaces';
  }
  
  return null;
};

export const validateAdminId = (adminId) => {
  if (!adminId) {
    return 'Admin ID is required';
  }
  
  if (adminId.trim().length < 3) {
    return 'Admin ID must be at least 3 characters long';
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(adminId)) {
    return 'Admin ID can only contain letters, numbers, hyphens, and underscores';
  }
  
  return null;
};

export const validateDepartment = (department) => {
  if (!department) {
    return 'Department is required';
  }
  
  return null;
};

// Comprehensive form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAdminRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password, {
    minLength: 8,
    requireNumber: true,
    requireSpecialChar: true
  });
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  const adminIdError = validateAdminId(formData.adminId);
  if (adminIdError) errors.adminId = adminIdError;
  
  const departmentError = validateDepartment(formData.department);
  if (departmentError) errors.department = departmentError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time validation for individual fields
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value, {
        minLength: fieldName === 'password' && formData.role === 'admin' ? 8 : 6,
        requireNumber: formData.role === 'admin',
        requireSpecialChar: formData.role === 'admin'
      });
    case 'confirmPassword':
      return validateConfirmPassword(formData.password, value);
    case 'name':
      return validateName(value);
    case 'adminId':
      return validateAdminId(value);
    case 'department':
      return validateDepartment(value);
    default:
      return null;
  }
};

// Enhanced error messages for API responses
export const getEnhancedErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  // Handle different error types
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  // Handle specific HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Invalid credentials. Please check your email and password.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Service not found. Please try again later.';
      case 409:
        return 'This email address is already registered. Please use a different email or try logging in.';
      case 422:
        return 'Invalid data provided. Please check your input and try again.';
      case 429:
        return 'Too many attempts. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Success message helpers
export const getSuccessMessage = (action, data = {}) => {
  switch (action) {
    case 'login':
      return `Welcome back${data.name ? `, ${data.name}` : ''}! Redirecting to your dashboard...`;
    case 'register':
      return `Registration successful! Welcome to TimetableMaster${data.name ? `, ${data.name}` : ''}!`;
    case 'admin_register':
      return `Admin account created successfully! Welcome to the admin panel${data.name ? `, ${data.name}` : ''}!`;
    default:
      return 'Operation completed successfully!';
  }
};