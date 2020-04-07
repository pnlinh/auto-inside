const fs = require('fs');

fs.appendFileSync('log.txt', `${new Date} \r`);