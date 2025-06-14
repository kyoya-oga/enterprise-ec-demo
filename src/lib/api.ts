const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL environment variable is required');
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    return res.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to post to ${endpoint}: ${res.status}`);
    }

    return res.json();
  }
}

export const apiClient = new ApiClient(baseUrl);
