// src/app/api/create-ingress.ts

import { NextRequest, NextResponse } from 'next/server';
import { IngressInput, IngressClient, RoomServiceClient, CreateIngressOptions } from 'livekit-server-sdk';
import { createClient } from '@/utils/supabase/server';

const roomService = new RoomServiceClient(
    'https://longday-8bvfj3k1.livekit.cloud',
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(
    'https://longday-8bvfj3k1.livekit.cloud',
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

const resetIngresses = async (hostIdentity: string) => {
    const ingresses = await ingressClient.listIngress({
        roomName: hostIdentity,
    });

    const rooms = await roomService.listRooms([hostIdentity]);

    for (const room of rooms) {
        await roomService.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
        if (ingress.ingressId) {
            await ingressClient.deleteIngress(ingress.ingressId);
        }
    }
};

export async function POST(request: NextRequest) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data.user) return NextResponse.json({ message: 'Not logged in' }, { status: 403 });

    await resetIngresses(data.user.id);

    const options: CreateIngressOptions = {
        name: data.user.user_metadata.username,
        roomName: data.user.id,
        participantIdentity: data.user.id,
        participantName: data.user.user_metadata.username
    };

    const ingress = await ingressClient.createIngress(
        IngressInput.WHIP_INPUT,
        options
    );

    // Store the new stream key in Supabase
    const { data: updateData, error: updateError } = await supabase.rpc('store_or_update_stream_key', {
        key: ingress.streamKey,
        user_id: data.user.id
    });

    if (updateError) {
        console.error('Error updating stream key:', updateError);
        return NextResponse.json({ message: 'Failed to update stream key' }, { status: 500 });
    }

    return NextResponse.json(ingress);
}

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Welp. You shouldnt be here. Please dont be here. Just leave. I will send Joe after you. Your ip has been logged (no it hasnt)' });
}
