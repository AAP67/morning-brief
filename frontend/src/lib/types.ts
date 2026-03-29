export interface UserProfile {
  uid: string;
  name: string;
  role: string;
  industry: string;
  company?: string;
  topics: string[];
  companies_tracked: string[];
  sources_enabled: string[];
  tone: 'executive' | 'casual' | 'technical' | 'analytical';
  length: 'short' | 'medium' | 'detailed';
  timezone: string;
  delivery_channel: string;
  email?: string;
}

export interface BriefSection {
  title: string;
  content: string;
  source_urls: string[];
}

export interface MorningBrief {
  uid: string;
  date: string;
  greeting: string;
  sections: BriefSection[];
  sign_off: string;
  generated_at: string;
  pipeline_meta: PipelineMetrics;
}

export interface PipelineMetrics {
  stage_1_latency_ms: number;
  stage_1_tokens: number;
  stage_2_latency_ms: number;
  stage_2_tokens: number;
  stage_3_latency_ms: number;
  stage_3_tokens: number;
  total_latency_ms: number;
  articles_fetched: number;
  articles_after_scoring: number;
  total_estimated_cost: number;
}

export interface GenerateResponse {
  brief: MorningBrief;
  metrics: PipelineMetrics;
  brief_id?: string;
}
