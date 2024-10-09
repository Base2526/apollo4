import { Builder } from 'xml2js';

export const createXMLData = () => {
  const builder = new Builder();
  const data = {
    root: {
      item: [
        { name: 'Item 1', value: 'Value 1' },
        { name: 'Item 2', value: 'Value 2' },
      ],
    },
  };

  return builder.buildObject(data);
};
