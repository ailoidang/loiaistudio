
export enum StyleType {
  TET_MAI = 'Tết: Vườn Mai Vàng (Toàn thân)',
  TET_DAO = 'Tết: Vườn Đào Hồng (Dáng vừa)',
  TET_LONG_DEN = 'Tết: Phố Lồng Đèn (Dạo bước)',
  TET_NGUYEN_HUE = 'Tết: Phố Đi Bộ (Góc rộng)',
  PROFILE_VEST = 'Profile: Doanh nhân (Vest Sang Trọng)',
  BUSINESS = 'Công sở / Doanh nhân',
  FASHION = 'Thời trang / Sáng tạo',
  GALA = 'Dạ hội: Đầm Sang Trọng (Gala)',
  CLASSIC_LOTUS = 'Cổ điển: Mỹ nhân bên hoa sen'
}

export enum AspectRatio {
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  SQUARE = '1:1'
}

export enum Quality {
  FOUR_K = 'Chất lượng 4K',
  EIGHT_K = 'Chất lượng 8K (Siêu nét)',
  SIXTEEN_K = 'Chất lượng 16K (Cực hạn)'
}

export interface UserImage {
  id: string;
  url: string;
  file: File;
  name: string;
}

export interface GeneratedResult {
  id: string;
  sourceImageId: string;
  url: string;
  style: StyleType;
  ratio: AspectRatio;
  quality: Quality;
  timestamp: number;
  cameraAngle: string;
  status: 'pending' | 'completed' | 'error';
}
