export interface Period {
  current: {
    label: string;
    counts: Record<string, number>;
  };
  previous: {
    label: string;
    counts: Record<string, number>;
  };
  metrics: Record<
    string,
    {
      current: number;
      previous: number;
      delta_abs: number;
      delta_pct: number | null;
      icon: string;
      color: string;
    }
  >;
}

export interface PeriodCardProps {
  title: string;
  period: Period;
}

export interface WeekCardProps {
  title: string;
  period: Period;
}
