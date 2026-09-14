import { NextResponse } from 'next/server';
import { INITIAL_KYC_APPLICATIONS } from '@/lib/mockData';
import { KYCApplication } from '@/lib/types';
import { evaluateKYC } from '@/lib/kycEngine';

// In-memory application store for demo lifetime
let globalApplicationsStore: KYCApplication[] = [...INITIAL_KYC_APPLICATIONS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let filtered = [...globalApplicationsStore];

  if (status && status !== 'ALL') {
    filtered = filtered.filter(app => app.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(app =>
      app.referenceId.toLowerCase().includes(q) ||
      app.userProfile.fullName.toLowerCase().includes(q) ||
      app.userProfile.email.toLowerCase().includes(q) ||
      app.userProfile.mobile.includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: globalApplicationsStore.length,
    applications: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userProfile, docType, consent, faceData, documentData, ocrData } = body;

    if (!userProfile || !userProfile.fullName || !userProfile.email) {
      return NextResponse.json({ success: false, error: 'Missing user profile data' }, { status: 400 });
    }

    // Run Verification Engine
    const verificationResult = evaluateKYC(userProfile, docType, ocrData, faceData, documentData);

    const newApp: KYCApplication = {
      id: `kyc-app-${Date.now()}`,
      referenceId: verificationResult.referenceId,
      userId: `usr-${Date.now()}`,
      userProfile,
      docType: docType || 'Aadhaar',
      status: verificationResult.finalStatus,
      consent: {
        termsAgreed: consent?.termsAgreed ?? true,
        privacyAgreed: consent?.privacyAgreed ?? true,
        biometricAgreed: consent?.biometricAgreed ?? true,
        ipAddress: '127.0.0.1',
        agreedAt: new Date().toISOString()
      },
      faceData: faceData || {
        selfieImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        livenessDetected: true,
        livenessScore: 0.95,
        lightingQuality: 'GOOD',
        blurScore: 0.04,
        matchConfidence: 0.93,
        status: 'PASSED'
      },
      documentData: documentData || {
        id: `doc-${Date.now()}`,
        docType: docType || 'Aadhaar',
        frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        edgeDetected: true,
        perspectiveCorrected: true,
        hasGlare: false,
        isBlurred: false,
        qualityScore: 0.92
      },
      ocrData: ocrData || {
        extractedName: userProfile.fullName,
        extractedDob: userProfile.dob,
        maskedDocNumber: 'XXXX XXXX 5678',
        rawDocNumber: '4829 1049 5678',
        ocrConfidence: 0.95
      },
      verificationResult,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    globalApplicationsStore.unshift(newApp);

    return NextResponse.json({
      success: true,
      application: newApp
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
