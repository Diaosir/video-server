#!/usr/bin/env node
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const decorator_1 = require("slowly/decorator");
const app = new slowly_1.App({
    version: '1.0.0',
    name: 'video-server'
});
app.use(decorator_1.default());
app.start();
