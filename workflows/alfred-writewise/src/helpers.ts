export const output = (mode: string, original: string, improved: string): string => {
  if (mode === 'BASIC') {
    return improved;
  }

  const output = [];
  const divider = '==='.repeat(50);

  output.push(divider);
  output.push(original);
  output.push(divider);
  output.push(improved);
  output.push(divider);

  return output.join('\n');
};
