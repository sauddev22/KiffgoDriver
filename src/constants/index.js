import {Images} from '../theme';

// export const TIME_ZONE = (-1 * new Date().getTimezoneOffset()) / 60;
export const APP_URL = '';
export const APP_DOMAIN = '';
export const QUERY_LIMIT = 10;
export const SAGA_ALERT_TIMEOUT = 500;

// date time formats
export const DATE_FORMAT1 = 'dddd, DD MMMM, YYYY';
export const DATE_FORMAT2 = 'Do MMM';
export const DATE_FORMAT3 = 'Do MMM YYYY';
export const DATE_FORMAT4 = 'Do MMMM YYYY, HH:mm';
export const DATE_FORMAT5 = 'DD/MM/YY, hh:mm a';
export const DATE_TIME_FORMAT1 = 'YYYY-MM-DD HH:mm';
export const DATE_TIME_FORMAT2 = 'H:mm, DD MMM YYYY';
export const TIME_FORMAT1 = 'HH:mm';
export const TIME_FORMAT2 = 'H [h] : mm [min]';
export const TIME_DAY_FORMAT1 = 'ddd - HH:mm';
export const DATE_TIME_FORMAT7 = 'HH:mm (DD MMM)';

// Messages

export const LOCATION_PERMISSION_DENIED_ERROR2 =
  'Location permission required, please go to app settings to allow access';
export const INVALID_NAME_ERROR = 'Invalid name';
export const INVALID_EMAIL_ERROR = 'Invalid email';
export const INTERNET_ERROR = 'Please connect to the working internet';
export const SESSION_EXPIRED_ERROR = 'Session expired, Please login again';
export const SOMETHING_WRONG = 'Something went wrong';
export const NOTIFICATION_PERMISSION_DENIED_ERROR =
  'Please allow notifications and get notified timely';
export const FIELD_IS_EMPTY = 'Field is empty';

// Message types
export const MESSAGE_TYPES = {
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success',
};
export const KIFFGO_NOTIFICATION_CHANNEL = {
  id: 'kiffgo-driver-channel',
  name: 'Kiffgo Notifications',
};
export const KIFFGO_NOTIFICATION_CHANNEL_DEFAULT = {
  id: 'kiffgo-driver-channel-default',
  name: 'Kiffgo Notifications default',
};
//job types
export const NOTIFICATION_TYPES = {
  MARK_AVAILABILITY: 'mark_availability',
  NEW_PRIORITY_JOB: 'new_priority_job',
  JOB_COMING_SOON: 'job_coming_soon',
  GOTO_ACCEPTED_JOB_DETAILS: 'goto_accepted_job_details',
  NEW_TASK_ASSIGNED: 'new_task_assigned',
  TASK_ETA_UPDATED: 'task_eta_updated',
  MANY_TASKS_ASSIGNED: 'many_tasks_assigned',
  TASK_UPDATED: 'task_updated',
  TASK_UNASSIGNED: 'task_unassigned',
  TASK_DELETED: 'task_deleted',
  INTRANSIT_TASK_UPDATED: 'intransit_task_updated',
  TASK_SEQUENCE_CHANGED: 'task_sequence_changed',
  DRIVER_IS_INACTIVE: 'driver_is_inactive',
  DRIVER_IS_INACTIVE_AUTO: 'driver_is_inactive_auto',
  SWITCH_ALLOW_OFFLINE: 'switch_allow_offline',
};
// File Types
export const FILE_TYPES = {VIDEO: 'video', IMAGE: 'image', AUDIO: 'audi'};
export const TRACKING_MODE = {
  NONE: 'none',
  HIGH_QUALITY: 'highQuality',
  ENERGY_SAVING: 'energySaving',
};
export const tours = [
  {
    title: 'Flexible working hours',
    content:
      'Take control of your life. Be your own boss. We operate all day, so you can work when it suits your schedule.',
    image: Images.tour_two,
  },
  {
    title: 'Guaranteed earnings',
    content:
      'Kiffgo is building the smartest courier app. Wherever you go, we will try to find a backload to minimize your spare capacity and maximize your earnings.',
    image: Images.tour_one,
  },
  {
    title: 'No Chasing Payment',
    content:
      'You get paid for every delivery you make without invoicing  or chasing customers for payment. and always on-time, it is automated.',
    image: Images.tour_three,
  },
];
export const resendError =
  "You've attempted your maximum limit. Please try again later";

export const vehicleTypes = [
  {
    name: 'Cargo Bike',
    image: Images.vehiclei,
    id: 0,
  },
  {
    name: 'Small Van',
    image: Images.vehicleii,
    id: 1,
  },
  {
    name: 'Medium Van',
    image: Images.vehicleiii,
    id: 2,
  },
  {
    name: 'Large Van',
    image: Images.vehicleiv,
    id: 3,
  },
  {
    name: 'XL - Luton Van',
    image: Images.vehiclev,
    id: 4,
  },
];

export const IMAGE_MAX_WIDTH = 500;
export const IMAGE_MAX_HEIGHT = 500;
export const GOOGLE_API_KEY = 'AIzaSyCD9aV_BCU9BPjYqGrCgJeuV6CZdsa21uk';

export const LOCATION = {
  id: 11,
  postcode: 'SO16 5JW',
  order: 0,
  internal_order: 'q23234',
  qty_items: '0',
  description: 'test',
  full_address:
    'Southampton G H M C, Works Department, 110 Coxford Road, Southampton, SO16',
  start: true,
  end: false,
  stairs: 'HasLift',
  instructions: 'test',
  contact_name: 'test',
  contact_phone: '',
  contact_email: 'test@yopmail.com',
  distance_miles: '74.8',
  duration_seconds: '7293',
  uniqueurl: 'DHA259103TyE',
  loading_unloading_time: 10,
  status: 'pending',
  images: [
    {
      createdAt: '2019-11-26T11:57:39.933Z',
      updatedAt: '2019-11-26T11:57:39.933Z',
      id: 4,
      public_id: 'tbiaja4yhlxaw3mao8nt',
      version: 1568704458,
      width: 122,
      height: 108,
      format: 'png',
      bytes: 19906,
      url:
        'http://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
      secure_url:
        'https://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
    },
    {
      createdAt: '2019-11-26T11:57:39.933Z',
      updatedAt: '2019-11-26T11:57:39.933Z',
      id: 4,
      public_id: 'tbiaja4yhlxaw3mao8nt',
      version: 1568704458,
      width: 122,
      height: 108,
      format: 'png',
      bytes: 19906,
      url:
        'http://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
      secure_url:
        'https://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
    },
    {
      createdAt: '2019-11-26T11:57:39.933Z',
      updatedAt: '2019-11-26T11:57:39.933Z',
      id: 4,
      public_id: 'tbiaja4yhlxaw3mao8nt',
      version: 1568704458,
      width: 122,
      height: 108,
      format: 'png',
      bytes: 19906,
      url:
        'http://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
      secure_url:
        'https://res.cloudinary.com/kiffgo/image/upload/v1568704458/tbiaja4yhlxaw3mao8nt.png',
    },
  ],
};

export const CARGO = 'cargo';
export const LUTON = 'luton';
export const LONG = 'long';

export const SELECT_VEHICLE = 'Please select vehicle';
export const timeLaps = [
  '00:00',
  '00:15',
  '00:30',
  '00:45',
  '01:00',
  '01:15',
  '01:30',
  '01:45',
  '02:00',
  '02:15',
  '02:30',
  '02:45',
  '03:00',
  '03:15',
  '03:30',
  '03:45',
  '04:00',
  '04:15',
  '04:30',
  '04:45',
  '05:00',
  '05:15',
  '05:30',
  '05:45',
  '06:00',
  '06:15',
  '06:30',
  '06:45',
  '07:00',
  '07:15',
  '07:30',
  '07:45',
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
  '17:15',
  '17:30',
  '17:45',
  '18:00',
  '18:15',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:30',
  '19:45',
  '20:00',
  '20:15',
  '20:30',
  '20:45',
  '21:00',
  '21:15',
  '21:30',
  '21:45',
  '22:00',
  '22:15',
  '22:30',
  '22:45',
  '23:00',
  '23:15',
  '23:30',
  '23:45',
];
export const MAP_TYPES = {
  APPLE: 'apple',
  GOOGLE: 'google',
  WAZE: 'waze',
};

export const offlineTimes = ['1h', '2h', '3h', '4h', '5h', '6h', '8h'];
export const receivers = {
  self: 'SELF',
  reception: 'RECEPTION',
  neighbor: 'NEIGHBOR',
};
export const CHANGE_TEXT = '!Change';
export const TRACKING_SECRETE_KEY =
  'OGWiS2LPMFob5yfjQohVrtZjyjGzGU9HhH7ek9Vmhlg8pbeltvP429oG';
export const activeOpacity = {
  high: 0.2,
  medium: 0.7,
  low: 0.9,
  off: 100,
};
export const USER_TRANSPORT_FIELDS_NAME = {
  ID: 'id',
  TRANSPORT_NAME: 'transport_name',
  NUMBER_PLATE: 'number_plate',
  MAKE_MODEL: 'make_and_model',
  YEAR: 'year',
  COLOR: 'color',
  TRANSPORT_ID: 'transport_id',
  DRIVER: 'driver',
};
export const USER_FIELDS_NAME = {
  TRANSPORT: 'transport',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  ID: 'id',
  SHOW_CHANGE_PASSWORD: 'showChangePasswordScreen',
  NAME: 'name',
  PHONE: 'phone',
  PASSWORD: 'password',
  EMAIL: 'email',
  ADDRESS: 'address',
  CITY: 'city',
  TOWN: 'town',
  POST_CODE: 'postcode',
  CAPACITY: 'capacity',
  STATUS: 'status',
  DELETED: 'deleted',
  IMAGE: 'image',
  LOCATION: 'location',
  USER: 'user',
  BUSINESS: 'business',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_TOKEN: 'access_token',
  IS_ONLINE: 'is_online',
  ROUTE_STARTED: 'route_started',
};
//task Status
export const TASK_STATUS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  IN_TRANSIT: 'IN_TRANSIT',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

// task detail
export const TASK_FIELDS_NAME = {
  RECIPIENT_PHONE: 'recipient_phone',
  RECIPIENT_NAME: 'recipient_name',
  RECIPIENT_EMAIL: 'recipient_email',
  RECIPIENT_NOTES: 'recipient_notes',
  IS_PICKUP: 'isPickup',
  IS_DROPOFF: 'isDropoff',
  DESCRIPTION: 'description',
  LOCATION: 'location',
  DESTINATION_NOTES: 'destination_notes',
  DRIVER_NOTES: 'driver_notes',
  COMPLETE_AFTER: 'completeAfter',
  COMPLETE_BEFORE: 'completeBefore',
  QUANTITY: 'quantity',
  SERVICE_MIN: 'serviceMin',
  PROOF: 'proof',
  PICTURE: 'pictures',
  PICTURE_TIME: 'picture_time',
  RECIPIENT_PHONE_ERROR: 'recipient_phone_error',
  RECIPIENT_NAME_ERROR: 'recipient_name_error',
  SIGNATURE: 'signature',
  SIGNATURE_TIME: 'signature_time',
  LOCATION_ADDRESS: 'location_address',
  LOCATION_ADDRESS_ERROR: 'location_address_error',
  LOCATION_POSTCODE: 'location_postcode',
  LOCATION_BUSINESS_NAME: 'location_business_name',
  LOCATION_CITY: 'location_city',
  LOCATION_BUILDING: 'location_building',
  LOCATION_TOWN: 'location_town',
  LOCATION_LATITUDE: 'location_latitude',
  LOCATION_LONGITUDE: 'location_longitude',
  INTERNAL_ORDER_NUMBER: 'interal_order_number',
  ID: 'id',
  TIMELINE: 'timeline',
  DRIVER_ID: 'driver_id',
  DELAYED_IN_MINUTES: 'delayed_in_minutes',
  STATUS: 'status',
  ETA: 'eta',
  CREATED_AT: 'created_at',
  TASK_NUMBER: 'task_number',
  OWNER: 'owner',
  DRIVER_NAME: 'driver_name',
  DRIVER_PHONE: 'driver_phone',
  UPDATED_AT: 'updatedAt',
  IS_SUCCESS: 'is_success',
  REASON: 'reason',
  DURATION: 'duration_stop_sec',
  SEQUENCE: 'sequence',
  STREET_NAME: 'street_name',
  STREET_NUMBER: 'street_number',
  COUNTRY_NAME: 'country_name',
  BARCODES: 'barcodes',
  BARCODES_BACKUP: 'barcodes_backup',
  ACTUAL_START_TIME: 'actual_start_time',
  ACTUAL_END_TIME: 'actual_end_time',
  OFFLINE_TASK: 'offline_task',
  IS_SYNCED: 'is_synced',
};

export const CENTRAL_LONDON = {lat: 51.509099, lng: -0.126541};
export const TASK_PROOFS = {
  PICTURE: 'picture',
  SIGNATURE: 'signature',
  NOTES: 'notes',
};
export const logFileName = 'kiffgoLogLocal';
export const phoneInputCountryList = [
  {
    name: 'France',
    iso2: 'fr',
    dialCode: '33',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'United States',
    iso2: 'us',
    dialCode: '1',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'Canada',
    iso2: 'ca',
    dialCode: '1',
    priority: 1,
    areaCodes: [
      '204',
      '226',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '387',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '548',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '672',
      '705',
      '709',
      '742',
      '778',
      '780',
      '782',
      '807',
      '819',
      '825',
      '867',
      '873',
      '902',
      '905',
    ],
  },
  {
    name: 'Australia',
    iso2: 'au',
    dialCode: '61',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'United Kingdom',
    iso2: 'gb',
    dialCode: '44',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'Pakistan (‫پاکستان‬‎)',
    iso2: 'pk',
    dialCode: '92',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'India (भारत)',
    iso2: 'in',
    dialCode: '91',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'Oman (‫عُمان‬‎)',
    iso2: 'om',
    dialCode: '968',
    priority: 0,
    areaCodes: null,
  },
  {
    name: 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
    iso2: 'ae',
    dialCode: '971',
    priority: 0,
    areaCodes: null,
  },
];
