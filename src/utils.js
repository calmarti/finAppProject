export default  {
  YESTERDAY: Math.floor(Date.now() / 1000) - Math.floor(1 * 24 * 3600), //must be seconds , not miliseconds
  A_YEAR_AGO: Math.floor(Date.now() / 1000) - Math.floor(365 * 24 * 3600),
};
