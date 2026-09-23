export type MasteryStage = 'Not Started' | 'Lectures' | 'PYQs' | 'Mastered';

export const MASTERY_STAGES: MasteryStage[] = ['Not Started', 'Lectures', 'PYQs', 'Mastered'];

export interface Subtopic {
  id: string;
  name: string;
  sem5Synergy?: boolean;
  highYield?: boolean;
  notes: boolean;
  pyq15y: boolean;
  dppDone: boolean;
  mastery: MasteryStage;
}

export interface Subject {
  id: string;
  name: string;
  weightagePct: number;
  subtopics: Subtopic[];
}

export interface DayLog {
  date: string; // ISO date, yyyy-mm-dd
  studyHours: number;
  screenHours: number;
  walked: boolean;
  activeRetrieval: boolean;
}

export interface WeekLog {
  weekStart: string; // ISO date of Monday
  days: Record<string, DayLog>; // keyed by ISO date
}

export interface MockSubjectScore {
  mathsApt: number;
  geotech: number;
  env: number;
  otherCivil: number;
  negativeMarks: number;
}

export interface MockEntry {
  id: string;
  label: string;
  date: string;
  totalScore: number;
  subjectScores: MockSubjectScore;
}

export interface UpcomingMockPlan {
  id: string;
  label: string;
  scopedSubtopicIds: string[];
}
