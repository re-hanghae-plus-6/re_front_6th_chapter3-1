## easy.useSearch.spec

1.  new Date() 시스템 시간 값이 이상하다
    지금 8월인데 10월로 나온다
    이것때문에 dummy event 8월로 만들어두고 하루종일 테스트 통과 안되다가
    설마하고 new Date() 콘솔에 찍어보니까 10월이라 열받는다.

            ```ts
            beforeEach(() => {
            expect.hasAssertions(); // ? Med: 이걸 왜 써야하는지 물어보자

            vi.setSystemTime(new Date('2025-10-01')); // ? Med: 이걸 왜 써야하는지 물어보자
            });
            ```

    이것 때문이네!!

## easy.dateUtils.spec

1. getDaysInMonth

   ```ts
   function getDaysInMonth(year: number, month: number): number {
     return new Date(year, month, 0).getDate();
   }
   ```

   day에 0을 넣음으로써 monthIndex에 넣은 정수의 -1월을 계산한다.

   > new Date(2025, 8, 0) -> 여기서 `8`은 `9월`,
   > day가 `0`으로 `9월`에서 `-1`을 한 `8월`로 계산됨.
   > month param에 `8`을 넣고 결과값도 `8월`로 계산됨.

   monthIndex는 0~11로 월을 판단하는데, 우리가 쓰는 1~12월과는 -1씩 차이나기 때문에 moth parameter가 우리가 실사용하는 월로 계산될 수 있다.
   함수 제대로 안 보고 막 작성했다가 꽤나 꼬였었음.
