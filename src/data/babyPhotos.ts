import baby01 from "../assets/images/baby/real/baby-01.jpg";
import baby02 from "../assets/images/baby/real/baby-02.jpg";
import baby03 from "../assets/images/baby/real/baby-03.jpg";
import baby04 from "../assets/images/baby/real/baby-04.jpg";
import baby05 from "../assets/images/baby/real/baby-05.jpg";
import baby06 from "../assets/images/baby/real/baby-06.jpg";
import baby07 from "../assets/images/baby/real/baby-07.jpg";

export interface BabyPhoto {
  id: string;
  src: string;
  alt: string;
  fileName: string;
  isDummy: boolean;
  credit?: {
    title: string;
    creator: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
  };
}

const realBabyImages = [
  { id: "baby-01", src: baby01, alt: "Veera Yazhmathi smiling portrait 1", fileName: "baby-01.JPG" },
  { id: "baby-02", src: baby02, alt: "Veera Yazhmathi smiling portrait 2", fileName: "baby-02.JPG" },
  { id: "baby-03", src: baby03, alt: "Veera Yazhmathi happy portrait 3", fileName: "baby-03.JPG" },
  { id: "baby-04", src: baby04, alt: "Veera Yazhmathi playful portrait 4", fileName: "baby-04.JPG" },
  { id: "baby-05", src: baby05, alt: "Veera Yazhmathi cheerful portrait 5", fileName: "baby-05.JPG" },
  { id: "baby-06", src: baby06, alt: "Veera Yazhmathi lovely portrait 6", fileName: "baby-06.JPG" },
  { id: "baby-07", src: baby07, alt: "Veera Yazhmathi birthday portrait 7", fileName: "baby-07.JPG" },
] as const satisfies ReadonlyArray<Omit<BabyPhoto, "isDummy">>;

export const babyPhotos: BabyPhoto[] = realBabyImages.map((photo) => ({
  ...photo,
  isDummy: false,
}));

function photosAt(...indexes: number[]) {
  return indexes.flatMap((index) => (babyPhotos[index] ? [babyPhotos[index]!] : []));
}

export const babyPhotoConfiguration = {
  maxPhotos: 7,
  heroPhoto: 0,
  sections: {
    hero: [0, 1, 2],
    countdown: [0, 3, 5],
    memories: [0, 1, 2, 3, 4, 5, 6],
    wishes: [1, 2, 5],
    cake: [0, 3, 6],
    gift: [2, 4, 6],
    celebration: [0, 1, 2, 3, 4, 5, 6],
  },
} as const;

export const heroBabyPhoto = babyPhotos[babyPhotoConfiguration.heroPhoto];
export const babyPhotoCollections = {
  hero: photosAt(...babyPhotoConfiguration.sections.hero),
  countdown: photosAt(...babyPhotoConfiguration.sections.countdown),
  memories: photosAt(...babyPhotoConfiguration.sections.memories),
  wishes: photosAt(...babyPhotoConfiguration.sections.wishes),
  cake: photosAt(...babyPhotoConfiguration.sections.cake),
  gift: photosAt(...babyPhotoConfiguration.sections.gift),
  celebration: photosAt(...babyPhotoConfiguration.sections.celebration),
};
