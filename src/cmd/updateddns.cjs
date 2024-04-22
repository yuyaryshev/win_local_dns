#!/usr/bin/env node
const {
    updateHostsFromLocalDynDns,
} = require("../../lib/cjs/updateHostsFromLocalDynDns.js");

updateHostsFromLocalDynDns().then();
