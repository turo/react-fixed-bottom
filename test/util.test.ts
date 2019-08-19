import {isSafariMobile} from '~/util';

describe('util.js tests', () => {
  let userAgentSpy;

  beforeEach(() => {
    userAgentSpy = jest.spyOn(navigator, 'userAgent', 'get');
  });

  test('isSafariMobile should be false when user agent does not match an apple device', () => {
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
    ].forEach(userAgent => {
      userAgentSpy.mockReturnValue(userAgent);
      expect(isSafariMobile()).toBe(false);
    });
  });

  test('isSafariMobile should be true when user agent is an apple device', () => {
    [
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.25 (KHTML, like Gecko) Version/11.0 Mobile/15A5304j Safari/604.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1'
    ].forEach(userAgent => {
      userAgentSpy.mockReturnValue(userAgent);
      expect(isSafariMobile()).toBe(true);
    });
  });
});
