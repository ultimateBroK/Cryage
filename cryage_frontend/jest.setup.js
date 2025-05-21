// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock ResizeObserver which isn't available in jsdom but is used by chart components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver which isn't available in jsdom
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the lightweight-charts library
jest.mock('lightweight-charts', () => {
  return {
    createChart: jest.fn().mockReturnValue({
      applyOptions: jest.fn(),
      resize: jest.fn(),
      timeScale: jest.fn().mockReturnValue({
        fitContent: jest.fn(),
        applyOptions: jest.fn(),
      }),
      priceScale: jest.fn().mockReturnValue({
        applyOptions: jest.fn(),
      }),
      addCandlestickSeries: jest.fn().mockReturnValue({
        applyOptions: jest.fn(),
        setData: jest.fn(),
      }),
      addHistogramSeries: jest.fn().mockReturnValue({
        applyOptions: jest.fn(),
        setData: jest.fn(),
      }),
      subscribeCrosshairMove: jest.fn(),
      unsubscribeCrosshairMove: jest.fn(),
      remove: jest.fn(),
    }),
  };
});
