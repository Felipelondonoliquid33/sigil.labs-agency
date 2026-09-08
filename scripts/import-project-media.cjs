// Run from project root. Source folders are read-only; derivatives live in public/cases.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
const ffmpeg = require('ffmpeg-static');
const root = path.resolve(__dirname, '..');
const projects = 'C:/Users/Felipe/Documents/WEB PROJECTS';
const portfolio = `${projects}/New Portafolio Experience FLH/Portfolio new 2026/Source Code/Felipe Londoño/public`;
const manifest = [];
async function asset(source, folder, name) {
  const target = path.join(root, 'public/cases', folder, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target)) {
    if (name.endsWith('.webp')) await sharp(source).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88 }).toFile(target);
    else fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  }
  manifest.push({ source, target: path.relative(root, target).replaceAll('\\', '/'), bytes: fs.statSync(target).size });
}
async function main() {
  for (const [folder, prefix, count, cover, video] of [
    ['gsap-motion-vault','gsap-showroom',5,'gsap',true],
    ['yoahorro-ia','yoahorro',5,'yoahorro',true],
    ['li4uid-legacy','li4uid',5,'li4uid',true],
    ['synapsis-academy','synapsis',3,null,true],
    ['puente-de-equidad','puente',2,null,false],
  ]) {
    for(let n=1;n<=count;n++) await asset(`${portfolio}/project-images/${prefix}-img-${n}.png`,folder,`image-${n}.webp`);
    await asset(cover ? `${portfolio}/work/slider-img-${cover}.png` : `${portfolio}/project-images/${prefix}-img-1.png`,folder,'cover.webp');
    if(video) await asset(`${portfolio}/project-images/${prefix}-showcase.mp4`,folder,'showcase.mp4');
  }
  await asset(`${projects}/lIQUID  NEW LANDING/New landing 2.0/stage-01-1280.png`,'li4uid-core-web','cover.webp');
  for(const [n,file] of ['12_bodegon_limpio.jpg','15_rinonera_roja_spikes.jpg','31_damero.jpg'].entries())
    await asset(`${projects}/proyecto Mar Shop/EXPORT FINAL FINAL/${file}`,'la-mar', n===0?'cover.webp':`image-${n}.webp`);
  for(const [n,file] of ['hero-empanada.jpg','proceso-amasado.jpg','sabor-carne-cuchillo.jpg'].entries())
    await asset(`${projects}/Empanadas/app/public/images/${file}`,'empanadas',n===0?'cover.webp':`image-${n}.webp`);
  const susurro=`${projects}/El susurro del tiempo Landing/public/assets`;
  await asset(`${susurro}/video/lectura-poster.webp`,'el-susurro-del-tiempo','cover.webp');
  await asset(`${susurro}/video/lectura.mp4`,'el-susurro-del-tiempo','showcase.mp4');
  await asset(`${susurro}/video/escritorio-poster.webp`,'el-susurro-del-tiempo','image-1.webp');
  await asset(`${susurro}/libro/p001.webp`,'el-susurro-del-tiempo','image-2.webp');
  await asset(`${portfolio}/global/logo.png`,'internal-r-and-d','cover.webp');
  const staging=path.join(root,'.sigil-review');
  fs.mkdirSync(staging,{recursive:true});
  const pac=path.join(staging,'PACIFISTA-showcase.mp4');
  if(!fs.existsSync(pac)) execFileSync('tar',['-xf','C:/Users/Felipe/Downloads/PACIFISTA-portfolio-showcase.zip','-C',staging,'PACIFISTA-showcase.mp4']);
  await asset(pac,'pacifista','showcase.mp4');
  for(const [name,seconds] of [['cover',42],['image-1',18],['image-2',70],['image-3',89]]) {
    const target=path.join(root,'public/cases/pacifista',`${name}.webp`);
    if(!fs.existsSync(target)) execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-ss',String(seconds),'-i',pac,'-frames:v','1','-vf','scale=1920:-1','-quality','88',target]);
    manifest.push({source:`PACIFISTA-showcase.mp4 @ ${seconds}s`,target:path.relative(root,target).replaceAll('\\','/'),bytes:fs.statSync(target).size});
  }
  fs.writeFileSync(path.join(staging,'asset-import.json'),JSON.stringify(manifest,null,2));
  console.log(JSON.stringify({assets:manifest.length,megabytes:(manifest.reduce((n,a)=>n+a.bytes,0)/1048576).toFixed(1)}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
