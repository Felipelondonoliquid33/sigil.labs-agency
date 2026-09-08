const { chromium } = require(process.env.SIGIL_PLAYWRIGHT || 'C:/Users/Felipe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = process.env.SIGIL_TEST_URL || 'http://localhost:3001';
const report = { pages: [], errors: [], interactions: [] };
async function main() {
  fs.mkdirSync(path.join(root,'.sigil-review'),{recursive:true});
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror',e=>report.errors.push(e.message));
    const projects = Object.entries((await import('../src/data/projectDetails.js')).projectDetails);
    const media = (await import('../src/data/projectMedia.js')).projectMedia;
    // Validate every authored media reference, independent of lazy-loading position.
    for(const [id,m] of Object.entries(media)) for(const src of [m.cover.src,...m.gallery.map(x=>x.src),m.video].filter(Boolean)) {
      assert(fs.existsSync(path.join(root,'public',src)),`${id}: missing ${src}`);
    }
    for(const [id,data] of projects) {
      await page.goto(`${base}/sample-project?project=${id}`,{waitUntil:'networkidle'});
      const title = await page.locator('.project-header h1').innerText();
      assert.equal(title.replace(/\s+/g,' ').trim().toUpperCase(),data.title.toUpperCase());
      await page.locator('.project-banner-img img').evaluate(img=>img.decode());
      assert.equal(await page.locator('.project-images video').count(),media[id].video?1:0);
      let videoDuration;
      if (media[id].video) {
        videoDuration = await page.locator('video').evaluate(video => new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Video metadata timed out')), 15000);
          video.addEventListener('loadedmetadata', () => { clearTimeout(timer); resolve(video.duration); }, {once:true});
          video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Video failed to load')); }, {once:true});
          video.preload = 'metadata';
          video.load();
        }));
        assert(videoDuration > 0, `${id}: invalid video duration`);
      }
      assert.equal(await page.locator('text=Rhea Korrin').count(),0);
      report.pages.push({id,title,media:true,videoDuration});
    }
    // Same-route navigation must update the visible project and rerun Copy safely.
    await page.goto(`${base}/sample-project?project=pacifista`,{waitUntil:'networkidle'});
    await page.locator('.next-project .button').click();
    await page.waitForURL('**project=gsap-motion-vault');
    await page.waitForTimeout(1700);
    assert.match(await page.locator('.project-header h1').innerText(),/GSAP Motion Vault/i);
    report.interactions.push('Next project changes both query and rendered case');
    await page.goto(`${base}/stories`,{waitUntil:'networkidle'});
    await page.locator('.story-img').click({position:{x:40,y:200}});
    await page.waitForFunction(()=>document.querySelector('.link a')?.getAttribute('href')?.includes('empanadas'));
    await page.locator('.link a').click();
    await page.waitForURL('**project=empanadas');
    assert.match(await page.locator('.project-header h1').innerText(),/EMPANADAS/);
    report.interactions.push('Stories follows the currently visible project');
    await page.goto(`${base}/work`,{waitUntil:'networkidle'});
    assert.equal(await page.locator('.folder').count(),projects.length);
    await page.locator('.folder').first().hover();
    await page.waitForTimeout(350);
    const previewTransform=await page.locator('.folder-preview-img').first().evaluate(e=>getComputedStyle(e).transform);
    assert.notEqual(previewTransform,'none');
    report.interactions.push('All projects in Work; folder hover animates');
    await page.screenshot({path:path.join(root,'.sigil-review/work-desktop.png')});
    await page.goto(`${base}/sample-project?project=pacifista`,{waitUntil:'networkidle'});
    await page.waitForTimeout(1600);
    await page.screenshot({path:path.join(root,'.sigil-review/pacifista-desktop.png')});
    await page.setViewportSize({width:390,height:844});
    for(const route of ['/work','/sample-project?project=el-susurro-del-tiempo']) {
      await page.goto(base+route,{waitUntil:'networkidle'});
      await page.waitForTimeout(1300);
      const dimensions=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth}));
      assert(dimensions.document<=dimensions.width,`Horizontal overflow on ${route}`);
      report.pages.push({route,mobile:dimensions});
      await page.screenshot({path:path.join(root,'.sigil-review',route==='/work'?'work-mobile.png':'susurro-mobile.png')});
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(base,{waitUntil:'networkidle'});
    await page.waitForTimeout(9500);
    assert.equal(await page.locator('h1').filter({hasText:'People Approved'}).count(),1);
    assert.equal(await page.locator('.featured-work-item').count(),6);
    await page.screenshot({path:path.join(root,'.sigil-review/home-desktop.png')});
    assert.equal(report.errors.length,0,report.errors.join('\n'));
    console.log(JSON.stringify(report,null,2));
  } finally {
    fs.writeFileSync(path.join(root,'.sigil-review/verification.json'),JSON.stringify(report,null,2));
    await browser.close();
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
