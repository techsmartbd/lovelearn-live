import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    dbUrl: process.env.DATABASE_URL,
    allEnv: Object.keys(process.env).filter(k => k.includes('DATABASE'))
  });
}
