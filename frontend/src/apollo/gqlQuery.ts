import { gql } from "@apollo/client";
// Define types for inputs
type JSON = Record<string, any>;
type ID = string;

// query
export const query_dblog = gql`query dblog { dblog }`;
export const query_member = gql`query member($id: ID!) { member(_id: $id) }`;
export const query_members = gql`query members { members }`;
export const query_files = gql`query files { files }`;
export const query_test_fetch_node = gql`query test_fetch_node($id: ID!) { test_fetch_node(_id: $id) }`;
export const query_test_fetch_tree_by_node_id = gql`query test_fetch_tree_by_node_id($node_id: ID!) { test_fetch_tree_by_node_id(node_id: $node_id) }`;
export const query_bills = gql`query bills { bills }`;
export const query_bill  = gql`query bill($id: ID!)  { bill(_id: $id) }`;
export const query_cals  = gql`query cals { cals }`;
export const guery_products     = gql`query products { products }`;
export const guery_product      = gql`query product($id: ID!) { product(_id: $id) }`;
export const guery_orders     = gql`query orders { orders }`;
export const guery_order      = gql`query order($id: ID!) { order(_id: $id) }`;
export const guery_purchases  = gql`query purchases { purchases }`;
export const query_periods    = gql`query periods { periods }`;
export const query_positions    = gql`query positions { positions }`;

// mutation
export const mutation_login = gql`mutation login($input: JSON) { login(input: $input) }`;
export const mutation_register = gql`mutation register($input: JSON) { register(input: $input) }`;
export const mutation_bills   = gql`mutation bills($input: JSON) { bills(input: $input) }`;
export const mutation_bills_xml2js = gql`mutation bills_xml2js($input: JSON) { bills_xml2js(input: $input) }`;
export const mutation_address_delivery = gql`mutation address_delivery($input: JSON) { address_delivery(input: $input) }`;
export const mutation_calcute_plan_back = gql`mutation calcute_plan_back($input: JSON) { calcute_plan_back(input: $input) }`;
export const mutation_calcute_recheck = gql`mutation calcute_recheck($input: JSON) { calcute_recheck(input: $input) }`;
export const mutation_order   = gql`mutation order($input: JSON) { order(input: $input) }`;
export const mutation_tree_by_node_id    = gql`mutation tree_by_node_id($input: JSON) { tree_by_node_id(input: $input) }`;
export const mutation_product            = gql`mutation product($input: JSON) { product(input: $input) }`;
export const mutation_paid_bill          = gql`mutation paid_bill($input: JSON) { paid_bill(input: $input) }`;
export const mutation_calculate_tree     = gql`mutation calculate_tree { calculate_tree }`;
export const mutation_test_upload        = gql`mutation test_upload($input: JSON) { test_upload(input: $input) }`;
export const mutation_profile            = gql`mutation profile($input: JSON) { profile(input: $input) }`;
export const mutation_profile_update_position = gql`mutation profile_update_position($input: JSON) { profile_update_position(input: $input) }`;
export const mutation_faker_agent        = gql`mutation faker_agent($input: JSON) { faker_agent(input: $input) }`;
export const mutation_faker_insurance    = gql`mutation faker_insurance($input: JSON) { faker_insurance(input: $input) }`;
export const mutation_test_addmember     = gql`mutation test_addmember($input: JSON) { test_addmember(input: $input) }`;
export const mutation_mlm                = gql`mutation test_addmlm($input: JSON) { test_addmlm(input: $input) }`;

// subscriptions
export const user_connected = gql`subscription userConnected($input: JSON) { userConnected(input: $input) }`;