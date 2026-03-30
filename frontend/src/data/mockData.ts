import { SchemeData } from "@/components/SchemeCard";

/**
 * Comprehensive list of mock schemes for demonstration purposes.
 * Each entry includes eligibility rules, benefits, and required documents.
 */
export const mockSchemes: SchemeData[] = [
  {
    id: "1",
    name: "PM-KISAN",
    category: "Subsidies",
    eligible: true,
    benefit: "₹6,000/year",
    reason: "Small and marginal farmer with landholding under 2 hectares qualifies for income support.",
    proof: "Page 4, Paragraph 3: Farmers with landholding less than 2 hectares are eligible under PM-KISAN.",
    description:
      "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to small and marginal farmer families with cultivable land.",
    eligibilityRule: "Farmer families with combined landholding up to 2 hectares are eligible for ₹6,000/year in three equal installments.",
    proofText:
      "As per the PM-KISAN guidelines (2024 revision), Page 4, Paragraph 3: All farmer families with cultivable landholding up to 2 hectares shall be eligible for the scheme benefit of ₹6,000 per annum.",
    documents: ["Aadhaar Card", "Land Record", "Bank Passbook"],
  },
  {
    id: "2",
    name: "PM-KUSUM",
    category: "Solar",
    eligible: false,
    benefit: "Solar pump subsidy up to 60%",
    reason: "Landholding requirement of minimum 5 acres not met for Component-A.",
    proof: "Page 12, Section 5.2: Minimum 5 acres of contiguous land required for solar pump installation.",
    description:
      "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan promotes solar energy among farmers for irrigation and power generation.",
    eligibilityRule: "For Component-A, farmers must own minimum 5 acres of contiguous agricultural land near grid substations.",
    proofText:
      "PM-KUSUM Operational Guidelines, Page 12, Section 5.2: The beneficiary farmer shall possess a minimum of 5 acres of contiguous agricultural land for eligibility under Component-A.",
    documents: ["Aadhaar Card", "Land Record", "Bank Passbook"],
  },
  {
    id: "3",
    name: "Soil Health Card Scheme",
    category: "Soil Health",
    eligible: true,
    benefit: "Free soil testing & recommendations",
    reason: "All farmers with agricultural land are eligible for free soil health assessment.",
    proof: "Page 2, Para 1: All cultivating farmers are eligible for soil health card.",
    description:
      "The Soil Health Card Scheme provides soil testing and nutrient recommendations to farmers every 2 years to improve crop productivity.",
    eligibilityRule: "All farmers with cultivable agricultural land in India are eligible regardless of landholding size.",
    proofText:
      "Soil Health Card Scheme Guidelines, Page 2, Paragraph 1: Every cultivating farmer in the country shall be issued a Soil Health Card once in a cycle of 2 years.",
    documents: ["Aadhaar Card", "Land Record", "Bank Passbook"],
  },
  {
    id: "4",
    name: "PM Fasal Bima Yojana",
    category: "Insurance",
    eligible: true,
    benefit: "Crop insurance at 2% premium",
    reason: "Farmer grows notified crops in notified areas and is eligible for comprehensive insurance cover.",
    proof: "Section 3.1: All farmers including sharecroppers and tenant farmers growing the notified crops in the notified areas are eligible.",
    description: "PMFBY provides comprehensive insurance cover against failure of the crop thus helping in stabilizing the income of the farmers.",
    eligibilityRule: "Farmers growing notified crops in areas notified by the State Government are eligible.",
    proofText: "PMFBY Guidelines, Section 3.1: Farmers growing notified crops in notified areas are eligible for coverage.",
    documents: ["Aadhaar Card", "Sowing Certificate", "Land Record"],
  },
  {
    id: "5",
    name: "Kisan Credit Card (KCC)",
    category: "Loans",
    eligible: true,
    benefit: "Credit up to ₹3 Lakh at 4% interest",
    reason: "Active cultivating farmer meeting minimum land criteria for short-term credit requirements.",
    proof: "RBI Circular RPCD.No.PLNFS.BC.128: All farmers-individuals/Joint borrowers who are owner cultivators are eligible.",
    description: "KCC scheme aims at providing adequate and timely credit support from the banking system under a single window to the farmers for their cultivation and other needs.",
    eligibilityRule: "All farmers, individuals or joint borrowers who are owner cultivators, tenant farmers, or sharecroppers.",
    proofText: "KCC Scheme Documents: All farmers-individuals/Joint borrowers who are owner cultivators are eligible for credit support.",
    documents: ["Aadhaar Card", "Land Record", "Bank Passbook"],
  },
  {
    id: "6",
    name: "Micro Irrigation Fund",
    category: "Irrigation",
    eligible: true,
    benefit: "Financial assistance for drip irrigation",
    reason: "Eligible for incentive for adopting micro-irrigation systems to improve water use efficiency.",
    proof: "NABARD Guidelines: State Governments can access the fund for providing top-up/additional incentive to farmers.",
    description: "The fund objective is to facilitate States in mobilizing resources for expanding coverage of Micro Irrigation.",
    eligibilityRule: "Farmers intending to install drip or sprinkler irrigation systems on their farm land.",
    proofText: "Ministry of Agriculture: Farmers installing micro-irrigation systems are eligible for state-level top-up incentives.",
    documents: ["Aadhaar Card", "Land Record", "Quotation for System"],
  },
  {
    id: "7",
    name: "National Bamboo Mission",
    category: "Subsidies",
    eligible: true,
    benefit: "50% subsidy for bamboo plantation",
    reason: "Land available for non-forest bamboo cultivation meets the mission criteria.",
    proof: "Mission Guidelines Para 6: Farmers/Entrepreneurs planting bamboo in non-forest areas are eligible for financial assistance.",
    description: "NBM promotes the growth of the bamboo sector by providing financial assistance for plantation and processing units.",
    eligibilityRule: "Any farmer with land suitable for bamboo cultivation in non-forest areas.",
    proofText: "NBM Guidelines 2024: Farmers planting bamboo in non-forest areas are eligible for 50% subsidy.",
    documents: ["Aadhaar Card", "Land Record", "Application Form"],
  },
  {
    id: "8",
    name: "Paramparagat Krishi Vikas Yojana",
    category: "Subsidies",
    eligible: true,
    benefit: "₹50,000/ha for organic farming",
    reason: "Part of a farmer cluster transitioning to organic farming practices.",
    proof: "PKVY Guidelines: Farmers in clusters of 50 or more are eligible for support of ₹50,000 per hectare for 3 years.",
    description: "PKVY promotes organic farming through a cluster approach and PGS certification.",
    eligibilityRule: "Farmers forming clusters and willing to adopt organic farming practices.",
    proofText: "Ministry of Agriculture: Support of ₹50,000 per hectare for 3 years for organic conversion.",
    documents: ["Aadhaar Card", "Land Record", "Cluster Membership"],
  },
  {
    id: "9",
    name: "Restructured Weather Based Crop Insurance",
    category: "Insurance",
    eligible: true,
    benefit: "Insurance against weather extremes",
    reason: "Located in a weather-indexed notified area with historical data availability.",
    proof: "RWBCIS Section 4: All farmers including sharecroppers and tenant farmers growing notified crops are eligible.",
    description: "RWBCIS aims to mitigate the hardship of the insured farmers against the likelihood of financial loss on account of anticipated crop loss resulting from adverse weather conditions.",
    eligibilityRule: "Farmers in notified areas for crops where weather indices are established.",
    proofText: "RWBCIS Rules: Farmers in notified areas are eligible for weather-indexed insurance protection.",
    documents: ["Aadhaar Card", "Sowing Certificate", "Land Record"],
  },
  {
    id: "10",
    name: "Agricultural Infrastructure Fund",
    category: "Loans",
    eligible: true,
    benefit: "3% interest subvention on loans",
    reason: "Planning to build a cold storage or warehouse facility on farm land.",
    proof: "AIF Guidelines: FPOs, Farmers, Entrepreneurs are eligible for loans for post-harvest management projects.",
    description: "AIF provides medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure.",
    eligibilityRule: "Primary Agricultural Credit Societies, Marketing Cooperative Societies, FPOs, SHGs, Farmers, Entrepreneurs.",
    proofText: "AIF Guidelines Para 3.1: Farmers and Entrepreneurs are eligible for interest subvention of 3% per annum.",
    documents: ["Project Report", "Land Record", "ID Proof"],
  },
  {
    id: "11",
    name: "Per Drop More Crop (PDMC)",
    category: "Irrigation",
    eligible: true,
    benefit: "Subsidy on sprinkler systems",
    reason: "Eligible for subsidy based on category (SC/ST/Small/Marginal) for water-saving technology.",
    proof: "PDMC Guidelines Annexure I: Subsidy rates vary from 45% to 55% for different categories of farmers.",
    description: "PDMC focuses on enhancing water use efficiency at farm level through Micro Irrigation technologies viz. Drip and Sprinkler irrigation systems.",
    eligibilityRule: "Small and marginal farmers, SC/ST farmers, and women farmers are given preference.",
    proofText: "PDMC Guidelines: Eligible for subsidy on installation of micro-irrigation systems.",
    documents: ["Aadhaar Card", "Land Record", "Caste Certificate (if applicable)"],
  },
  {
    id: "12",
    name: "National Mission on Edible Oils - Oil Palm",
    category: "Subsidies",
    eligible: true,
    benefit: "₹29,000/ha for oil palm plantation",
    reason: "Located in a region identified as suitable for oil palm cultivation by the mission.",
    proof: "NMEO-OP Section 5.1: Assistance for planting material, maintenance, and intercropping.",
    description: "National Mission on Edible Oils - Oil Palm (NMEO-OP) aims to increase the oil palm area and productivity.",
    eligibilityRule: "Farmers in identified regions suitable for oil palm cultivation.",
    proofText: "Mission Guidelines: Assistance of ₹29,000 per hectare for planting material and maintenance.",
    documents: ["Aadhaar Card", "Land Record", "Sowing Intent"],
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
