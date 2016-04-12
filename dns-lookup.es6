import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import checkDomain from 'legit';
import B from 'bluebird';

const domains = fs.readFileSync(path.join(__dirname, './domains.csv'), 'utf8').split(/,/g);
const byDomain = {};

(async () => {
  for (let d of domains) {
    const domain = d.trim();
    const exchange = await new Promise((resolve, reject) => {
      checkDomain('asv@' + domain, (validation, addresess, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(addresess[0].exchange);
        }
      });
    });
    console.log(domain, exchange, getProviderFromExchangeName(exchange));
    // byDomain[domain] = getProviderFromExchangeName(exchange);
    // const res = await B.fromCallback(checkDomain.bind(this, 'asdf@'+domain));
    // console.log(domain, ':', res);
  }

  // console.log(JSON.stringify(byDomain));
})();

function getProviderFromExchangeName(exchange) {
  if (/google/i.test(exchange)) {
    return 'google';
  } else if (/mx.yandex/i.test(exchange)) {
    return 'yandex';
  } else {
    return exchange;
  }
}


process.on('unhandledRejection', (err) => {
  console.error(err);
  console.error(err.stack);
  process.exit(1);
});

