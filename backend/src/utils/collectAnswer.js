const MAX_TEXT_LENGTH = 4000;

export const collectAnswer = () => {
  const decoder = new TextDecoder();
  const answer = { text: '', card: null, records: [], sources: [], status: 'stopped' };
  let buffer = '';

  const apply = (event) => {
    if (event.type === 'text') answer.text += event.text;
    if (event.type === 'ui') answer.card = event.card;
    if (event.type === 'done') {
      answer.records = event.records ?? [];
      answer.sources = event.sources ?? [];
      answer.status = 'done';
    }
    if (event.type === 'error') {
      answer.text = event.message;
      answer.status = 'error';
    }
  };

  const readLines = (lines) =>
    lines.filter((line) => line.trim()).forEach((line) => apply(JSON.parse(line)));

  return {
    push(chunk) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      readLines(lines);
    },
    finish() {
      readLines([buffer]);
      return { ...answer, role: 'assistant', text: answer.text.slice(0, MAX_TEXT_LENGTH) };
    },
  };
};
