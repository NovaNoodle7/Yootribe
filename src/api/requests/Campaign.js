import Api from '../Api';

export const getCampaignBySlug = async (slug) =>
  await Api.http({
    method: 'get',
    url: `/campaigns/by-slug/${slug}`
  });

export const getCampaignLeads = async (id) =>
  await Api.http({
    method: 'get',
    url: `/campaigns/${id}/leads`
  });
