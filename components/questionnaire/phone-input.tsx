"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface EnhancedPhoneInputProps {
  value?: string;
  onChangeText: (v: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

// Common calling-code to ISO2 mapping
const CALLING_CODE_TO_ISO: Record<string, string> = {
  "1": "US",
  "7": "RU",
  "20": "EG",
  "27": "ZA",
  "30": "GR",
  "31": "NL",
  "32": "BE",
  "33": "FR",
  "34": "ES",
  "36": "HU",
  "39": "IT",
  "40": "RO",
  "41": "CH",
  "43": "AT",
  "44": "GB",
  "45": "DK",
  "46": "SE",
  "47": "NO",
  "48": "PL",
  "49": "DE",
  "51": "PE",
  "52": "MX",
  "53": "CU",
  "54": "AR",
  "55": "BR",
  "56": "CL",
  "57": "CO",
  "58": "VE",
  "60": "MY",
  "61": "AU",
  "62": "ID",
  "63": "PH",
  "64": "NZ",
  "65": "SG",
  "66": "TH",
  "81": "JP",
  "82": "KR",
  "84": "VN",
  "86": "CN",
  "90": "TR",
  "91": "IN",
  "92": "PK",
  "93": "AF",
  "94": "LK",
  "95": "MM",
  "98": "IR",
  "211": "SS",
  "212": "MA",
  "213": "DZ",
  "216": "TN",
  "218": "LY",
  "220": "GM",
  "221": "SN",
  "234": "NG",
  "251": "ET",
  "254": "KE",
  "255": "TZ",
  "256": "UG",
  "260": "ZM",
  "263": "ZW",
  "351": "PT",
  "352": "LU",
  "353": "IE",
  "354": "IS",
  "355": "AL",
  "356": "MT",
  "357": "CY",
  "358": "FI",
  "359": "BG",
  "370": "LT",
  "371": "LV",
  "372": "EE",
  "380": "UA",
  "381": "RS",
  "385": "HR",
  "386": "SI",
  "420": "CZ",
  "421": "SK",
  "852": "HK",
  "853": "MO",
  "855": "KH",
  "856": "LA",
  "971": "AE",
  "972": "IL",
  "973": "BH",
  "974": "QA",
  "975": "BT",
  "976": "MN",
  "977": "NP",
};

const isoToFlag = (iso?: string) => {
  if (!iso) return "🌐";
  const code = iso.toUpperCase();
  if (code.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return (
    String.fromCodePoint(A + (code.charCodeAt(0) - 65)) +
    String.fromCodePoint(A + (code.charCodeAt(1) - 65))
  );
};

// Extract the calling code (longest match) from a + prefixed value
const getCallingCode = (input?: string): string | undefined => {
  if (!input || input[0] !== "+") return undefined;
  const digits = input.slice(1).replace(/\D/g, "");
  for (let len = Math.min(3, digits.length); len >= 1; len--) {
    const cc = digits.slice(0, len);
    if (CALLING_CODE_TO_ISO[cc]) return cc;
  }
  return undefined;
};

export function EnhancedPhoneInput({
  value,
  onChangeText,
  onValidationChange,
  placeholder = "Enter phone number",
  disabled = false,
  autoFocus = false,
}: EnhancedPhoneInputProps) {
  const E164_REGEX = /^\+[1-9]\d{6,14}$/;

  const currentCC = getCallingCode(value);
  const currentISO = currentCC ? CALLING_CODE_TO_ISO[currentCC] : undefined;
  const currentFlag = isoToFlag(currentISO);

  const sanitize = (input: string) => {
    let cleaned = input.replace(/[^\d+]/g, "");
    if (cleaned.includes("+")) {
      cleaned = "+" + cleaned.replace(/\+/g, "").replace(/^0+/, "");
    }
    const match = cleaned.match(/^(\+)?(\d{0,15})/);
    if (!match) return cleaned;
    return (match[1] || "") + (match[2] || "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const next = sanitize(text);
    const isValid = next.length === 0 ? true : E164_REGEX.test(next);
    onValidationChange?.(isValid);
    onChangeText(next);
  };

  const [didInit, setDidInit] = useState(false);
  useEffect(() => {
    if (!didInit) {
      setDidInit(true);
      if (!value || value.length === 0) {
        onChangeText("+44");
        onValidationChange?.(false);
        return;
      }
    }
    const isValid = value && value.length > 0 ? E164_REGEX.test(value) : true;
    onValidationChange?.(isValid);
  }, [value, didInit, onChangeText, onValidationChange]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
        {currentFlag}
      </div>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        type="tel"
        className="pl-12"
      />
    </div>
  );
}
