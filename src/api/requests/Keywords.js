import Api from '../Api';

export const listKeywords = async (data) =>
  await Api.http({
    method: 'get',
    url: '/keywords',
    query: data,
  });

export const getKeywordById = async (data) =>
  await Api.http({
    method: 'get',
    url: '/keywords/'+data,
  });
