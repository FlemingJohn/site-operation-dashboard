export const parseToolArguments = (schema, args) => {
  const result = schema.safeParse(args ?? {});
  if (result.success) return { data: result.data };
  return { error: result.error.issues.map((issue) => issue.message).join(' ') };
};
