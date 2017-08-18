const db = require('js-web').migration.mysql

db.table('users',{
  id: 'id',
  name: 'string',
  facebook: 'text'
})
