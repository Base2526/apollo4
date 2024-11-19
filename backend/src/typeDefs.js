const gql = require('graphql-tag');
export default gql`
  scalar DATETIME
  scalar Long
  scalar Date
  scalar JSON
  scalar Upload

  type Query {
    test_fetch_node(_id: ID!): JSON
    test_fetch_tree_by_node_id(node_id: ID!): JSON
    dblog: JSON
    members: JSON
    member(_id: ID!): JSON
    files: JSON
    bills: JSON
    bill(_id: ID!): JSON
    cals: JSON
    products: JSON
    product(_id: ID!): JSON
    orders: JSON
    order(_id: ID!): JSON
    purchases:JSON
    periods: JSON
    positions: JSON
  }  

  type Mutation {
    login(input: JSON): JSON
    register(input: JSON): JSON
    bills(input:JSON): JSON
    bills_xml2js(input:JSON): JSON
    address_delivery(input:JSON): JSON
    calcute_plan_back(input:JSON): JSON
    calcute_recheck(input:JSON): JSON
    order(input: JSON): JSON
    tree_by_node_id(input: JSON): JSON
    product(input: JSON): JSON
    paid_bill(input: JSON): JSON
    calculate_tree: JSON
    test_upload(input: JSON): JSON
    profile(input: JSON): JSON
    profile_update_position(input: JSON): JSON
    faker_agent(input: JSON): JSON
    faker_insurance(input: JSON): JSON
    test_addmember(input: JSON): JSON
    test_addmlm(input: JSON): JSON
  }

  type Subscription {
    userConnected(input:JSON): JSON
  }
`;
