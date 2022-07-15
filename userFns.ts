/**
 * @external {Page} https://pptr.dev/#?product=Puppeteer&version=v1.7.0&show=api-class-page
 * @param {Page} page
 * @return {Promise<void>}
 */
export default async function (page) {
  // scrolls the page until the page cannot be scrolled
  // some more or we have scrolled 25 times and fetches all the srcset values
  await page.evaluate(async function () {
    (window as any).$SquidwarcSeen = (window as any).$SquidwarcSeen || new Set();
    const noop = () => {};
    const srcsetSplit = /\s*(\S*\s+[\d.]+[wx]),|(?:\s*,(?:\s+|(?=https?:)))/;
    let scrolled = 0;
    for (; scrolled < 25; ++scrolled) {
      const ss = document.querySelectorAll(
        "*[srcset], *[data-srcset], *[data-src]"
      );
      const fetches = [];
      for (let i = 0; i < ss.length; i++) {
        if ((ss[i] as any).dataset.srcset || (ss[i] as any).srcset) {
          let srcsets = [];
          if ((ss[i] as any).srcset) {
            srcsets = srcsets.concat((ss[i] as any).srcset.split(srcsetSplit));
          }
          if ((ss[i] as any).dataset.srcset) {
            srcsets = srcsets.concat((ss[i] as any).dataset.srcset.split(srcsetSplit));
          }
          for (let j = 0; j < srcsets.length; j++) {
            if (srcsets[j]) {
              const url = srcsets[j].trim().split(" ")[0];
              if (!(window as any).$SquidwarcSeen.has(url)) {
                (window as any).$SquidwarcSeen.add(url);
                fetches.push(fetch(url).catch(noop));
              }
            }
          }
        }
        if ((ss[i] as any).dataset.src) {
          if (!(window as any).$SquidwarcSeen.has((ss[i] as any).dataset.src)) {
            (window as any).$SquidwarcSeen.add((ss[i] as any).dataset.src);
            fetches.push(fetch((ss[i] as any).dataset.src).catch(noop));
          }
        }
      }
      await Promise.all(fetches);
      window.scrollBy(0, 500);
      let canScrollMore =
        window.scrollY + window.innerHeight <
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
      // ensure we see all the requests by waiting for a bit before going again if we can
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!canScrollMore) break;
    }
  });
};
