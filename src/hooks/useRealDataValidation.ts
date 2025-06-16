import { useEffect, useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  missingKeys: string[];
  warnings: string[];
  recommendations: string[];
}

export function useRealDataValidation() {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    missingKeys: [],
    warnings: [],
    recommendations: []
  });

  useEffect(() => {
    validateEnvironment();
  }, []);

  const validateEnvironment = () => {
    const requiredKeys = [
      'VITE_ODDS_API_KEY',
      'VITE_SPORTRADAR_API_KEY',
      'VITE_DATA_API_KEY_PRIMARY',
      'VITE_PROP_PROVIDER_KEY'
    ];

    const optionalKeys = [
      'VITE_SPORTRADAR_DAILYFANTASY_KEY',
      'VITE_ESPN_API_KEY',
      'VITE_WEATHER_API_KEY',
      'VITE_REDDIT_CLIENT_ID',
      'VITE_TWITTER_BEARER_TOKEN',
      'VITE_NEWS_API_KEY'
    ];

    const missingRequired = requiredKeys.filter(key => !import.meta.env[key]);
    const missingOptional = optionalKeys.filter(key => !import.meta.env[key]);
    
    const warnings = [];
    const recommendations = [];

    // Check for required keys
    if (missingRequired.length > 0) {
      warnings.push(`Missing ${missingRequired.length} required API keys`);
      recommendations.push('Add required API keys to .env file for core functionality');
      
      // Log specific missing keys
      console.warn('🔑 Missing Required API Keys:', missingRequired);
      console.warn('📝 These keys are required for core functionality');
    }

    // Check for optional keys
    if (missingOptional.length > 0) {
      warnings.push(`Missing ${missingOptional.length} optional API keys`);
      recommendations.push('Add optional API keys for enhanced features');
      
      console.info('ℹ️ Missing Optional API Keys:', missingOptional);
      console.info('💡 These keys provide enhanced functionality but are not required');
    }

    // Validate key formats (basic validation)
    const invalidKeys = [];
    requiredKeys.concat(optionalKeys).forEach(key => {
      const value = import.meta.env[key];
      if (value) {
        // Basic validation - keys should be at least 10 characters
        if (value.length < 10) {
          invalidKeys.push(key);
        }
      }
    });

    if (invalidKeys.length > 0) {
      warnings.push(`${invalidKeys.length} API keys appear to be invalid`);
      recommendations.push('Verify API key formats and values');
      console.warn('⚠️ Potentially Invalid API Keys:', invalidKeys);
    }

    // Check for demo/placeholder values
    const placeholderKeys = [];
    requiredKeys.concat(optionalKeys).forEach(key => {
      const value = import.meta.env[key];
      if (value && (
        value.includes('your_') || 
        value.includes('demo') || 
        value.includes('test') ||
        value === 'placeholder'
      )) {
        placeholderKeys.push(key);
      }
    });

    if (placeholderKeys.length > 0) {
      warnings.push(`${placeholderKeys.length} keys contain placeholder values`);
      recommendations.push('Replace placeholder values with real API keys');
      console.warn('🎭 Placeholder API Keys Detected:', placeholderKeys);
    }

    const isValid = missingRequired.length === 0 && invalidKeys.length === 0 && placeholderKeys.length === 0;

    setValidation({
      isValid,
      missingKeys: missingRequired.concat(missingOptional),
      warnings,
      recommendations
    });

    // Log overall status
    if (isValid) {
      console.log('✅ All required API keys are properly configured');
    } else {
      console.warn('⚠️ API configuration issues detected - check Data Debug panel');
    }
  };

  return validation;
}