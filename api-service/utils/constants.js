const APPLICATION_USER = 'user';
const SYSTEM_ADMINISTRATOR = 'administrator';
const SYSTEM_SUPER_USER = 'super user';
const ACCOUNT_ADMINISTRATOR = 'administrator';
const ACCOUNT_OWNER = 'owner';
const ACCOUNT_USER = 'user';
const AGENCY_SUPER_USER = 'super user';
const AGENCY_ADMINISTRATOR = 'administrator';
const AGENCY_SALES_ADMINISTRATOR = 'sales administrator';
const AGENCY_OPERATIONS_MANAGER = 'operations manager';
const AGENCY_PROJECT_MANAGER = 'project manager';
const AGENCY_SENIOR_ACCOUNT_MANAGER = 'senior account manager';
const AGENCY_SENIOR_PROJECT_COORDINATOR = 'senior project coordinator';
const AGENCY_ACCOUNT_MANAGER = 'account manager';
const AGENCY_PROJECT_COORDINATOR = 'project coordinator';
const AGENCY_ACCOUNT_COORDINATOR = 'account coordinator';
const AGENCY_PPC_TEAM_LEAD = 'ppc team lead';
const AGENCY_PPC_SPECIALIST = 'ppc specialist';
const AGENCY_JR_PPC_SPECIALIST = 'junior ppc specialist';
const AGENCY_HEAD_OF_WRITING = 'head of writing';
const AGENCY_WRITING_TEAM_LEAD = 'writing team lead';
const AGENCY_SENIOR_EDITOR = 'senior editor';
const AGENCY_EDITOR = 'editor';
const AGENCY_COPYWRITER = 'copywriter';
const AGENCY_KEYWORD_RESEARCHER = 'keyword researcher';
const AGENCY_HEAD_OF_DESIGN = 'head of design';
const AGENCY_DESIGN_TEAM_LEAD = 'design team lead';
const AGENCY_SENIOR_GRAPHIC_DESIGNER = 'senior graphic designer';
const AGENCY_GRAPHIC_DESIGNER = 'graphic designer';
const AGENCY_HEAD_OF_PPC = 'head of ppc';
const AGENCY_DIRECTOR_OF_OPERATIONS = 'director of operations';
const AGENCY_OPERATIONS_GENERAL_MANAGER = 'operations general manager';

const CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY = 'update campaign manually';
const CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET =
  'apply campaign recommened budget';
const CHANGE_REQUEST_TYPE_OPTIMIZATION = 'optimization';

const LIST_DEFAULT_QUERY = [
  'search',
  'page',
  'pageSize',
  'pageOffset',
  'sort',
  'scope',
  'attributes',
  'startDate',
  'endDate',
  'include',
];

const DATE_RANGE_QUERY = ['startDate', 'endDate'];

const OPERATORS = [
  { key: 'Since', value: 'gte' },
  { key: 'Before', value: 'lte' },
  { key: 'LessThanOrEqualTo', value: 'lte' },
  { key: 'GreaterThanOrEqualTo', value: 'gte' },
  { key: 'LessThan', value: 'lt' },
  { key: 'GreaterThan', value: 'gt' },
  { key: 'NotEqualTo', value: 'ne' },
  { key: 'EqualTo', value: 'eq' },
  { key: 'Between', value: 'between' },
];

const LESS_THAN = 'lessThan';
const LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo';
const NOT_EQUAL_TO = 'notEqualTo';
const EQUAL_TO = 'equalTo';
const BETWEEN = 'between';
const GREATER_THAN = 'greaterThan';
const GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqualTo';

const SUCCESS = 'SUCCESS';

module.exports = {
  OPERATORS,
  DATE_RANGE_QUERY,
  LIST_DEFAULT_QUERY,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  NOT_EQUAL_TO,
  EQUAL_TO,
  BETWEEN,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
  SUCCESS,
  AGENCY_SUPER_USER,
  AGENCY_ADMINISTRATOR,
  AGENCY_SALES_ADMINISTRATOR,
  AGENCY_OPERATIONS_MANAGER,
  AGENCY_PROJECT_MANAGER,
  AGENCY_SENIOR_ACCOUNT_MANAGER,
  AGENCY_SENIOR_PROJECT_COORDINATOR,
  AGENCY_ACCOUNT_MANAGER,
  AGENCY_PROJECT_COORDINATOR,
  AGENCY_ACCOUNT_COORDINATOR,
  AGENCY_PPC_TEAM_LEAD,
  AGENCY_PPC_SPECIALIST,
  AGENCY_JR_PPC_SPECIALIST,
  AGENCY_HEAD_OF_WRITING,
  AGENCY_WRITING_TEAM_LEAD,
  AGENCY_SENIOR_EDITOR,
  AGENCY_EDITOR,
  AGENCY_COPYWRITER,
  AGENCY_KEYWORD_RESEARCHER,
  AGENCY_HEAD_OF_DESIGN,
  AGENCY_DESIGN_TEAM_LEAD,
  AGENCY_SENIOR_GRAPHIC_DESIGNER,
  AGENCY_GRAPHIC_DESIGNER,
  APPLICATION_USER,
  SYSTEM_ADMINISTRATOR,
  SYSTEM_SUPER_USER,
  ACCOUNT_ADMINISTRATOR,
  ACCOUNT_OWNER,
  ACCOUNT_USER,
  AGENCY_HEAD_OF_PPC,
  AGENCY_DIRECTOR_OF_OPERATIONS,
  AGENCY_OPERATIONS_GENERAL_MANAGER,
  CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
  CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
  CHANGE_REQUEST_TYPE_OPTIMIZATION,
};
