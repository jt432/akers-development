import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'akers2024admin';

interface LogEntry {
  consultant: string;
  clientName: string;
  projectType: string;
  timestamp: string;
}

export async function GET(req: NextRequest) {
  // Check admin password
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // List all consultant log files from blob storage
    const entries: LogEntry[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({
        prefix: 'consultant-log/',
        cursor,
        limit: 1000,
      });

      for (const blob of result.blobs) {
        try {
          const res = await fetch(blob.url);
          const entry = await res.json() as LogEntry;
          entries.push(entry);
        } catch {
          // Skip corrupted entries
        }
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    // Calculate stats
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const consultants = [
      'Jon Tyler Akers',
      'Tristan Gardner',
      'Jacob Wilson',
      'Dylan Scott',
      'Chapman Suggs',
    ];

    const stats = consultants.map((name) => {
      const consultantEntries = entries.filter((e) => e.consultant === name);

      const weekly = consultantEntries.filter(
        (e) => new Date(e.timestamp) >= startOfWeek
      ).length;

      const monthly = consultantEntries.filter(
        (e) => new Date(e.timestamp) >= startOfMonth
      ).length;

      const yearly = consultantEntries.filter(
        (e) => new Date(e.timestamp) >= startOfYear
      ).length;

      const allTime = consultantEntries.length;

      // Get recent submissions for this consultant
      const recent = consultantEntries
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map((e) => ({
          clientName: e.clientName,
          projectType: e.projectType,
          date: e.timestamp,
        }));

      return { name, weekly, monthly, yearly, allTime, recent };
    });

    // Totals
    const totals = {
      weekly: stats.reduce((sum, s) => sum + s.weekly, 0),
      monthly: stats.reduce((sum, s) => sum + s.monthly, 0),
      yearly: stats.reduce((sum, s) => sum + s.yearly, 0),
      allTime: stats.reduce((sum, s) => sum + s.allTime, 0),
    };

    return NextResponse.json({
      stats,
      totals,
      period: {
        weekStart: startOfWeek.toISOString(),
        monthStart: startOfMonth.toISOString(),
        yearStart: startOfYear.toISOString(),
      },
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load stats.' },
      { status: 500 }
    );
  }
}
