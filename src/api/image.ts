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