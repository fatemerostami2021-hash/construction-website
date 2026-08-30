require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const { processImage } = require('../utils/imageProcessor');

const SEED_DIR = path.join(__dirname, '..', 'seed-images');

const PROJECTS = [
  { slug: 'villa-lavasan',     title: 'ویلا لواسان',              propertyType: 'villa',     location: 'البرز، لواسان', status: 'skeleton' },
  { slug: 'apartment-tehran-1', title: 'آپارتمان تهران - فاز ۱',  propertyType: 'apartment', location: 'تهران',        status: 'foundation' },
  { slug: 'apartment-tehran-2', title: 'آپارتمان تهران - فاز ۲',  propertyType: 'apartment', location: 'تهران',        status: 'finishing' },
  { slug: 'apartment-karaj',    title: 'آپارتمان کرج',             propertyType: 'apartment', location: 'کرج',          status: 'delivered' },
  { slug: 'apartment-shomal',   title: 'آپارتمان شمال',            propertyType: 'apartment', location: 'شمال',         status: 'foundation' },
];

const PHASES = ['foundation', 'skeleton', 'finishing', 'delivery'];
const PHASE_TITLES = { foundation: 'فونداسیون', skeleton: 'اسکلت', finishing: 'نازک‌کاری', delivery: 'تحویل' };

async function processPhaseImages(slug, phaseKey) {
  const dir = path.join(SEED_DIR, slug, phaseKey);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const images = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const result = await processImage(filePath, file);
    images.push({ url: result.medium.url, alt: file, width: result.medium.width, height: result.medium.height });
  }
  return images;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/construction-website');
  console.log('✅ اتصال به دیتابیس برقرار شد\n');

  for (const p of PROJECTS) {
    const phases = [];
    for (let i = 0; i < PHASES.length; i++) {
      const images = await processPhaseImages(p.slug, PHASES[i]);
      phases.push({ title: PHASE_TITLES[PHASES[i]], images, order: i });
    }
    const totalImages = phases.reduce((a, ph) => a + ph.images.length, 0);
    await Project.findOneAndUpdate(
      { slug: p.slug },
      { ...p, phases, published: true },
      { upsert: true, new: true }
    );
    console.log(`✅ ${p.title} ذخیره شد — ${totalImages} عکس واقعی پردازش شد`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 تمام شد.');
}

run().catch(err => { console.error('❌ خطا:', err); process.exit(1); });
