import { NextResponse } from 'next/server';

// Mocked sample data
const workouts = [
  {
    id: '1',
    date: '2024-06-01',
    type: 'Running',
    duration: 30, // minutes
    calories: 300,
  },
  {
    id: '2',
    date: '2024-06-03',
    type: 'Cycling',
    duration: 45,
    calories: 450,
  },
  {
    id: '3',
    date: '2024-06-04',
    type: 'Yoga',
    duration: 60,
    calories: 200,
  },
  {
    id: '4',
    date: '2024-06-05',
    type: 'Strength',
    duration: 50,
    calories: 350,
  },
];

export async function GET() {
  // Simulate async delay
  await new Promise((res) => setTimeout(res, 400));
  return NextResponse.json(workouts);
}
