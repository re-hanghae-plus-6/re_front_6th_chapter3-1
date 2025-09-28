import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2025-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = parseDateTime('2025-07-01', '14:30');
    expect(date).toEqual(new Date('2025-07-01T14:30:00'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2025/07/01', '14:30');
    expect(date.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2025-07-01', '25:30');
    expect(date.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '14:30');
    expect(date.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange.start).toEqual(new Date('2025-07-01T14:30:00'));
    expect(dateRange.end).toEqual(new Date('2025-07-01T15:30:00'));
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025/07/01',
      startTime: '14:30',
      endTime: '15:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange.start.toString()).toBe('Invalid Date');
    expect(dateRange.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '25:30',
      endTime: '27:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange.start.toString()).toBe('Invalid Date');
    expect(dateRange.end.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '16:00',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };

    const result = isOverlapping(event1, event2);
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '16:00',
      endTime: '17:00',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };

    const result = isOverlapping(event1, event2);
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    },
    {
      id: '2',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '16:00',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    },
    {
      id: '3',
      title: 'Test Event',
      date: '2025-07-01',
      startTime: '17:00',
      endTime: '18:00',
      description: 'Test Description',
      location: 'Test Location',
      category: 'Test Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      title: 'New Event',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '15:00',
      description: 'New Description',
      location: 'New Location',
      category: 'New Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };

    const result = findOverlappingEvents(newEvent, events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      title: 'New Event',
      date: '2025-07-01',
      startTime: '23:00',
      endTime: '24:00',
      description: 'New Description',
      location: 'New Location',
      category: 'New Category',
      repeat: {
        type: 'none',
        interval: 1,
        endDate: '2025-07-01',
      },
      notificationTime: 10,
    };

    const result = findOverlappingEvents(newEvent, events);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
