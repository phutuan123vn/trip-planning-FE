import lodash from "lodash";

export const useDebounce = (cb: () => void, delay: number) => {
  return lodash.debounce(cb, delay);
};
