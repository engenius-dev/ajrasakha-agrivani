import { SchemeData } from "@/components/SchemeCard";

/**
 * Comprehensive list of mock schemes for demonstration purposes.
 * Each entry includes eligibility rules, benefits, and required documents.
 */
export const mockSchemes: SchemeData[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    category: "Financial Support",
    eligible: true,
    benefit: "₹6,000 per year income support",
    reason: "The farmer's landholding of 0.97 hectares is well below the 2-hectare limit specified for small and marginal farmers.",
    proof: "PM-KISAN Operational Guidelines (2018), Section 2.3, Page 1",
    description: "To provide income support to farmers, reduce their financial burden, and ensure Direct Benefit Transfer (DBT).",
    eligibilityRule: "Small and marginal farmer families with combined cultivable landholding up to 2 hectares.",
    proofText: "Must be a Small and Marginal landholder farmer family. The family must collectively own cultivable land up to 2 hectares.",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook"]
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM",
    category: "Infrastructure",
    eligible: true,
    benefit: "Up to 60% subsidy on solar pumps",
    reason: "Individual farmers are eligible to set up solar power plants or install standalone solar agriculture pumps on their land.",
    proof: "Guidelines for Implementation of PM-KUSUM Scheme (MNRE), Section 2.1, Page 1",
    description: "Helps farmers install standalone solar agriculture pumps and grid-connected solar power plants.",
    eligibilityRule: "Individual farmers, Water User Associations, and farmer cooperatives are eligible.",
    proofText: "Individual farmers, rural landowners, groups of farmers, cooperatives, panchayats, and FPOs are eligible.",
    documents: ["Aadhaar Card", "Land Record", "Bank Passbook", "Passport Size Photo"]
  },
  {
    id: "pmfby",
    name: "PMFBY",
    category: "Insurance",
    eligible: true,
    benefit: "Comprehensive crop insurance cover",
    reason: "The farmer is growing Rice, which is a notified crop, making them eligible for comprehensive crop insurance.",
    proof: "PMFBY Operational Guidelines (Revised), Section 3, Page 8",
    description: "Provides insurance cover and financial support to farmers in the event of failure of any of the notified crops.",
    eligibilityRule: "All farmers growing notified crops in a notified area are eligible.",
    proofText: "All farmers growing notified crops in a notified area during the season who have insurable interest in the crop are eligible.",
    documents: ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Passbook"]
  },
];

/**
 * List of all Indian States for location-based filtering/selection.
 */
export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/**
 * Mapping of Indian States to their respective major districts.
 * Used for cascading selection in forms.
 */
export const districtsByState: Record<string, string[]> = {
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Prayagraj"],
  "Maharashtra": ["Pune", "Nagpur", "Nashik", "Aurangabad", "Mumbai Suburban"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurugram", "Faridabad", "Karnal", "Hisar", "Rohtak"],
};
