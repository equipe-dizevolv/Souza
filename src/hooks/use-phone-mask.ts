import { useState, useCallback } from 'react';

export function usePhoneMask() {
  const [value, setValue] = useState('');

  const formatPhone = useCallback((rawValue: string) => {
    // Remove tudo que não é dígito
    const digits = rawValue.replace(/\D/g, '');
    
    // Máscara dinâmica (8 ou 9 dígitos)
    if (digits.length <= 10) {
      // (99) 9999-9999
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    } else {
      // (99) 99999-9999
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
  }, []);

  const handleChange = useCallback((newValue: string) => {
    const formatted = formatPhone(newValue);
    setValue(formatted);
    return formatted;
  }, [formatPhone]);

  const isValid = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
  }, []);

  const getDigits = useCallback((phone: string) => {
    return phone.replace(/\D/g, '');
  }, []);

  return {
    value,
    setValue,
    handleChange,
    isValid,
    getDigits,
    formatPhone,
  };
}
