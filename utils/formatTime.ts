export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeInput(input: string): number {
  const parts = input.split(':').map(part => parseInt(part, 10) || 0);
  
  if (parts.length === 1) {
    // Just seconds
    return parts[0];
  } else if (parts.length === 2) {
    // Minutes:seconds
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // Hours:minutes:seconds
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}