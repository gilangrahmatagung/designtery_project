---
paths:
  - 'deploy.sh,.cpanel.yml,.github/workflows/deploy_v3.yml'
---

# Workflows

## Deployment: cPanel shared hosting constraints
Server has NO rsync, NO SSH, NO Node.js. Use cp -a instead of rsync. cPanel YAML parser breaks with many tasks — put all deploy logic in deploy.sh called from .cpanel.yml as single task. PHP 8.4 at /opt/alt/php84/usr/bin/php. Branch deploy is orphan with vendor/ and public/build/ force-committed. See 000docs/production_env_info.md for full details.
