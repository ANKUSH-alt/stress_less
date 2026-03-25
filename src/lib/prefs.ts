export type AgeGroup = 'Teen' | 'Adult' | 'Senior';

export type UserPrefs = {
  name: string;
  ageGroup: AgeGroup;
  dailyGoal: string;
  remindersEnabled: boolean;
};

const PREFS_KEY = 'stressless:user-prefs';

export const DEFAULT_PREFS: UserPrefs = {
  name: 'Friend',
  ageGroup: 'Adult',
  dailyGoal: 'Stay calm and focused',
  remindersEnabled: true,
};

export const isAgeGroup = (value: string): value is AgeGroup =>
  value === 'Teen' || value === 'Adult' || value === 'Senior';

export const readUserPrefs = (): UserPrefs => {
  if (typeof window === 'undefined') return DEFAULT_PREFS;

  const raw = window.localStorage.getItem(PREFS_KEY);
  if (!raw) return DEFAULT_PREFS;

  try {
    const parsed = JSON.parse(raw) as Partial<UserPrefs>;
    return {
      name: parsed.name?.trim() || DEFAULT_PREFS.name,
      ageGroup:
        typeof parsed.ageGroup === 'string' && isAgeGroup(parsed.ageGroup)
          ? parsed.ageGroup
          : DEFAULT_PREFS.ageGroup,
      dailyGoal: parsed.dailyGoal?.trim() || DEFAULT_PREFS.dailyGoal,
      remindersEnabled:
        typeof parsed.remindersEnabled === 'boolean'
          ? parsed.remindersEnabled
          : DEFAULT_PREFS.remindersEnabled,
    };
  } catch {
    return DEFAULT_PREFS;
  }
};

export const saveUserPrefs = (prefs: UserPrefs) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};
