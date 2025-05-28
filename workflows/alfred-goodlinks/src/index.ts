import minimist from 'minimist';

(async () => {
  const args = minimist(process.argv.slice(2), { '--': true });

  const urls = args['--']?.length ? args['--'] : args._;

  let data: { title: string; subtitle: string; arg: string }[];

  if (!urls || urls.length === 0) {
    data = [
      {
        title: 'No URLs provided',
        subtitle: 'Cannot retrieve URLs from the specified browser',
        arg: '',
      },
    ];
  } else {
    data = urls.map((url: string) => {
      return {
        title: url,
        subtitle: `Save ${url} to GoodLinks`,
        arg: url,
      };
    });
  }

  const result = {
    items: data,
  };

  console.log(JSON.stringify(result, null, 2));
})();
