import moment from 'moment';

const FULL_DATE = 'DD-MM-YY hh:mm A';

export const getFullDateFromISO = (date) => moment(date).format(FULL_DATE);

export const getFromByDate = (date) => moment(date).fromNow();
