'use client';
import { useParams } from 'next/navigation';
import MeetingRoom from '@/components/MeetingRoom';

export default function AdminLiveMeetingPage() {
    const params = useParams(); // useParams returns promise in newer next, or object. In 14+ client it's hook.
    // Next 15/16 might have specific handling. 'useParams' hook is safest.

    return <MeetingRoom roomId={params.roomId} isHost={true} userName="Instructor" />;
}
