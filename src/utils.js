const utils = {
  stockConfig: (data) => ({
    appendPadding: [0, 10, 0, 0],
    data: data,
    xField: "date",
    yField: ["open", "close", "high", "low"],
    slider: {},
  }),
};

export const { stockConfig } = utils;
