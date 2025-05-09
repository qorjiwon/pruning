import axios from "axios";

export interface Point {
  x: number;
  y: number;
  note?: string; // pruning_points에만 optional로 포함됨
}

export interface PruningResponse {
  matched_base_filename: string;
  original_image_shape_hw: [number, number];
  parameters_used: {
    bud_interval_pixels: number;
    pruning_offset_pixels: number;
    max_recommendations_requested: number;
    neighborhood_radius: number;
  };
  total_points_display: number;
  pruning_points: Point[];
  virtual_buds?: Point[];
  key_skeleton_points?: Point[];
  visualized_image_base64: string;
  chatgpt_comment: string;
}

const BASE_URL = 'https://port-0-pruning-backend-magskusxbf70a53e.sel4.cloudtype.app';

// 이미지 업로드 (multipart/form-data 형식)
export const uploadImage = async (file: File): Promise<PruningResponse> => {
  const formData = new FormData();
  formData.append('imageFile', file);  // ❗ 이름 중요: imageFile
  formData.append('bud_interval_pixels', '30');
  formData.append('pruning_offset_pixels', '15');
  formData.append('pruning_points_count', '10');
  formData.append('neighborhood_radius', '25');
  formData.append('draw_skeleton_on_visualization', 'true');
  formData.append('draw_buds_on_visualization', 'true');
  formData.append('draw_keypoints_on_visualization', 'true');
  formData.append('use_dataset_visualization_if_similar', 'true');

  const response = await axios.post(
    `${BASE_URL}/upload_and_analyze_live_image/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


// 분석 이미지 요청 (GET with 쿼리 파라미터)
export const getRecommendationImage = async (
  imageBaseFilename: string,
  maxAttempts: number = 5,
  intervalMs: number = 5000
): Promise<string> => {
  const params = {
    image_base_filename: imageBaseFilename.replace(/\.[^/.]+$/, ""),
    bud_interval_pixels: 30,
    pruning_offset_pixels: 15,
    pruning_points_count: 10,
    neighborhood_radius: 25,
    draw_skeleton_on_visualization: true,
    draw_buds_on_visualization: true,
    draw_keypoints_on_visualization: true,
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(`${BASE_URL}/upload_and_analyze_live_image/`, { params });
      if (response.data?.visualized_image_base64) {
        return response.data.visualized_image_base64;
      }
    } catch (error) {
      // 404 등 오류는 무시하고 계속 폴링
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error("분석 결과를 받아오지 못했습니다.");
};

// 실시간 웹캠 이미지 업로드 (POST)
export const uploadRealtimeFrame = async (file: File): Promise<PruningResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name); // 확장자 포함 예: ZED_image_left0.jpg

  const response = await axios.post(`${BASE_URL}/process_webcam_image/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}