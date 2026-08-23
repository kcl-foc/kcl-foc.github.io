function downloadCalendar(title, speaker, date, time, room, abstract) {
    const d = new Date(date);
    const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');

    // Parse time: "14:00 - 15:00", "14:00-15:00", or "14:00" (default +1hr)
    const [start, end] = (time || '14:00-15:00').split('-').map(t => t.trim());
    const startTime = start.replace(':', '') + '00';
    const endTime = (end || (parseInt(start) + 1).toString().padStart(2, '0') + ':00').replace(':', '') + '00';

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${ymd}T${startTime}`,
        `DTEND:${ymd}T${endTime}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:Speaker: ${speaker}\\n\\n${abstract || ''}`,
        `LOCATION:${room || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\W+/g, '-').toLowerCase()}.ics`;
    link.click();
}
