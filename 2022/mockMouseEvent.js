/**
 * 模拟mousedown事件
 */
function mockMouseDown(ele) {
  window.pdfSelectTextRect.downX = 353;
  window.pdfSelectTextRect.downY = 26;
  window.pdfSelected = true;
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousedown', true, true, window, 'custom', 0, 0, window.pdfSelectTextRect.downX, window.pdfSelectTextRect.downY, false, false, false, false, 0, null);
  ele.dispatchEvent(event);
}

/**
 * 模拟mouseup事件
 */
function mockMouseUp(ele) {
  window.pdfSelectTextRect.downX = 353;
  window.pdfSelectTextRect.downY = 26;
  window.pdfSelected = true;
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseup', true, true, window, 'custom', 0, 0, window.pdfSelectTextRect.downX, window.pdfSelectTextRect.downY, false, false, false, false, 0, null);
  ele.dispatchEvent(event);
}