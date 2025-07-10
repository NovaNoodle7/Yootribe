"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editNFTSchema = exports.createNFTSchema = void 0;

var Yup = _interopRequireWildcard(require("yup"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var createNFTSchema = Yup.object().shape({
  name: Yup.string().min(2, 'NFT name is too short').max(80, 'NFT name is too long!').required('This field is required'),
  description: Yup.string().min(2, 'Description too Short!').max(500, 'Description too Long!').required('Required'),
  message: Yup.string().min(2, 'Your secret message is too short').max(500, 'Your secret message is too long!').required('This field is required'),
  image: Yup.mixed().required('Your NFT image is required!'),
  is_free: Yup["boolean"]().test('is boolean', 'Please choose one option', function (value) {
    return value === true || value === false;
  }),
  price: Yup.number().when(['is_free'], {
    is: 0,
    then: Yup.number().min(0, 'Price must be higher than 0').required('You need to enter price')
  }),
  copies: Yup.number().min(1, 'You need to add atleast 1 copy').required('This field is required')
}); // export const createNFTPricingSchema = Yup.object().shape({
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

exports.createNFTSchema = createNFTSchema;
var editNFTSchema = Yup.object().shape({
  name: Yup.string().min(2, 'NFT name is too short').max(80, 'NFT name is too long!').required('This field is required'),
  description: Yup.string().min(2, 'Description too Short!').max(500, 'Description too Long!').required('Required'),
  message: Yup.string().min(2, 'Your secret message is too short').max(500, 'Your secret message is too long!').required('This field is required'),
  image: Yup.mixed().required('Your NFT image is required!'),
  is_free: Yup["boolean"]().test('is boolean', 'Please choose one option', function (value) {
    return value === true || value === false;
  }).required('Please select one option').typeError('Please select one option'),
  price: Yup.number().when(['is_free'], {
    is: false,
    then: Yup.number().min(0.1, 'Price must be higher than $0').required('You need to enter price')
  }),
  copies: Yup.number().min(1, 'You need to add atleast 1 copy').required('This field is required')
});
exports.editNFTSchema = editNFTSchema;