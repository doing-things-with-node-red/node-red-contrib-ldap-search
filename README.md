[![Build Status](https://dev.azure.com/ymedlop/node-red-contrib/_apis/build/status/ymedlop.node-red-contrib-ldap-search?branchName=master)](https://dev.azure.com/ymedlop/node-red-contrib/_build/latest?definitionId=5&branchName=master) [![Greenkeeper badge](https://badges.greenkeeper.io/ymedlop/node-red-contrib-ldap-search.svg)](https://greenkeeper.io/)

**Alpha Status**

node-red-contrib-ldap-search
=====================

A basic LDAP search node

Supports connecting to ldap servers with or without a DN/Password to bind to.

The filter is a Mustache (http://mustache.github.io/) template that will match against the whole msg object. So if you have a msg object that looks like this.


Credits:
========

* [node-red-contrib-ldap](https://github.com/hardillb/node-red-contrib-ldap)

License
-------

See the [LICENSE file](LICENSE) for license text and copyright information.