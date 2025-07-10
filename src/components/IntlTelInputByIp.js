import IntlTelInput from 'react-intl-tel-input';
import { useGetIPData } from '../hooks/useGetIPData';

export const IntlTelInputByIp = ({ ...intlInputProps }) => {
  const getIPData = useGetIPData();

  return <IntlTelInput {...intlInputProps} defaultCountry={getIPData?.country_code?.toLowerCase()} telInputProps={{maxLength:11}}/>;
};
