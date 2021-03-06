/* eslint-disable no-undef */
const neo4j = require('neo4j-driver')

function connect(dbName) {
    this.dbName = dbName
    if (process.env.NODE_ENV !== 'test') {
        this.driver = neo4j.driver(
            'bolt://neo4j',
            neo4j.auth.basic(process.env.NEO_USER, process.env.NEO_PASSWORD)
        )
        console.log('neo4j dev db')
    } else {
        this.driver = neo4j.driver(
            'bolt://neo4j_test',
            neo4j.auth.basic(process.env.NEO_USER, process.env.NEO_PASSWORD)
        )
        console.log('neo4j test db')
    }
}

function session() {
    return this.driver.session()
}

module.exports = {
    connect,
    session,
    makeFriend: 'MERGE(user1:User{id:$user1Id}) MERGE(user2: User{ id: $user2Id }) MERGE(user1)- [friends:FRIENDSWITH] -> (user2) RETURN collect(DISTINCT friends) AS friendship',
    removeFriend: 'MATCH(:User{id:$user1Id})-[relation:FRIENDSWITH]-(:User{id:$user2Id}) DELETE relation',
    getFriends: 'MATCH(:User{id:$id})-[:FRIENDSWITH]-(users:User) RETURN collect(DISTINCT users.id) AS userIds',
    getFriendsAndRequests: 'MATCH(:User{id:$id})-[]-(users:User) RETURN collect(DISTINCT users.id) AS userIds',
    makeRequest: 'MERGE(user1:User{id:$user1Id}) MERGE(user2: User{ id: $user2Id }) MERGE(user1)- [friends:FRIEND_REQUESTED] -> (user2) RETURN collect(DISTINCT friends) AS friendship',
    acceptRequest: 'MATCH(user:User{id: $user1Id})-[relation:FRIEND_REQUESTED]-(user2:User{id: $user2Id}) DELETE relation WITH user, user2 MERGE(user)-[relation:FRIENDSWITH]->(user2) RETURN user, relation, user2',
    ignoreRequest: 'MATCH(user:User{id: $user1Id})-[relation:FRIEND_REQUESTED]-(user2:User{id: $user2Id}) DELETE relation',
    getRequests: 'MATCH(user1:User{id: $user1Id})<-[:FRIEND_REQUESTED]-(user2:User) RETURN collect(DISTINCT user2.id) AS userIds',
    emptyDB: 'MATCH()-[r]-() DELETE r WITH r MATCH (n) DELETE n'
}