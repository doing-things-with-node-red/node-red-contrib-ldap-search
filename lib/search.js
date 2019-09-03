module.exports = (RED) => {
    "use strict";
    // Third parties dependencies
	const LDAP = require("ldapjs");
	const mustache = require("mustache");
    const fs = require('fs');
    // Shared functions
    const { getNodeField } = require('./utils');
    // ldapSearch: Get node values
    function getNodesValuesByMsg(config, node, msg) {
        const {
          basednFieldType,
          basedn,
          filterFieldType,
          filter,
        } = config;
        return {
          basedn: getNodeField(node, basednFieldType, basedn, RED, msg),
          filter: getNodeField(node, filterFieldType, filter, RED, msg),
          config: node.config.getNodeConfig(node, msg)
        };
    }
    function onSuccess(node, msg, data) {
        msg.topic = node.topic || msg.topic;
        msg.payload = data;
        node.ldap.unbind();
        node.status({fill: "blue", shape: "ring", text: "unbind" });  
        node.send(msg);
    }
    // onError function
    function onError(node, msg, error, errorTag="") {
        msg.payload = { error };
        node.error(`errorTag ${error}`);
        node.send(msg);
        node.ldap.unbind();
        node.status({fill: "red", shape: "ring", text: "disconnected" });
    }
    // ldapSearch: Constructor
	function myNode(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.config = RED.nodes.getNode(config.server);
        node.topic = config.topic;
        node.on('input', (msg) => {
            // Get parameters
            const { 
                basedn,
                filter,
                config: {
                    host,
                    port,
                    ddn,
                    password
                }
            } = getNodesValuesByMsg(config, node, msg);
            // Set LDAP Options
            const options = {
				url: `ldap://${host}:${port}`,
				ConnectTimeout: 1000
            };
            // Set Search Options
            const searchOptions = {
                filter: mustache.render(filter, msg),
                scope: 'sub'
            };
            // Initializing LDAP connection
            node.status({
                fill: 'grey',
                shape: 'dot',
                text: 'Initializing LDAP connection',
            });
            // Create ldap client
            node.ldap = LDAP.createClient(options); 
            node.ldap.bind(ddn, password, (err) => {
				if (err) {
                    onError(node, msg, err, "LDAP Binding Error:");
				} else {
                    node.status({fill: "green", shape: "dot", text: "bound" });
					node.ldap.search(basedn, searchOptions, (err, res) => {
                        const data = [];
						if (err) {
                            onError(node, msg, err, "LDAP Search Error:");
						} else {
                            res.on('searchEntry', (entry) => data.push(entry.object));
                            res.on('error', (error) => onError(node, msg, error, "LDAP Search Error:"));
                            res.on('end', () => onSuccess(node, msg, data));
                        }
					});
				}
            });
            node.ldap.on('error', (err) => onError(node, msg, err, "LDAP Connection Error:"));
        });
	}
    // ldapSearch: Register node in Node-Red
	RED.nodes.registerType("ldapSearch", myNode);
};
