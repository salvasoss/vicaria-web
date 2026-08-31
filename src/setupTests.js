import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  value: vi.fn().mockResolvedValue(undefined),
  writable: true,
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  value: vi.fn(),
  writable: true,
});
