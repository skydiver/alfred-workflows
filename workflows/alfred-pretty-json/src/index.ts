import { itemToData } from 'dynamo-converters';

(async () => {
  const mode = process.argv[2] || 'json';
  const content = process.argv[3] as string;

  /** Read content from stdin */
  if (!content) {
    console.log(false);
    process.exit(0);
  }

  /** Check if content is a valid JSON */
  try {
    JSON.parse(content);
  } catch {
    console.log(false);
    process.exit(0);
  }

  let data;

  /** Parse content depending on the mode */
  if (mode === 'ddbjson') {
    data = itemToData(JSON.parse(content));
  } else {
    data = JSON.parse(content);
  }

  /** Output prettified JSON */
  console.log(JSON.stringify(data, null, 2));
})();
