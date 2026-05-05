'use client';
import { useParams } from 'next/navigation';
import MeetingRoom from '@/components/MeetingRoom';

export default function StudentLiveMeetingPage() {
    const params = useParams();
    return <MeetingRoom roomId={params.roomId} isHost={false} userName="Student" />;
}
