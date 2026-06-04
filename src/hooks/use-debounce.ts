import lodash from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(cb: T, delay: number) => {
  return lodash.debounce(cb, delay);
};
