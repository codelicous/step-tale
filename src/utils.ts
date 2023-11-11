export const keyBy = <T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K
) =>
  arr.reduce(
    (acc, item) => {
      acc[item[key]] = item;
      return acc;
    },
    {} as Record<string, T>
  );
