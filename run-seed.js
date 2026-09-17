const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Shanti Neuro Clinic Database...');

  // Hospital settings
  await prisma.hospitalSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      hospitalName: 'SHANTI NEURO CLINIC',
      tagline: 'Advanced Neurological Care & Rehabilitation Center',
      address: '102 Neuro Care Tower, Health Avenue, Medical District, City - 400001',
      phone: '+91 98765 43210 / +91 022 2847 9900',
      email: 'contact@shantineuroclinic.com',
      website: 'www.shantineuroclinic.com',
      licenseNo: 'HOSP-NC-2026-8899',
      disclaimerText: "This official recommendation document is generated based solely on authorized medical personnel's manually entered clinical observations and instructions at Shanti Neuro Clinic.",
    },
  });

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const coadminPassword = await bcrypt.hash('Coadmin@123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@shantineuroclinic.com' },
    update: {},
    create: {
      name: 'Super Admin (Chief Administrator)',
      email: 'admin@shantineuroclinic.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+91 98765 00001',
    },
  });

  const coAdmin = await prisma.user.upsert({
    where: { email: 'coadmin@shantineuroclinic.com' },
    update: {},
    create: {
      name: 'Staff Co-Admin (Desk Registrar)',
      email: 'coadmin@shantineuroclinic.com',
      password: coadminPassword,
      role: 'CO_ADMIN',
      status: 'ACTIVE',
      phone: '+91 98765 00002',
    },
  });

  const doc1 = await prisma.doctor.upsert({
    where: { regNumber: 'MC-987654' },
    update: {},
    create: {
      name: 'Dr. S. K. Sharma',
      regNumber: 'MC-987654',
      department: 'Neurology',
      designation: 'Senior Consultant Neurologist (MD, DM Neurology)',
      email: 'dr.sharma@shantineuroclinic.com',
      phone: '+91 98200 11223',
      status: 'ACTIVE',
    },
  });

  const doc2 = await prisma.doctor.upsert({
    where: { regNumber: 'MC-876543' },
    update: {},
    create: {
      name: 'Dr. Ananya Verma',
      regNumber: 'MC-876543',
      department: 'Neurosurgery',
      designation: 'Chief Neurosurgeon (MCh Neurosurgery)',
      email: 'dr.ananya@shantineuroclinic.com',
      phone: '+91 98200 44556',
      status: 'ACTIVE',
    },
  });

  const doc3 = await prisma.doctor.upsert({
    where: { regNumber: 'MC-765432' },
    update: {},
    create: {
      name: 'Dr. Rajesh Mehta',
      regNumber: 'MC-765432',
      department: 'Neuro-Rehabilitation',
      designation: 'Head of Neuro-Rehabilitation (MD, Fellowship Neuro Rehab)',
      email: 'dr.mehta@shantineuroclinic.com',
      phone: '+91 98200 77889',
      status: 'ACTIVE',
    },
  });

  const pat1 = await prisma.patient.upsert({
    where: { patientId: 'PAT-2026-00101' },
    update: {},
    create: {
      patientId: 'PAT-2026-00101',
      name: 'Ramesh Kumar',
      age: 48,
      gender: 'Male',
      phone: '+91 99887 76655',
      address: 'Flat 402, Green Park Apartments, Sector 12, City',
    },
  });

  const pat2 = await prisma.patient.upsert({
    where: { patientId: 'PAT-2026-00102' },
    update: {},
    create: {
      patientId: 'PAT-2026-00102',
      name: 'Sunita Devi',
      age: 56,
      gender: 'Female',
      phone: '+91 99887 11223',
      address: 'House 88, Lake View Road, Ward 5, City',
    },
  });

  const rec1 = await prisma.recommendation.upsert({
    where: { recordId: 'REC-2026-000001' },
    update: {},
    create: {
      recordId: 'REC-2026-000001',
      doctorId: doc1.id,
      patientId: pat1.id,
      createdById: coAdmin.id,
      date: new Date('2026-09-15'),
      diagnosis: 'Tension-Type Headache with Cervical Muscle Spasm. Mild sleep deprivation noted.',
      recommendation: '1. Continue ergonomic postural corrections.\n2. Apply localized moist heat therapy for cervical neck region twice daily.\n3. Daily hydration of 2.5-3 liters.',
      followUp: 'Follow up in 2 weeks or earlier if headache frequency increases.',
      additionalInstructions: 'Avoid prolonged neck flexion without breaks. Avoid unprescribed OTC painkillers.',
      remarks: 'Patient responded well to initial lifestyle adjustments.',
      authorizedPerson: 'Staff Co-Admin (Desk Registrar)',
      status: 'FINALIZED',
    },
  });

  const rec2 = await prisma.recommendation.upsert({
    where: { recordId: 'REC-2026-000002' },
    update: {},
    create: {
      recordId: 'REC-2026-000002',
      doctorId: doc2.id,
      patientId: pat2.id,
      createdById: superAdmin.id,
      date: new Date('2026-09-17'),
      diagnosis: 'Lumbar L4-L5 Disc Radiculopathy. Mild paresthesia in right L5 dermatome.',
      recommendation: '1. Strictly avoid forward bending and heavy lifting.\n2. Guided physiotherapy for lumbar stabilization as prescribed.\n3. Lumbar support belt while traveling or prolonged standing.',
      followUp: 'Review with repeat MRI spine after 4 weeks of conservative management.',
      additionalInstructions: 'Report immediately if progressive lower limb weakness or bowel/bladder disturbance occurs.',
      remarks: 'Surgical intervention deferred; conservative management initiated.',
      authorizedPerson: 'Super Admin (Chief Administrator)',
      status: 'FINALIZED',
    },
  });

  const count = await prisma.auditLog.count();
  if (count === 0) {
    await prisma.auditLog.createMany({
      data: [
        {
          userId: superAdmin.id,
          userName: superAdmin.name,
          userRole: superAdmin.role,
          action: 'SYSTEM_INITIALIZATION',
          entity: 'System',
          details: 'Shanti Neuro Clinic Management System initialized.',
          ipAddress: '127.0.0.1',
        },
        {
          userId: coAdmin.id,
          userName: coAdmin.name,
          userRole: coAdmin.role,
          action: 'RECOMMENDATION_CREATED',
          entity: 'Recommendation',
          entityId: rec1.id,
          details: `Created recommendation record ${rec1.recordId} for Patient Ramesh Kumar`,
          ipAddress: '127.0.0.1',
        },
        {
          userId: superAdmin.id,
          userName: superAdmin.name,
          userRole: superAdmin.role,
          action: 'RECOMMENDATION_CREATED',
          entity: 'Recommendation',
          entityId: rec2.id,
          details: `Created recommendation record ${rec2.recordId} for Patient Sunita Devi`,
          ipAddress: '127.0.0.1',
        },
      ],
    });
  }

  console.log('Seeding successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
