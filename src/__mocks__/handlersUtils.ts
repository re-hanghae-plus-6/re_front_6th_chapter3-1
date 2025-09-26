import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

// 생성 이벤트(초기데이터 설정)
// initEvents를 받은 이유? -> 이벤트 생성시에는 기존 이벤트에서 추가적으로 생성하는 경우가 많기 때문. 이벤트가 없을때는 빈 배열을 전달.
// 스프레드 연산자로 불변성을 유지. 기존 배열을 수정하지 않음
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  // msw 가상 서버를 사용해서 실제 api 통신처럼 사용. 기존 fetch와 axios를 직접 모킹하면 실제 테스트 상황과 다르게 네트워크 동작 위험이 있음
  server.use(
    // server.use는 테스트 후 자동으로 정리된다. 테스트 별로 동립적인 API동작을 만든다.
    http.get('/api/events', async () => {
      return HttpResponse.json({ events: mockEvents }); // 데이터를 한 번 가져온다
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

// 수정 이벤트 : 각각의 테스트마다 사용하는 데이터가 다르기 때문에 독립적이어야함
export const setupMockHandlerUpdating = () => {
  const mockEvents = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ] as Event[];

  server.use(
    http.get('/api/events', async () => {
      return HttpResponse.json({ events: mockEvents }); // 데이터를 한 번 가져온다
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updateEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);
      // 기존 index에 해당되는 mockEvents의 데이터를 교체
      mockEvents[index] = { ...mockEvents[index], ...updateEvent };
      return HttpResponse.json(mockEvents, { status: 200 });
    })
  );
};

// 삭제 이벤트 : 각각의 테스트마다 사용하는 데이터가 다르기 때문에 독립적이어야함
export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', async () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', async ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);
      mockEvents.splice(index, 1);
      return HttpResponse.json(mockEvents, { status: 204 });
    })
  );
};
