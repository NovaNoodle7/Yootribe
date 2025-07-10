import * as Yup from 'yup';

export const createCampaignSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'NFT name is too short')
    .max(80, 'NFT name is too long!')
    .required('This field is required'),
  title: Yup.string()
    .min(2, 'Description too Short!')
    .max(500, 'Description too Long!')
    .required('Required'),
  content: Yup.string()
    .min(2, 'Your secret message is too short')
    .max(300, 'Your secret message is too long!')
    .required('This field is required'),
  image: Yup.mixed().required('Your NFT image is required!')
});
