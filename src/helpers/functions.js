export const getDaysToEnd = (startDate, endDate) => {
  const currentDate = new Date();
  const starts = new Date(startDate);
  const ends = new Date(endDate);

  let TotalDays = Math.ceil((ends.getTime() - starts.getTime()) / (1000 * 3600 * 24));
  let CurrentTotalDays = Math.ceil((currentDate.getTime() - starts.getTime()) / (1000 * 3600 * 24));

  return { TotalDays, CurrentTotalDays };
};

export const isUrlValid = (url) => {
  const regex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;

  return url.match(regex);
};
