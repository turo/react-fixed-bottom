/**
 * This function returns true if we successfully detect Safari mobile.
 * It should test against Apple devices and then exclude most non Safari browsers
 * Source in https://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari
 *
 * @return {boolean}
 */
export function isSafariMobile(): boolean {
  if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return false;
  }

  const {
    navigator: {userAgent},
  } = window;
  return (
    /iP(ad|od|hone)/i.test(userAgent) &&
    /WebKit/i.test(userAgent) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent)
  );
}
