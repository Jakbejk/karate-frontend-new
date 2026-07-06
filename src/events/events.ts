import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {GetHttpClient} from '../commons/RestTools';
import {Page} from '../commons/PageTools';

export type EventType = 'TRAINING' | 'COMPETITION' | 'ABOVE_STANDARD_TRAINING' | 'TRAINEE_TRAINING';

export interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  note: string;
  date: string; // dd.MM.yyyy HH:mm:ss
  signBoundaryDate: string;
  durationType: string;
  duration: number;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'events',
  templateUrl: 'template.html',
  styleUrl: 'events.css',
  imports: [TranslateModule],
  standalone: true
})
export class Events implements OnInit, OnDestroy {
  private readonly today = new Date();
  private readonly http = new GetHttpClient<Page<CalendarEvent>>();
  private readonly cdr = inject(ChangeDetectorRef);
  private eventsSubscription?: Subscription;

  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();

  weeks: CalendarDay[][] = [];

  readonly monthKeys = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  readonly dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  private events: CalendarEvent[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  get currentMonthKey(): string {
    return this.monthKeys[this.currentMonth];
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadEvents();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadEvents();
  }

  goToToday(): void {
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventsSubscription?.unsubscribe();
    this.events = [];
    this.buildCalendar();
    const from = this.toDateKey(new Date(this.currentYear, this.currentMonth, 1));
    const to = this.toDateKey(new Date(this.currentYear, this.currentMonth + 1, 0));
    this.eventsSubscription = this.http.GET('/api/v1/events', {params: {from, to}})
      .subscribe(page => {
        this.events = page?.content ?? [];
        this.buildCalendar();
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
  }

  private buildCalendar(): void {
    const todayMidnight = new Date(this.today);
    todayMidnight.setHours(0, 0, 0, 0);
    const todayTime = todayMidnight.getTime();

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Convert Sunday-first (JS default) to Monday-first
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    const days: CalendarDay[] = [];

    // Padding from previous month
    for (let i = startDow - 1; i >= 0; i--) {
      days.push(this.makeDay(new Date(this.currentYear, this.currentMonth, -i), false, todayTime));
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(this.makeDay(new Date(this.currentYear, this.currentMonth, d), true, todayTime));
    }

    // Padding for next month to complete last week
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push(this.makeDay(new Date(this.currentYear, this.currentMonth + 1, i), false, todayTime));
    }

    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  private toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${d}.${m}.${y}`;
  }

  private makeDay(date: Date, isCurrentMonth: boolean, todayTime: number): CalendarDay {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    const dateKey = this.toDateKey(date);
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: midnight.getTime() === todayTime,
      events: this.events.filter(e => e.date.slice(0, 10) === dateKey)
    };
  }

  getEventTypeClass(type: EventType): string {
    const map: Record<EventType, string> = {
      TRAINING: 'event-training',
      COMPETITION: 'event-competition',
      ABOVE_STANDARD_TRAINING: 'event-above-standard',
      TRAINEE_TRAINING: 'event-trainee',
    };
    return map[type] ?? '';
  }
}
