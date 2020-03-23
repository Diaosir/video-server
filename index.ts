#!/usr/bin/env node

import { App } from 'slowly'
import decorator from 'slowly/decorator'
const app = new App({
  version: '1.0.0',
  name: 'video-server'
});
app.use(decorator())
app.start();