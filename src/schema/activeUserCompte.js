import * as Yup from 'yup';

export const activeCompteSchema = Yup.object().shape({
    comp_legal_name: Yup.string()
        .required('This field is required'),
    comp_registration: Yup.string()
        .required('This field is required'),
    comp_address: Yup.string()
        .required('This field is required'),
    city: Yup.string()
        .required('This field is required'),
    address: Yup.string()
        .required('This field is required'),
    zip: Yup.string()
        .required('This field is required'),
    customers: Yup.string()
        .required('This field is required'),
    phone_number: Yup.string()
        .required('This field is required'),
    description: Yup.string()
        .required('This field is required'),
    comp_type: Yup.string()
        .required('This field is required'),
    industry: Yup.string()
        .required('This field is required'),
    personal_id: Yup.mixed().required('Your personal id is required!'),
    address_proof: Yup.mixed().required('Your proof of address is required!'),
    bank_details: Yup.mixed().required('Your bank details is required!'),
});
