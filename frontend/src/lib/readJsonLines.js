export const readJsonLines = async (stream, onItem) => {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  let buffered = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffered += value;
    const lines = buffered.split('\n');
    buffered = lines.pop();
    lines.filter(Boolean).forEach((line) => onItem(JSON.parse(line)));
  }
  if (buffered.trim()) onItem(JSON.parse(buffered));
};
