import { KYCApplication, AuditLog } from './types';

export const INITIAL_KYC_APPLICATIONS: KYCApplication[] = [
  {
    id: 'kyc-app-001',
    referenceId: 'KYC-2026-98124',
    userId: 'usr-101',
    userProfile: {
      id: 'usr-101',
      fullName: 'Vikramaditya Sharma',
      email: 'vikram.sharma@example.com',
      mobile: '+91 98765 43210',
      dob: '1992-05-14',
      address: '402, Green Valley Apartments, Bandra West, Mumbai, Maharashtra 400050',
      gender: 'Male',
      role: 'USER'
    },
    docType: 'Aadhaar',
    status: 'VERIFIED',
    submittedAt: '2026-09-14T10:15:00Z',
    updatedAt: '2026-09-14T10:17:30Z',
    consent: {
      termsAgreed: true,
      privacyAgreed: true,
      biometricAgreed: true,
      ipAddress: '103.24.12.89',
      agreedAt: '2026-09-14T10:12:00Z'
    },
    faceData: {
      selfieImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      livenessDetected: true,
      livenessScore: 0.98,
      lightingQuality: 'GOOD',
      blurScore: 0.05,
      matchConfidence: 0.96,
      status: 'PASSED'
    },
    documentData: {
      id: 'doc-001',
      docType: 'Aadhaar',
      frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      edgeDetected: true,
      perspectiveCorrected: true,
      hasGlare: false,
      isBlurred: false,
      qualityScore: 0.95
    },
    ocrData: {
      extractedName: 'Vikramaditya Sharma',
      extractedDob: '1992-05-14',
      maskedDocNumber: 'XXXX XXXX 5892',
      rawDocNumber: '4829 1049 5892',
      extractedAddress: '402, Green Valley Apartments, Bandra West, Mumbai, Maharashtra 400050',
      ocrConfidence: 0.97
    },
    verificationResult: {
      identityMatchScore: 100,
      faceMatchScore: 96,
      ocrConfidenceScore: 97,
      duplicateDetected: false,
      finalStatus: 'VERIFIED',
      failureReasons: [],
      referenceId: 'KYC-2026-98124',
      verifiedAt: '2026-09-14T10:17:30Z'
    }
  },
  {
    id: 'kyc-app-002',
    referenceId: 'KYC-2026-74512',
    userId: 'usr-102',
    userProfile: {
      id: 'usr-102',
      fullName: 'Priya Ananya Patel',
      email: 'priya.patel@example.com',
      mobile: '+91 91234 56789',
      dob: '1995-11-20',
      address: '78 Lotus Boulevard, Sector 62, Noida, Uttar Pradesh 201301',
      gender: 'Female',
      role: 'USER'
    },
    docType: 'PAN',
    status: 'MANUAL_REVIEW',
    submittedAt: '2026-09-14T11:40:00Z',
    updatedAt: '2026-09-14T11:40:00Z',
    consent: {
      termsAgreed: true,
      privacyAgreed: true,
      biometricAgreed: true,
      ipAddress: '49.36.192.44',
      agreedAt: '2026-09-14T11:38:00Z'
    },
    faceData: {
      selfieImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      livenessDetected: true,
      livenessScore: 0.82,
      lightingQuality: 'LOW_LIGHT',
      blurScore: 0.22,
      matchConfidence: 0.81,
      status: 'MANUAL_REVIEW'
    },
    documentData: {
      id: 'doc-002',
      docType: 'PAN',
      frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      edgeDetected: true,
      perspectiveCorrected: true,
      hasGlare: true,
      isBlurred: false,
      qualityScore: 0.78
    },
    ocrData: {
      extractedName: 'Priya A. Patel',
      extractedDob: '1995-11-20',
      maskedDocNumber: 'ABCPE****K',
      rawDocNumber: 'ABCPE9841K',
      ocrConfidence: 0.82
    },
    verificationResult: {
      identityMatchScore: 85,
      faceMatchScore: 81,
      ocrConfidenceScore: 82,
      duplicateDetected: false,
      finalStatus: 'MANUAL_REVIEW',
      failureReasons: [
        'Name variation detected (Profile: Priya Ananya Patel vs Doc: Priya A. Patel)',
        'Minor glare detected on PAN card top surface'
      ],
      referenceId: 'KYC-2026-74512',
      verifiedAt: '2026-09-14T11:40:00Z'
    }
  },
  {
    id: 'kyc-app-003',
    referenceId: 'KYC-2026-31908',
    userId: 'usr-103',
    userProfile: {
      id: 'usr-103',
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      mobile: '+91 99887 76655',
      dob: '1988-08-05',
      address: '12 Park Street, Kolkata, West Bengal 700016',
      gender: 'Male',
      role: 'USER'
    },
    docType: 'Passport',
    status: 'FAILED',
    submittedAt: '2026-09-14T12:05:00Z',
    updatedAt: '2026-09-14T12:05:00Z',
    consent: {
      termsAgreed: true,
      privacyAgreed: true,
      biometricAgreed: true,
      ipAddress: '157.38.45.101',
      agreedAt: '2026-09-14T12:01:00Z'
    },
    faceData: {
      selfieImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      livenessDetected: false,
      livenessScore: 0.45,
      lightingQuality: 'LOW_LIGHT',
      blurScore: 0.65,
      matchConfidence: 0.58,
      status: 'FAILED'
    },
    documentData: {
      id: 'doc-003',
      docType: 'Passport',
      frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      edgeDetected: false,
      perspectiveCorrected: false,
      hasGlare: true,
      isBlurred: true,
      qualityScore: 0.40
    },
    ocrData: {
      extractedName: 'R. K. Verma',
      extractedDob: '1988-08-05',
      maskedDocNumber: 'Z*****82',
      rawDocNumber: 'Z9481082',
      ocrConfidence: 0.52
    },
    verificationResult: {
      identityMatchScore: 50,
      faceMatchScore: 58,
      ocrConfidenceScore: 52,
      duplicateDetected: false,
      finalStatus: 'FAILED',
      failureReasons: [
        'Liveness check failed: Biometric depth and movement verification insufficient',
        'Document image blur score exceeds acceptable threshold'
      ],
      referenceId: 'KYC-2026-31908',
      verifiedAt: '2026-09-14T12:05:00Z'
    }
  },
  {
    id: 'kyc-app-004',
    referenceId: 'KYC-2026-10492',
    userId: 'usr-104',
    userProfile: {
      id: 'usr-104',
      fullName: 'Aisha Abdullah Khan',
      email: 'aisha.khan@example.com',
      mobile: '+91 94567 89012',
      dob: '1997-03-18',
      address: '15 MG Road, Bengaluru, Karnataka 560001',
      gender: 'Female',
      role: 'USER'
    },
    docType: 'Driving Licence',
    status: 'SUBMITTED',
    submittedAt: '2026-09-14T14:30:00Z',
    updatedAt: '2026-09-14T14:30:00Z',
    consent: {
      termsAgreed: true,
      privacyAgreed: true,
      biometricAgreed: true,
      ipAddress: '106.51.72.19',
      agreedAt: '2026-09-14T14:28:00Z'
    },
    faceData: {
      selfieImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      livenessDetected: true,
      livenessScore: 0.94,
      lightingQuality: 'GOOD',
      blurScore: 0.08,
      matchConfidence: 0.92,
      status: 'PASSED'
    },
    documentData: {
      id: 'doc-004',
      docType: 'Driving Licence',
      frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      edgeDetected: true,
      perspectiveCorrected: true,
      hasGlare: false,
      isBlurred: false,
      qualityScore: 0.91
    },
    ocrData: {
      extractedName: 'Aisha Abdullah Khan',
      extractedDob: '1997-03-18',
      maskedDocNumber: 'KA01****9821',
      rawDocNumber: 'KA012018009821',
      ocrConfidence: 0.94
    },
    verificationResult: {
      identityMatchScore: 100,
      faceMatchScore: 92,
      ocrConfidenceScore: 94,
      duplicateDetected: false,
      finalStatus: 'VERIFIED',
      failureReasons: [],
      referenceId: 'KYC-2026-10492',
      verifiedAt: '2026-09-14T14:30:00Z'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    adminEmail: 'admin@kyc.com',
    action: 'APPROVE_APPLICATION',
    targetKycId: 'KYC-2026-98124',
    targetUserName: 'Vikramaditya Sharma',
    details: 'Verified name & face match confidence (>95%). Document quality clear.',
    ipAddress: '192.168.1.100',
    timestamp: '2026-09-14T10:18:00Z'
  },
  {
    id: 'log-002',
    adminEmail: 'admin@kyc.com',
    action: 'FLAG_MANUAL_REVIEW',
    targetKycId: 'KYC-2026-74512',
    targetUserName: 'Priya Ananya Patel',
    details: 'Flagged for manual review due to middle name variation on PAN document.',
    ipAddress: '192.168.1.100',
    timestamp: '2026-09-14T11:42:15Z'
  },
  {
    id: 'log-003',
    adminEmail: 'superadmin@kyc.com',
    action: 'UNMASK_DOCUMENT_NUMBER',
    targetKycId: 'KYC-2026-74512',
    targetUserName: 'Priya Ananya Patel',
    details: 'Authorized admin view of unmasked PAN number for regulatory compliance audit.',
    ipAddress: '192.168.1.105',
    timestamp: '2026-09-14T11:45:00Z'
  }
];
