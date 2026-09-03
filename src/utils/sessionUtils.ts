import { Schedule } from "../types/scheduales";

/**
 * Checks if a session is joinable based on start time, end time, and buffer minutes.
 */
export const isSessionJoinable = (
  startTime?: string | null,
  endTime?: string | null,
  link?: string | null,
  notificationTime?: string | number,
  now: Date = new Date()
): boolean => {
  if (!link || !startTime || !endTime) return false;
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  const bufferMinutes = Number(notificationTime || 15);
  const joinableStart = new Date(start.getTime() - bufferMinutes * 60000);
  return now >= joinableStart && now <= end;
};

/**
 * Checks if a session can be ended (only after 85% of duration has elapsed and up to 20 mins after scheduled end).
 */
export const isSessionEndable = (
  startTime?: string | null,
  endTime?: string | null,
  now: Date = new Date()
): boolean => {
  if (!startTime || !endTime) return false;
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  const totalDurationMs = end.getTime() - start.getTime();
  if (totalDurationMs <= 0) return false;
  const start85PercentTime = new Date(start.getTime() + totalDurationMs * 0.85);
  const twentyMinsAfterEnd = new Date(end.getTime() + 20 * 60000);
  return now >= start85PercentTime && now <= twentyMinsAfterEnd;
};

/**
 * Checks if a new request can be added for a session (before scheduled start time).
 */
export const isSessionRequestable = (
  startTime?: string | null,
  now: Date = new Date()
): boolean => {
  if (!startTime) return false;
  const start = new Date(startTime);
  if (isNaN(start.getTime())) return false;
  return now < start;
};

/**
 * Reads reviewed session IDs from localStorage safely.
 */
export const getReviewedSessionIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('reviewed_session_ids') || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Saves a reviewed session ID to localStorage.
 */
export const markSessionAsReviewed = (sessionId: string): void => {
  if (!sessionId) return;
  try {
    const reviewed = getReviewedSessionIds();
    if (!reviewed.includes(sessionId)) {
      reviewed.push(sessionId);
      localStorage.setItem('reviewed_session_ids', JSON.stringify(reviewed));
    }
  } catch (e) {}
};

/**
 * Checks if a session is already ended/finished (completed, missed, cancelled, or locally marked as ended/reviewed).
 */
export const isSessionEnded = (
  session: Pick<Schedule, 'id' | 'status'>,
  endedSessionIds: string[] = []
): boolean => {
  const status = session.status?.toLowerCase();
  if (status === 'completed' || status === 'missed' || status === 'cancelled') return true;
  if (endedSessionIds.includes(session.id)) return true;
  const reviewedIds = getReviewedSessionIds();
  return reviewedIds.includes(session.id);
};
