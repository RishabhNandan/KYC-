import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalDoctors, totalRecommendations, todayEntries, totalPdfs, recentRecords, recentActivities] =
      await Promise.all([
        prisma.doctor.count({ where: { status: 'ACTIVE' } }),
        prisma.recommendation.count(),
        prisma.recommendation.count({
          where: {
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        }),
        prisma.recommendation.count({ where: { pdfGenerated: true } }),
        prisma.recommendation.findMany({
          take: 6,
          orderBy: { date: 'desc' },
          include: {
            doctor: { select: { name: true, department: true } },
            patient: { select: { name: true, patientId: true } },
            createdBy: { select: { name: true } },
          },
        }),
        prisma.auditLog.findMany({
          take: 8,
          orderBy: { timestamp: 'desc' },
        }),
      ]);

    return NextResponse.json({
      stats: {
        totalDoctors,
        totalRecommendations,
        todayEntries,
        totalPdfs,
      },
      recentRecords,
      recentActivities,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
