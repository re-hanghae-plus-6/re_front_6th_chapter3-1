import { http, HttpResponse } from 'msw';

import { events } from '../__mocks__/response/events.json' assert { type: 'json' };
import { Event } from '../types';

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events });
  }),

  // 새로운 리소스에 대한 생성이기 때문에 (새로운 이벤트 생성) status는 201로 임의로 내려주기
  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    newEvent.id = String(events.length + 1)
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 이벤트 수정
  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedEvent = (await request.json()) as Event;
    const index = events.findIndex((event) => event.id === id);

    if (index !== -1){
      return HttpResponse.json({...events[index], ...updatedEvent});
    } else {
      return HttpResponse.json(null, { status: 404 })
    }

  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const index = events.findIndex((event) => event.id === id);

    if (index !== -1){
      return new HttpResponse(null, { status: 204 })
    } else {
      return new HttpResponse(null, {status: 404})
    }
  }),
];
