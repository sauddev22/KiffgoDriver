import _ from 'lodash';

const make_user_data = data => {
  const tempData = _.cloneDeep(data);
  let userData = {};
  let vehicleData = {};
  const getProps = [
    'email',
    'phone',
    'firstName',
    'lastName',
    'verification_code',
    'is_verified',
    'income_previous_week',
    'income_current_week',
  ];

  userData = tempData[0].driver_profile[0];
  for (let i = 0; i < getProps.length; i++) {
    userData[getProps[i]] = tempData[0][getProps[i]] || '';
  }

  vehicleData = tempData[0].vehicle[0];
  vehicleData.homeArea = userData.homeArea;
  // vehicleData.wheelBase = 'luton';
  console.log('here');
  return {userData, vehicleData};
};
export {make_user_data};
