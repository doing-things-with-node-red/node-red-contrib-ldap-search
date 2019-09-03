module.exports = (RED) => {
    "use strict";
    const { getNodeField } = require('./utils');
    // ldapSearchConfig: Get config node values
    function getNodeConfig(node, msg) {
        const {
            name,
            host,
            port,
            ddn,
            password,
            hostFieldType,
            portFieldType,
            ddnFieldType,
            passwordFieldType
        } = node.config;
        return {
            host: getNodeField(node, hostFieldType, host, RED, msg),
            port: getNodeField(node, portFieldType, port, RED, msg),
            ddn: getNodeField(node, ddnFieldType, ddn, RED, msg),
            password: getNodeField(node, passwordFieldType, password, RED, msg)
        };
    }
    // ldapSearchConfig: Constructor
    function myConfigNode(n) {
        const node = this;
        RED.nodes.createNode(node, n);
        node.name = n.name;
        node.host = n.host;
        node.hostFieldType = n.hostFieldType;
        node.port = n.port;
        node.portFieldType = n.portFieldType;
        node.ddn = n.ddn;
        node.ddnFieldType = n.ddnFieldType;
        node.password = n.password;
        node.passwordFieldType = n.passwordFieldType;
        node.getNodeConfig = getNodeConfig;
    }
    // ldapSearchConfig: Register node in Node-Red
    RED.nodes.registerType('ldapSearchConfig', myConfigNode);
};
