import { DateTime, Interval } from 'luxon';

export enum TimeDuration {
    Hour = 'hour',
}

export class Time {
    public static getDiff({ from = new Date(), to, duration }: { from?: Date; to: Date; duration: TimeDuration }): number {
        const startLuxon = DateTime.fromJSDate(from);
        const endLuxon = DateTime.fromJSDate(to);

        const interval = Interval.fromDateTimes(startLuxon, endLuxon);

        return interval.length(duration);
    }
}
