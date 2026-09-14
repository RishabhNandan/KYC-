export type KYCStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'MANUAL_REVIEW' | 'FAILED';

export type DocumentType = 'Aadhaar' | 'PAN' | 'Passport' | 'Driving Licence' | 'Voter ID' | 'Gov ID';

export type Role = 'USER' | 'ADMIN' | 'REVIEWER';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  address: string;
  gender?: string;
  role: Role;
}

export interface ConsentRecord {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  biometricAgreed: boolean;
  ipAddress: string;
  agreedAt: string;
}

export interface FaceVerificationResult {
  selfieImage: string;
  livenessDetected: boolean;
  livenessScore: number; // 0-1
  lightingQuality: 'GOOD' | 'LOW_LIGHT' | 'TOO_BRIGHT';
  blurScore: number; // 0-1
  matchConfidence: number; // 0-1
  status: 'PASSED' | 'FAILED' | 'MANUAL_REVIEW';
}

export interface DocumentInfo {
  id: string;
  docType: DocumentType;
  frontImage: string;
  backImage?: string;
  edgeDetected: boolean;
  perspectiveCorrected: boolean;
  hasGlare: boolean;
  isBlurred: boolean;
  qualityScore: number;
}

export interface OCRResult {
  extractedName: string;
  extractedDob: string;
  maskedDocNumber: string;
  rawDocNumber: string;
  extractedAddress?: string;
  ocrConfidence: number; // 0-1
}

export interface VerificationEngineResult {
  identityMatchScore: number; // 0-100
  faceMatchScore: number;     // 0-100
  ocrConfidenceScore: number; // 0-100
  duplicateDetected: boolean;
  finalStatus: KYCStatus;
  failureReasons: string[];
  referenceId: string;
  verifiedAt: string;
}

export interface KYCApplication {
  id: string;
  referenceId: string;
  userId: string;
  userProfile: UserProfile;
  docType: DocumentType;
  status: KYCStatus;
  consent?: ConsentRecord;
  faceData?: FaceVerificationResult;
  documentData?: DocumentInfo;
  ocrData?: OCRResult;
  verificationResult?: VerificationEngineResult;
  submittedAt: string;
  updatedAt: string;
  reviewNotes?: string;
  reviewedBy?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetKycId: string;
  targetUserName: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
