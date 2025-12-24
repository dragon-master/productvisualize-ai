import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'mug',
    name: 'Coffee Mug',
    description: 'Place your product design on a ceramic coffee mug on a wooden table.',
    promptTemplate: 'A high-quality product photography shot. Place the design/object from the source image onto a white ceramic coffee mug. The mug is sitting on a rustic wooden table with soft morning lighting. Ensure the product logo/design is clearly visible on the curved surface of the mug.',
    icon: 'coffee'
  },
  {
    id: 'billboard',
    name: 'City Billboard',
    description: 'Display your product on a massive billboard in a busy city center.',
    promptTemplate: 'A realistic wide shot of a busy city street (like Times Square). There is a large digital billboard featuring the object from the source image. The product should look massive and impressive, integrated into a professional advertisement layout on the screen.',
    icon: 'layout'
  },
  {
    id: 'tshirt',
    name: 'T-Shirt Model',
    description: 'A model wearing a t-shirt featuring your product/design.',
    promptTemplate: 'A fashion photography shot of a young stylish model wearing a plain white cotton t-shirt. The object/design from the source image is printed on the front center of the t-shirt. The fabric texture and lighting should look realistic.',
    icon: 'shirt'
  },
  {
    id: 'magazine',
    name: 'Magazine Spread',
    description: 'A glossy magazine advertisement spread.',
    promptTemplate: 'A flat-lay photography shot of an open glossy magazine. The page features a full-page advertisement of the object from the source image. The lighting is high-key studio lighting, making the product look premium and desirable.',
    icon: 'book-open'
  },
  {
    id: 'tote',
    name: 'Canvas Tote Bag',
    description: 'Your product printed on an eco-friendly canvas tote bag.',
    promptTemplate: 'A lifestyle shot of a canvas tote bag hanging on a shoulder or sitting on a park bench. The object/design from the source image is printed on the side of the tote bag. Natural sunlight, depth of field.',
    icon: 'shopping-bag'
  },
  {
    id: 'instagram',
    name: 'Social Media Story',
    description: 'A vertical aspect ratio aesthetic shot for Instagram.',
    promptTemplate: 'A vertical 9:16 product shot optimized for social media. The object from the source image is placed in a trendy, aesthetic environment with pastel colored background props. Soft shadows, ring light reflection.',
    icon: 'smartphone'
  }
];
