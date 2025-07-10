import Api from '../Api';

export const listQuestions = async () =>
  await Api.http({
    method: 'get',
    url: '/questions',
  });

export const getQuestionById = async (data) =>
  await Api.http({
    method: 'get',
    url: '/questions/'+data,
  });
