export const countEach = (expression, values) =>
  values
    .map((value) => `COUNT(*) FILTER (WHERE ${expression} = '${value}')::int AS "${value}"`)
    .join(',\n    ');
