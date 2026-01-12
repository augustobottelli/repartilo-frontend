import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Vehicle {
  name: string;
  capacity: number;
  start_address: string;
  end_address?: string;
  start_lat: number;
  start_lon: number;
  end_lat?: number;
  end_lon?: number;
}

export interface Delivery {
  address: string;
  packages: number;
  customer_name: string;
  lat: number;
  lon: number;
  confidence: number;
}

export interface RouteStep {
  type: string;
  location: [number, number];
  address?: string;
  customer_name?: string;
  packages?: number;
  arrival?: number;
  duration?: number;
}

export interface VehicleRoute {
  vehicle_name: string;
  steps: RouteStep[];
  distance: number;
  duration: number;
  load: number;
  geometry?: string;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  vehicles?: Vehicle[];
  deliveries?: Delivery[];
  vehicle_errors?: Array<{ row?: number; field?: string; error: string }>;
  delivery_errors?: Array<{ row?: number; field?: string; error: string }>;
}

export interface OptimizationResult {
  success: boolean;
  message: string;
  routes: VehicleRoute[];
  unassigned: Array<{ customer_name: string; address: string; packages: number; reason: string }>;
  total_distance: number;
  total_duration: number;
  vehicles_used: number;
}

export interface QRCode {
  vehicle_name: string;
  qr_code_base64: string;
  google_maps_url: string;
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  qr_codes: QRCode[];
}

export interface HealthCheck {
  status: string;
  version: string;
  services: Record<string, string>;
}

export interface SaveOptimizationRequest {
  name?: string;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  routes: VehicleRoute[];
  qr_codes?: QRCode[];
  efficiency_metrics?: {
    distanceSaving: number;
    timeSaving: number;
    fuelSaving: number;
  };
  total_distance: number;
  total_duration: number;
  vehicles_used: number;
}

export interface OptimizationSummary {
  id: string;
  name: string | null;
  created_at: string;
  total_distance: number;
  total_duration: number;
  vehicles_used: number;
  deliveries_count: number;
}

export interface SavedOptimization {
  id: string;
  user_id: string;
  name: string | null;
  created_at: string;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  routes: VehicleRoute[];
  qr_codes?: QRCode[];
  efficiency_metrics?: {
    distanceSaving: number;
    timeSaving: number;
    fuelSaving: number;
  };
  total_distance: number;
  total_duration: number;
  vehicles_used: number;
  deliveries_count: number;
}

export interface UserSubscriptionInfo {
  user_id: string;
  clerk_user_id: string;
  email: string;
  tier: string;
  subscription_status: string;
  monthly_route_limit: number;
  max_vehicles_per_optimization: number;
  max_stops_per_route: number;
  current_monthly_usage: number;
  can_optimize: boolean;
}

// API Methods

export const apiService = {
  // Validation
  async countExcelRows(file: File): Promise<{ success: boolean; vehicle_count: number; delivery_count: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/count-excel-rows', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async validateExcel(file: File): Promise<ValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ValidationResult>('/validate-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async geocodeAddress(address: string): Promise<any> {
    const response = await api.post('/geocode', { address });
    return response.data;
  },

  // Optimization (requires authentication)
  async optimizeRoutes(vehicles: Vehicle[], deliveries: Delivery[], token: string): Promise<OptimizationResult> {
    const response = await api.post<OptimizationResult>(
      '/optimize-routes',
      {
        vehicles,
        deliveries,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Utilities
  async downloadTemplate(): Promise<Blob> {
    const response = await api.get('/template/download', {
      responseType: 'blob',
    });
    return response.data;
  },

  async generateQRCodes(routes: VehicleRoute[]): Promise<QRCodeResponse> {
    const response = await api.post<QRCodeResponse>('/qr-codes', { routes });
    return response.data;
  },

  async healthCheck(): Promise<HealthCheck> {
    const response = await api.get<HealthCheck>('/health');
    return response.data;
  },

  // Optimization Storage (requires authentication)
  async saveOptimization(data: SaveOptimizationRequest, token: string): Promise<{ id: string }> {
    const response = await api.post(
      '/optimizations/save',
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async listOptimizations(token: string, limit = 20, offset = 0): Promise<OptimizationSummary[]> {
    const response = await api.get(
      `/optimizations/list?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getOptimization(id: string, token: string): Promise<SavedOptimization> {
    const response = await api.get(
      `/optimizations/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getOptimizationsCount(token: string): Promise<{ count: number }> {
    const response = await api.get(
      '/optimizations/count',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async updateOptimizationName(id: string, name: string, token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put(
      `/optimizations/${id}/name`,
      { name },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async deleteOptimization(id: string, token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(
      `/optimizations/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // User Subscription Info
  async getUserInfo(token: string): Promise<UserSubscriptionInfo> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await api.get(
      '/user/me',
      {
        baseURL: `${API_URL}/api`,  // Changed from /api/v1 to /api to access /api/user/me
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default api;
