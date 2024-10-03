import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (typeof message === 'string') {
            return NextResponse.json({ reply: 'message responce from server side' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
    }
}