/**
 * Copyright 2017-2019 John Berlin <n0tan3rd@gmail.com>. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import program from 'commander';

import configRunner from './lib/runners';
import cp from './lib/utils/colorPrinters';

process.on("unhandledRejection", function (reason, p) {
  console.log("Unhandled Rejection:", (reason as any).stack);
  // or next(reason);
});

(program as any).version("1.0.0", "-v, --version")
    .option("-c, --config <path-to-config.json>", "Launch A Crawl From A Config");

(program as any).parse(process.argv);
if ((program as any).rawArgs.slice(2).length === 0) {
  cp.green((program as any).helpInformation());
  // process.exit(1)
} else {
  if ((program as any).config != null) {
    cp.crawlerOpt("Running Crawl From Config File", (program as any).config);
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    configRunner((program as any).config);
  } else {
    cp.bred("Config argument (-c) was not supplied.");
  }
}
