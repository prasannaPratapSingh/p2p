const getJitsiMeetingLink = (connectionId: string): { meetingLink: string; meetingRoomId: string } => {
    const baseUrl = 'https://meet.jit.si/';
    const meetingRoomId = `skill-swap=${connectionId}`;
    const meetingLink = `${baseUrl}${meetingRoomId}`;
    return { meetingLink, meetingRoomId };
}

export default getJitsiMeetingLink;