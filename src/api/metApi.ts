// base url
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collectionapi.metmuseum.org/public/collection/v1';

export interface ObjectsResponse {
  total: number;
  objectIDs: number[] | null;
}

export interface Department {
  departmentId: number;
  displayName: string;
}

export interface DepartmentsResponse {
  departments: Department[];
}

export interface ArtObject {
  objectID: number;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  objectName: string;
  title: string;
  culture: string;
  period: string;
  dynasty: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistBeginDate: string;
  artistEndDate: string;
  artistGender: string;
  artistWikidata_URL: string;
  objectDate: string;
  objectBeginDate: number;
  objectEndDate: number;
  medium: string;
  dimensions: string;
  objectTitle: string;
}


export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

export const metApi = {
  // get objects
  async getObjects(departmentId?: number): Promise<ObjectsResponse> {
    const url = departmentId 
      ? `${API_BASE_URL}/objects?departmentIds=${departmentId}`
      : `${API_BASE_URL}/objects`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch objects: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // get object by Id
  async getObject(objectId: number): Promise<ArtObject> {
    const url = `${API_BASE_URL}/objects/${objectId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch object ${objectId}: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // get all departments
  async getDepartments(): Promise<DepartmentsResponse> {
    const url = `${API_BASE_URL}/departments`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getPaginatedObjects(page: number, limit: number, departmentId?: number): Promise<{
    artworks: ArtObject[];
    total: number;
    objectIds: number[];
  }> {

    const objectsResponse = await this.getObjects(departmentId);
    const objectIds = objectsResponse.objectIDs || [];
    const total = objectsResponse.total;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageObjectIds = objectIds.slice(startIndex, endIndex);
    
    const artworkPromises = pageObjectIds.map(id => this.getObject(id));
    const artworks = await Promise.all(artworkPromises);
    
    return {
      artworks,
      total,
      objectIds
    };
  },

  // search object by query
  async searchObjects(query: string, options?: { title?: boolean; hasImages?: boolean; geoLocation?: string; medium?: string; }): Promise<ObjectsResponse> {
    const params = new URLSearchParams();
    
    if (options?.title) {
      params.append('title', 'true');
    }
    
    if (options?.hasImages) {
      params.append('hasImages', 'true');
    }
    
    if (options?.geoLocation) {
      params.append('geoLocation', options.geoLocation);
    }
    
    if (options?.medium) {
      params.append('medium', options.medium);
    }
    
    params.append('q', query);
    
    const url = `${API_BASE_URL}/search?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search Failed with status: ${response.statusText}`);
    }
    
    return response.json();
  }
};