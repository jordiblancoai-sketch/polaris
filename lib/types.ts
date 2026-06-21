export interface ScoreFactor {
  factor_name: string;
  factor_label: string;
  factor_value: number;
  factor_weight: number;
  shap_contribution: number;
  data_source: string | null;
}

export interface RankedOpportunity {
  rank: number;
  score: number;
  confidence: "high" | "medium" | "low";
  target_entity_type: string;
  target_entity_id: string;
  target_entity_name: string;
  target_country_iso: string;
  dest_country_iso: string;
  key_insight: string | null;
  risk_flag: string | null;
  optimal_visit_window: string | null;
  top_factors: ScoreFactor[];
  recommended_schools: RecommendedSchool[];
}

export interface RecommendedSchool {
  id: string;
  name: string;
  type: string;
  has_ib: boolean;
  student_count: number | null;
}

export interface RankedOpportunityList {
  total: number;
  dest_country_iso: string;
  program_type: string | null;
  results: RankedOpportunity[];
  computed_at: string;
  model_version: string;
}

export interface TripCityStop {
  city_id: string;
  city_name: string;
  country_iso: string;
  opportunity_score: number;
  schools_to_visit: RecommendedSchool[];
  estimated_cost_usd: number;
  projected_enrolled_students: number;
  days_recommended: number;
  notes: string | null;
}

export interface TripPlanResponse {
  itinerary: TripCityStop[];
  total_cost_usd: number;
  total_days: number;
  projected_total_enrollments: number;
  projected_cost_per_enrollment_usd: number;
  historical_cost_per_enrollment_usd: number | null;
  savings_vs_historical_usd: number | null;
  roi_narrative: string;
}

// Mock data for demo mode (no API required)
export const MOCK_SCORES: RankedOpportunity[] = [
  { rank: 1,  score: 82, confidence: "high",   target_entity_type: "region", target_entity_id: "1",  target_entity_name: "Zhejiang",      target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Strong STEM pipeline (1.85M students 18-24), high ability to pay ($18,200 GDP/capita), low saturation from US competitors.",      risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 2,  score: 81, confidence: "high",   target_entity_type: "region", target_entity_id: "2",  target_entity_name: "Jiangsu",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Largest educated pipeline outside Beijing/Shanghai (2.9M students), Nanjing + Suzhou — strong STEM universities.",                  risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 3,  score: 76, confidence: "high",   target_entity_type: "region", target_entity_id: "3",  target_entity_name: "Fujian",        target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Strong US diaspora (Fujianese-Americans) drives enrollment conversion. Xiamen international hub. Low competition.",               risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 4,  score: 74, confidence: "high",   target_entity_type: "region", target_entity_id: "4",  target_entity_name: "Sichuan",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Chengdu is China's fastest-growing metro. 3.3M students 18-24, only 95 US universities recruiting here vs. 380 in Beijing.",    risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 5,  score: 73, confidence: "high",   target_entity_type: "region", target_entity_id: "5",  target_entity_name: "Hubei",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Wuhan has 800+ high schools and one of China's largest graduating cohorts. Massively underserved by US recruiters.",                        risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 6,  score: 72, confidence: "high",   target_entity_type: "region", target_entity_id: "6",  target_entity_name: "Hunan",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "2.55M students, growing middle class, Changsha tech boom. Only 88 US universities present vs. national average.",                   risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 7,  score: 71, confidence: "high",   target_entity_type: "region", target_entity_id: "7",  target_entity_name: "Shaanxi",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Xi'an's elite high schools (Gaoxin No.1, Xi'an Tieyi) graduate thousands of overseas-bound seniors yearly. Only 80 US recruiters.",   risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 8,  score: 70, confidence: "high",   target_entity_type: "region", target_entity_id: "8",  target_entity_name: "Shandong",      target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "3rd largest province by population (3.6M students 18-24). Qingdao as international gateway. Medium saturation.",                   risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 9,  score: 68, confidence: "medium", target_entity_type: "region", target_entity_id: "9",  target_entity_name: "Chongqing",     target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Fastest GDP growth in China 2023. Only 90 US universities recruiting in 32M-person municipality.",                                  risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 10, score: 66, confidence: "medium", target_entity_type: "region", target_entity_id: "10", target_entity_name: "Tianjin",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "High income ($15,800 GDP/capita), port city with international exposure.",                                                          risk_flag: "Enrollment declining (-5% YoY). Consider as secondary stop only.",           optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 11, score: 63, confidence: "medium", target_entity_type: "region", target_entity_id: "11", target_entity_name: "Liaoning",      target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Shenyang + Dalian — two major cities, historically strong outbound flows.",                                                          risk_flag: "Northeast demographic decline (-4% YoY). Front-load other regions.",          optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 12, score: 62, confidence: "medium", target_entity_type: "region", target_entity_id: "12", target_entity_name: "Hebei",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "2.45M students, surrounds Beijing. Emerging middle class.",                                                                           risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 13, score: 60, confidence: "medium", target_entity_type: "region", target_entity_id: "13", target_entity_name: "Inner Mongolia", target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "High GDP/capita from natural resources ($12,200). Barely any US recruitment — true white space.",                                   risk_flag: null,                                                                          optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 14, score: 58, confidence: "medium", target_entity_type: "region", target_entity_id: "14", target_entity_name: "Guangdong",     target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Massive population (4.3M students) but extreme saturation. Focus on Shenzhen/Foshan, not Guangzhou.",                               risk_flag: "Highest saturation in China (score 85/100). 310 US universities already here.", optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 15, score: 55, confidence: "medium", target_entity_type: "region", target_entity_id: "15", target_entity_name: "Shanxi",        target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Coal wealth driving new middle class. Taiyuan improving education infrastructure.",                                                   risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 16, score: 53, confidence: "medium", target_entity_type: "region", target_entity_id: "16", target_entity_name: "Anhui",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Hefei emerging as tech hub (USTC, Huawei R&D). 2.25M students. Low saturation.",                                                    risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 17, score: 50, confidence: "medium", target_entity_type: "region", target_entity_id: "17", target_entity_name: "Jiangxi",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Nanchang growing fast. 1.85M students, very low saturation (score 30).",                                                             risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 18, score: 47, confidence: "medium", target_entity_type: "region", target_entity_id: "18", target_entity_name: "Henan",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Largest province by population (4.9M students 18-24) — only 65 US recruiters. Growing flows (+6% YoY).",                           risk_flag: "Lower economic fit ($8,100 GDP/capita). Target MBA/scholarship programs.",     optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 19, score: 46, confidence: "medium", target_entity_type: "region", target_entity_id: "19", target_entity_name: "Guangxi",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "ASEAN gateway city Nanning. Low saturation, growing aspirational class.",                                                             risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 20, score: 44, confidence: "medium", target_entity_type: "region", target_entity_id: "20", target_entity_name: "Hainan",        target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Free Trade Zone driving international exposure. Small but high-aspiration.",                                                          risk_flag: null,                                                                          optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 21, score: 43, confidence: "low",    target_entity_type: "region", target_entity_id: "21", target_entity_name: "Heilongjiang",  target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Harbin University of Technology pipeline. But demographic decline.",                                                                  risk_flag: "Northeast demographic decline (-5% YoY).",                                   optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 22, score: 42, confidence: "low",    target_entity_type: "region", target_entity_id: "22", target_entity_name: "Jilin",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Changchun has strong auto industry, growing middle class.",                                                                          risk_flag: "Northeast demographic decline (-4% YoY).",                                   optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 23, score: 40, confidence: "low",    target_entity_type: "region", target_entity_id: "23", target_entity_name: "Yunnan",        target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Kunming growing. Near-zero current US competition.",                                                                                  risk_flag: "Lower economic fit ($6,600 GDP/capita). Long-term play.",                     optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 24, score: 38, confidence: "low",    target_entity_type: "region", target_entity_id: "24", target_entity_name: "Guizhou",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Fastest GDP growth in China over 5 years. Very early stage for US recruitment.",                                                    risk_flag: "Low ability to pay currently ($6,100 GDP/capita).",                           optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 25, score: 36, confidence: "low",    target_entity_type: "region", target_entity_id: "25", target_entity_name: "Ningxia",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Small population but high Muslim community — niche cultural fit programs.",                                                          risk_flag: null,                                                                          optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 26, score: 35, confidence: "low",    target_entity_type: "region", target_entity_id: "26", target_entity_name: "Shanxi",        target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Gansu emerging slowly.",                                                                                                              risk_flag: null,                                                                          optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 27, score: 32, confidence: "low",    target_entity_type: "region", target_entity_id: "27", target_entity_name: "Gansu",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Low income, small student pool. Last priority.",                                                                                     risk_flag: "Low ability to pay ($5,600 GDP/capita).",                                    optimal_visit_window: "Sep–Oct",  top_factors: [], recommended_schools: [] },
  { rank: 28, score: 28, confidence: "low",    target_entity_type: "region", target_entity_id: "28", target_entity_name: "Beijing",       target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "High income but maxed out — 380 US universities already here. Zero white space.",                                                   risk_flag: "95/100 saturation. Every US university recruits here. Marginal ROI.",         optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 29, score: 26, confidence: "low",    target_entity_type: "region", target_entity_id: "29", target_entity_name: "Shanghai",      target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Saturated beyond recovery for most universities. Only worth visiting if you have existing partnerships.",                           risk_flag: "94/100 saturation. Enrollment declining -7% YoY. Low marginal return.",       optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 30, score: 18, confidence: "low",    target_entity_type: "region", target_entity_id: "30", target_entity_name: "Xinjiang",      target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Very small flow, politically sensitive.",                                                                                             risk_flag: "Geopolitical complications (-8% YoY). Avoid in current climate.",             optimal_visit_window: "N/A",     top_factors: [], recommended_schools: [] },
  { rank: 31, score: 12, confidence: "low",    target_entity_type: "region", target_entity_id: "31", target_entity_name: "Tibet",         target_country_iso: "CHN", dest_country_iso: "USA", key_insight: "Minimal student flow. Not a viable recruiting corridor.",                                                                            risk_flag: "Lowest economic fit and English proficiency. Not recommended.",               optimal_visit_window: "N/A",     top_factors: [], recommended_schools: [] },
];

// ─── Japan → US corridor (top prefectures) ───────────────────────
export const MOCK_SCORES_JAPAN: RankedOpportunity[] = [
  { rank: 1, score: 78, confidence: "high",   target_entity_type: "region", target_entity_id: "jp1", target_entity_name: "Kyoto",     target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "Elite academic culture — Kyoto University feeds top US grad programs. Strong study-abroad tradition, low US recruiter presence outside Tokyo.", risk_flag: null, optimal_visit_window: "Sep–Nov", top_factors: [], recommended_schools: [] },
  { rank: 2, score: 74, confidence: "high",   target_entity_type: "region", target_entity_id: "jp2", target_entity_name: "Osaka",     target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "2nd-largest metro, internationally minded business families. Kansai region underserved vs Tokyo. Strong IB school network.",            risk_flag: null, optimal_visit_window: "Sep–Nov", top_factors: [], recommended_schools: [] },
  { rank: 3, score: 71, confidence: "high",   target_entity_type: "region", target_entity_id: "jp3", target_entity_name: "Fukuoka",   target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "Fastest-growing Japanese city, gateway to Asia. Young population, rising English investment. Almost zero US competition.",              risk_flag: null, optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 4, score: 64, confidence: "medium", target_entity_type: "region", target_entity_id: "jp4", target_entity_name: "Aichi",     target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "Nagoya manufacturing wealth (Toyota HQ). High ability to pay, engineering-focused students seeking US STEM degrees.",                  risk_flag: null, optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
  { rank: 5, score: 52, confidence: "medium", target_entity_type: "region", target_entity_id: "jp5", target_entity_name: "Tokyo",     target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "Largest pipeline by far, but most US universities already recruit here. Worth it only with differentiated programs.",                  risk_flag: "High saturation — 200+ US universities active. Lower marginal ROI.", optimal_visit_window: "Sep–Nov", top_factors: [], recommended_schools: [] },
  { rank: 6, score: 48, confidence: "medium", target_entity_type: "region", target_entity_id: "jp6", target_entity_name: "Hokkaido",  target_country_iso: "JPN", dest_country_iso: "USA", key_insight: "Sapporo regional hub. Smaller flows but very low competition and strong English-education push.",                                       risk_flag: "Smaller absolute student pool.", optimal_visit_window: "Oct–Nov", top_factors: [], recommended_schools: [] },
];

// ─── Singapore → US corridor (planning regions) ──────────────────
export const MOCK_SCORES_SINGAPORE: RankedOpportunity[] = [
  { rank: 1, score: 88, confidence: "high",   target_entity_type: "region", target_entity_id: "sg1", target_entity_name: "Central Region",    target_country_iso: "SGP", dest_country_iso: "USA", key_insight: "Highest income on the platform ($72k GDP/cap). Raffles, HCI, ACS feed Ivy League. 97% F-1 approval — students self-direct to top US schools.", risk_flag: null, optimal_visit_window: "Jan / Oct", top_factors: [], recommended_schools: [] },
  { rank: 2, score: 79, confidence: "high",   target_entity_type: "region", target_entity_id: "sg2", target_entity_name: "East Region",       target_country_iso: "SGP", dest_country_iso: "USA", key_insight: "Affluent residential belt, strong international-school presence. Families prioritise US over local NUS/NTU for differentiation.",          risk_flag: null, optimal_visit_window: "Jan / Oct", top_factors: [], recommended_schools: [] },
  { rank: 3, score: 74, confidence: "high",   target_entity_type: "region", target_entity_id: "sg3", target_entity_name: "West Region",       target_country_iso: "SGP", dest_country_iso: "USA", key_insight: "Growing young-family district near Jurong innovation hub. Rising US-bound STEM interest, low recruiter coverage.",                        risk_flag: null, optimal_visit_window: "Jan / Oct", top_factors: [], recommended_schools: [] },
  { rank: 4, score: 66, confidence: "medium", target_entity_type: "region", target_entity_id: "sg4", target_entity_name: "North-East Region", target_country_iso: "SGP", dest_country_iso: "USA", key_insight: "Sengkang/Punggol new towns, fast-rising aspirational middle class. Early-stage but high-growth opportunity.",                              risk_flag: null, optimal_visit_window: "Jan / Oct", top_factors: [], recommended_schools: [] },
  { rank: 5, score: 61, confidence: "medium", target_entity_type: "region", target_entity_id: "sg5", target_entity_name: "North Region",      target_country_iso: "SGP", dest_country_iso: "USA", key_insight: "Woodlands corridor, smaller pool but very low US competition. Scholarship-driven messaging works best here.",                            risk_flag: "Smallest absolute pool of the five regions.", optimal_visit_window: "Jan / Oct", top_factors: [], recommended_schools: [] },
];

// ─── Corridor summary for the world map ──────────────────────────
export interface CorridorSummary {
  key: "china" | "japan" | "singapore";
  country: string;
  iso: string;
  flag: string;
  coords: [number, number];        // [lng, lat] for the world-map marker
  topScore: number;
  topRegion: string;
  regionsScored: number;
  studentsPerYear: string;
  visaRate: string;
  scores: RankedOpportunity[];
}

export const CORRIDORS: CorridorSummary[] = [
  { key: "china",     country: "China",     iso: "CHN", flag: "🇨🇳", coords: [104, 35.5], topScore: 82, topRegion: "Zhejiang",       regionsScored: 31, studentsPerYear: "277k", visaRate: "66%", scores: MOCK_SCORES },
  { key: "japan",     country: "Japan",     iso: "JPN", flag: "🇯🇵", coords: [138, 37],   topScore: 78, topRegion: "Kyoto",          regionsScored: 47, studentsPerYear: "18.9k", visaRate: "95%", scores: MOCK_SCORES_JAPAN },
  { key: "singapore", country: "Singapore", iso: "SGP", flag: "🇸🇬", coords: [103.8, 1.35], topScore: 88, topRegion: "Central Region", regionsScored: 5,  studentsPerYear: "3.6k",  visaRate: "97%", scores: MOCK_SCORES_SINGAPORE },
];
