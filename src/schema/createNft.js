import * as Yup from 'yup';

export const createNFTSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'NFT name is too short')
    .max(80, 'NFT name is too long!')
    .required('This field is required'),
  description: Yup.string()
    .min(2, 'Description too Short!')
    .max(500, 'Description too Long!')
    .required('Required'),
  message: Yup.string()
    .min(2, 'Your secret message is too short')
    .max(500, 'Your secret message is too long!')
    .required('This field is required'),
  image: Yup.mixed().required('Your NFT image is required!'),
  is_free: Yup.boolean().test(
    'is boolean',
    'Please choose one option',
    (value) => value === true || value === false
  ),
  price: Yup.number().when(['is_free'], {
    is: 0,
    then: Yup.number().min(0, 'Price must be higher than 0').required('You need to enter price')
  }),
  copies: Yup.number().min(1, 'You need to add atleast 1 copy').required('This field is required')
});

// export const createNFTPricingSchema = Yup.object().shape({
//   is_free: Yup.boolean().test(
//     'is boolean',
//     'Please choose one option',
//     (value) => value === true || value === false
//   ),
//   price: Yup.number().when(['is_free'], {
//     is: 0,
//     then: Yup.number().min(0, 'Price must be higher than 0').required('You need to enter price')
//   }),
//   copies: Yup.number().min(1, 'You need to add atleast 1 copy').required('This field is required')
// });

export const editNFTSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'NFT name is too short')
    .max(80, 'NFT name is too long!')
    .required('This field is required'),
  description: Yup.string()
    .min(2, 'Description too Short!')
    .max(500, 'Description too Long!')
    .required('Required'),
  message: Yup.string()
    .min(2, 'Your secret message is too short')
    .max(500, 'Your secret message is too long!')
    .required('This field is required'),
  image: Yup.mixed().required('Your NFT image is required!'),
  is_free: Yup.boolean()
    .test('is boolean', 'Please choose one option', (value) => value === true || value === false)
    .required('Please select one option')
    .typeError('Please select one option'),
  price: Yup.number().when(['is_free'], {
    is: false,
    then: Yup.number().min(0.1, 'Price must be higher than $0').required('You need to enter price')
  }),
  copies: Yup.number().min(1, 'You need to add atleast 1 copy').required('This field is required')
});
