const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'public', 'showcase');
const outputDir = path.join(inputDir, 'reel');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const frames = [
  // 1. Mar Shop - Luxury Hero
  {
    input: path.join(inputDir, 'mar_shop_hero.png'),
    output: '01_mar_shop_hero.webp',
    name: 'MAR SHOP',
    category: 'E-Commerce Headless de Lujo',
    description: 'Emblema de Libélula & Experiencia Inmersiva'
  },
  // 2. Mar Shop - Studio Product Shoot
  {
    input: path.join(inputDir, 'showcase_mar_01.jpg'),
    output: '02_mar_shop_product.webp',
    name: 'MAR SHOP',
    category: 'Diseño de Producto & Editorial',
    description: 'Riñonera de Cuero con Tachas Gunmetal'
  },
  // 3. El Susurro del Tiempo - 3D Book Scene
  {
    input: path.join(inputDir, 'el_susurro_del_tiempo_hero.png'),
    output: '03_susurro_hero.webp',
    name: 'EL SUSURRO DEL TIEMPO',
    category: 'Experiencia Web 3D & Archivo Vivo',
    description: 'Atmósfera Literaria Inmersiva & Partículas'
  },
  // 4. El Susurro del Tiempo - Editorial Typography
  {
    input: path.join(inputDir, 'showcase_susurro_01.png'),
    output: '04_susurro_editorial.webp',
    name: 'EL SUSURRO DEL TIEMPO',
    category: 'Diseño Editorial & Micro-Animaciones',
    description: 'Una Vida, Un Libro — Manifiesto Poético'
  },
  // 5. Empanadas Gourmet - Pop-Art Brand
  {
    input: path.join(inputDir, 'showcase_empanada_01.jpg'),
    output: '05_empanada_popart.webp',
    name: 'EMPANADAS GOURMET',
    category: 'Identidad Visual & Pop-Art Vintage',
    description: 'Ilustración Artesanal de Alta Definición'
  },
  // 6. Empanadas Gourmet - Digital App UI
  {
    input: path.join(inputDir, 'empanadas_app_hero.png'),
    output: '06_empanada_ui.webp',
    name: 'EMPANADAS GOURMET',
    category: 'Frontend Gastronómico & Conversión',
    description: 'Menú Interactivo & Checkout Rápido'
  },
  // 7. Li4uid 2.0 - Cerebrium AI Platform
  {
    input: path.join(inputDir, 'showcase_liquid_cerebrium.png'),
    output: '07_liquid_cerebrium.webp',
    name: 'LI4UID 2.0 // CEREBRIUM',
    category: 'Plataforma de Infraestructura IA',
    description: 'Monitoreo de Modelos & Sub-Second Latency'
  },
  // 8. Li4uid 2.0 - Kinetic Motion Interface
  {
    input: path.join(inputDir, 'liquid_new_landing_hero.png'),
    output: '08_liquid_motion.webp',
    name: 'LI4UID 2.0',
    category: 'Arquitectura de Motion & Diseño Reactivo',
    description: 'Núcleo Cuántico & Navegación Fluida'
  },
  // 9. Sigil Labs - Solomonic Circuit
  {
    input: path.join(inputDir, 'sigil_labs_updated_hero.png'),
    output: '09_sigil_circuit.webp',
    name: 'SIGIL LABS',
    category: 'Identidad Cyber-Brutalista & Sigilo 3D',
    description: 'The Solomonic Circuit // Activación Cuántica'
  },
  // 10. Mar Shop - Bodegón Studio Shoot
  {
    input: path.join(inputDir, 'showcase_mar_02.jpg'),
    output: '10_mar_shop_bodegon.webp',
    name: 'MAR SHOP',
    category: 'Dirección de Arte & Fotografía',
    description: 'Bodegón Minimalista en Alta Resolución'
  },
  // 11. El Susurro del Tiempo - Archival Photography
  {
    input: path.join(inputDir, 'showcase_susurro_02.png'),
    output: '11_susurro_archive.webp',
    name: 'EL SUSURRO DEL TIEMPO',
    category: 'Archivo Fotográfico Familiar',
    description: 'Composición Sepia & Memoria Histórica'
  },
  // 12. Empanadas Gourmet - Artisan Bite Detail
  {
    input: path.join(inputDir, 'showcase_empanada_02.jpg'),
    output: '12_empanada_macro.webp',
    name: 'EMPANADAS GOURMET',
    category: 'Fotografía Gastronómica Macro',
    description: 'Textura Hojaldrada & Relleno de Autor'
  },
  // 13. Li4uid 2.0 - Navbar Digital System
  {
    input: path.join(inputDir, 'showcase_liquid_navbardigital.png'),
    output: '13_liquid_navbar.webp',
    name: 'LI4UID 2.0 // NAVBAR',
    category: 'Sistemas de Componentes Avanzados',
    description: 'Micro-Interacciones & Estados de Hover'
  },
  // 14. Mar Shop - Luxury Red Studded Bag
  {
    input: path.join(inputDir, 'showcase_mar_03.jpg'),
    output: '14_mar_shop_red.webp',
    name: 'MAR SHOP',
    category: 'Diseño de Accesorios & Fotografía',
    description: 'Riñonera Roja con Herrajes & Cadenas Punk'
  },
  // 15. Felipe Londoño - Creative Engineer Identity
  {
    input: path.join(inputDir, 'portfolio_flh_hero.png'),
    output: '15_flh_identity.webp',
    name: 'FELIPE LONDOÑO',
    category: 'Ingeniería Creativa & Arquitectura IA',
    description: 'Plan, Design & Develop // Sistemas Digitales'
  },
  // 16. Sigil Labs - Autonomous Reality
  {
    input: path.join(inputDir, 'sigil_labs_updated_full.png'),
    output: '16_sigil_manifesto.webp',
    name: 'SIGIL LABS',
    category: 'Manifiesto de Agencia & Protocolos',
    description: 'Voluntad Ejecutada. Realidad Autónoma.'
  }
];

async function processFrames() {
  console.log('Processing showcase frames with Sharp...');
  const manifest = [];

  for (let i = 0; i < frames.length; i++) {
    const item = frames[i];
    const outputPath = path.join(outputDir, item.output);

    try {
      await sharp(item.input)
        .resize(1920, 1080, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 88, effort: 4 })
        .toFile(outputPath);

      const stat = fs.statSync(outputPath);
      console.log(`[${i + 1}/${frames.length}] Created ${item.output} (${Math.round(stat.size / 1024)} KB)`);

      manifest.push({
        src: `/showcase/reel/${item.output}`,
        name: item.name,
        category: item.category,
        description: item.description
      });
    } catch (err) {
      console.error(`Error processing ${item.input}:`, err.message);
    }
  }

  const manifestPath = path.join(__dirname, 'src', 'components', 'Showreel', 'reelFrames.js');
  const code = `// Auto-generated curated showcase reel frames (1920x1080 High-Res WebP)
export const reelFrames = ${JSON.stringify(manifest, null, 2)};
`;
  fs.writeFileSync(manifestPath, code, 'utf8');
  console.log(`Saved reelFrames manifest to ${manifestPath}`);
}

processFrames();
