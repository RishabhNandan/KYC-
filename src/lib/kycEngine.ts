import { DocumentType, KYCStatus, OCRResult, UserProfile, FaceVerificationResult, DocumentInfo, VerificationEngineResult } from './types';

/**
 * Mask sensitive identity document numbers in compliance with privacy guidelines.
 */
export function maskDocumentNumber(docType: DocumentType, docNumber: string): string {
  if (!docNumber) return '';
  const clean = docNumber.replace(/\s+/g, '');

  switch (docType) {
    case 'Aadhaar':
      // Aadhaar: Mask first 8 digits -> XXXX XXXX 5678
      if (clean.length >= 12) {
        return `XXXX XXXX ${clean.slice(-4)}`;
      }
      return `XXXX-XXXX-${clean.slice(-4)}`;

    case 'PAN':
      // PAN: Mask middle 4 digits -> ABCDE****F
      if (clean.length === 10) {
        return `${clean.slice(0, 5)}****${clean.slice(9)}`;
      }
      return `${clean.slice(0, 3)}****${clean.slice(-2)}`;

    case 'Passport':
      // Passport: Mask middle digits -> A****89
      if (clean.length >= 8) {
        return `${clean.slice(0, 2)}****${clean.slice(-2)}`;
      }
      return `P****${clean.slice(-2)}`;

    case 'Driving Licence':
      // DL: Mask middle digits -> DL14****5678
      if (clean.length >= 10) {
        return `${clean.slice(0, 4)}****${clean.slice(-4)}`;
      }
      return `DL****${clean.slice(-4)}`;

    default:
      if (clean.length > 4) {
        return '*'.repeat(clean.length - 4) + clean.slice(-4);
      }
      return '****';
  }
}

/**
 * Calculate similarity between two strings (Levenshtein-based ratio)
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  
  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1.0 : 1 - distance / maxLen;
}

/**
 * KYC Verification Orchestration Engine
 */
export function evaluateKYC(
  userProfile: UserProfile,
  docType: DocumentType,
  ocrData?: OCRResult,
  faceData?: FaceVerificationResult,
  documentData?: DocumentInfo
): VerificationEngineResult {
  const failureReasons: string[] = [];

  // 1. Identity / Name Match
  let identityMatchScore = 100;
  if (ocrData?.extractedName) {
    const sim = calculateStringSimilarity(userProfile.fullName, ocrData.extractedName);
    identityMatchScore = Math.round(sim * 100);
    if (sim < 0.75) {
      failureReasons.push(`Name mismatch: Entered '${userProfile.fullName}', document states '${ocrData.extractedName}'`);
    }
  }

  // 2. DOB Match
  if (ocrData?.extractedDob && userProfile.dob) {
    if (userProfile.dob !== ocrData.extractedDob) {
      failureReasons.push(`Date of Birth mismatch: Entered '${userProfile.dob}', document states '${ocrData.extractedDob}'`);
    }
  }

  // 3. Face & Liveness Match
  let faceMatchScore = faceData ? Math.round((faceData.matchConfidence || 0.92) * 100) : 90;
  if (faceData) {
    if (!faceData.livenessDetected || faceData.livenessScore < 0.75) {
      failureReasons.push('Liveness check failed: Biometric depth and movement verification insufficient');
    }
    if (faceData.matchConfidence < 0.80) {
      failureReasons.push('Face match score below threshold (Selfie ↔ Document Photo)');
    }
  }

  // 4. Document Quality & Glare Check
  if (documentData) {
    if (documentData.hasGlare) {
      failureReasons.push('Document contains excessive light glare across critical text areas');
    }
    if (documentData.isBlurred) {
      failureReasons.push('Document image blur score exceeds acceptable threshold');
    }
  }

  // 5. OCR Confidence Score
  const ocrConfidenceScore = ocrData ? Math.round((ocrData.ocrConfidence || 0.88) * 100) : 90;

  // Final Decision Logic
  let finalStatus: KYCStatus = 'VERIFIED';

  if (failureReasons.length > 0) {
    // Severe failures trigger FAILED, minor quality/name discrepancies trigger MANUAL_REVIEW
    const isSevere = failureReasons.some(r => r.includes('Liveness') || r.includes('below threshold'));
    finalStatus = isSevere ? 'FAILED' : 'MANUAL_REVIEW';
  }

  const randomRefNum = Math.floor(10000 + Math.random() * 90000);
  const referenceId = `KYC-2026-${randomRefNum}`;

  return {
    identityMatchScore,
    faceMatchScore,
    ocrConfidenceScore,
    duplicateDetected: false,
    finalStatus,
    failureReasons,
    referenceId,
    verifiedAt: new Date().toISOString()
  };
}
