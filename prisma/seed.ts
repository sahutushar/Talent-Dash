import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  { name: "Google", slug: "google", normalized_name: "google", industry: "Technology", headquarters: "Bengaluru", founded_year: 1998, headcount_range: "100,000+", website: "https://google.com", funding_stage: "Public", description: "Google LLC is an American multinational technology company.", glassdoor_rating: 4.4, ambitionbox_rating: 4.3, talentdash_score: 92.5 },
  { name: "Amazon", slug: "amazon", normalized_name: "amazon", industry: "E-commerce", headquarters: "Bengaluru", founded_year: 1994, headcount_range: "50,000+", website: "https://amazon.com", funding_stage: "Public", description: "Amazon is an American multinational technology company.", glassdoor_rating: 3.8, ambitionbox_rating: 3.9, talentdash_score: 84.0 },
  { name: "Meta", slug: "meta", normalized_name: "meta", industry: "Technology", headquarters: "Bengaluru", founded_year: 2004, headcount_range: "10,000+", website: "https://meta.com", funding_stage: "Public", description: "Meta Platforms is an American multinational technology conglomerate.", glassdoor_rating: 4.2, ambitionbox_rating: 4.1, talentdash_score: 89.0 },
  { name: "Microsoft", slug: "microsoft", normalized_name: "microsoft", industry: "Technology", headquarters: "Hyderabad", founded_year: 1975, headcount_range: "20,000+", website: "https://microsoft.com", funding_stage: "Public", description: "Microsoft Corporation is an American multinational technology corporation.", glassdoor_rating: 4.4, ambitionbox_rating: 4.2, talentdash_score: 90.0 },
  { name: "Flipkart", slug: "flipkart", normalized_name: "flipkart", industry: "E-commerce", headquarters: "Bengaluru", founded_year: 2007, headcount_range: "30,000+", website: "https://flipkart.com", funding_stage: "Acquired", description: "Flipkart is an Indian e-commerce company.", glassdoor_rating: 3.9, ambitionbox_rating: 4.0, talentdash_score: 80.0 },
  { name: "Meesho", slug: "meesho", normalized_name: "meesho", industry: "E-commerce", headquarters: "Bengaluru", founded_year: 2015, headcount_range: "5,000+", website: "https://meesho.com", funding_stage: "Series F", description: "Meesho is an Indian social commerce platform.", glassdoor_rating: 3.7, ambitionbox_rating: 3.8, talentdash_score: 75.0 },
  { name: "NVIDIA", slug: "nvidia", normalized_name: "nvidia", industry: "Semiconductor", headquarters: "Bengaluru", founded_year: 1993, headcount_range: "5,000+", website: "https://nvidia.com", funding_stage: "Public", description: "NVIDIA Corporation is an American multinational technology company.", glassdoor_rating: 4.5, ambitionbox_rating: 4.4, talentdash_score: 94.0 },
  { name: "TCS", slug: "tcs", normalized_name: "tcs", industry: "Consulting", headquarters: "Mumbai", founded_year: 1968, headcount_range: "500,000+", website: "https://tcs.com", funding_stage: "Public", description: "Tata Consultancy Services is an Indian multinational IT company.", glassdoor_rating: 3.8, ambitionbox_rating: 3.9, talentdash_score: 72.0 },
  { name: "Infosys", slug: "infosys", normalized_name: "infosys", industry: "Consulting", headquarters: "Bengaluru", founded_year: 1981, headcount_range: "300,000+", website: "https://infosys.com", funding_stage: "Public", description: "Infosys Limited is an Indian multinational IT company.", glassdoor_rating: 3.7, ambitionbox_rating: 3.8, talentdash_score: 70.0 },
  { name: "Wipro", slug: "wipro", normalized_name: "wipro", industry: "Consulting", headquarters: "Bengaluru", founded_year: 1945, headcount_range: "250,000+", website: "https://wipro.com", funding_stage: "Public", description: "Wipro Limited is an Indian multinational IT company.", glassdoor_rating: 3.6, ambitionbox_rating: 3.7, talentdash_score: 68.0 },
  { name: "Razorpay", slug: "razorpay", normalized_name: "razorpay", industry: "Fintech", headquarters: "Bengaluru", founded_year: 2014, headcount_range: "3,000+", website: "https://razorpay.com", funding_stage: "Series F", description: "Razorpay is an Indian fintech company.", glassdoor_rating: 4.1, ambitionbox_rating: 4.0, talentdash_score: 83.0 },
  { name: "Zepto", slug: "zepto", normalized_name: "zepto", industry: "E-commerce", headquarters: "Mumbai", founded_year: 2021, headcount_range: "2,000+", website: "https://zeptonow.com", funding_stage: "Series E", description: "Zepto is an Indian quick commerce company.", glassdoor_rating: 3.9, ambitionbox_rating: 3.8, talentdash_score: 76.0 },
  { name: "Swiggy", slug: "swiggy", normalized_name: "swiggy", industry: "E-commerce", headquarters: "Bengaluru", founded_year: 2014, headcount_range: "5,000+", website: "https://swiggy.com", funding_stage: "Public", description: "Swiggy is an Indian online food ordering and delivery platform.", glassdoor_rating: 3.8, ambitionbox_rating: 3.9, talentdash_score: 78.0 },
  { name: "Ola", slug: "ola", normalized_name: "ola", industry: "Technology", headquarters: "Bengaluru", founded_year: 2010, headcount_range: "10,000+", website: "https://olacabs.com", funding_stage: "Public", description: "Ola is an Indian mobility technology company offering ride-hailing and EV services.", glassdoor_rating: 3.5, ambitionbox_rating: 3.6, talentdash_score: 71.0 },
  { name: "PhonePe", slug: "phonepe", normalized_name: "phonepe", industry: "Fintech", headquarters: "Bengaluru", founded_year: 2015, headcount_range: "4,000+", website: "https://phonepe.com", funding_stage: "Series E", description: "PhonePe is an Indian digital payments company and financial services platform.", glassdoor_rating: 4.0, ambitionbox_rating: 4.1, talentdash_score: 82.0 },
  { name: "Paytm", slug: "paytm", normalized_name: "paytm", industry: "Fintech", headquarters: "Noida", founded_year: 2010, headcount_range: "8,000+", website: "https://paytm.com", funding_stage: "Public", description: "Paytm is an Indian fintech company offering payments, banking and financial services.", glassdoor_rating: 3.6, ambitionbox_rating: 3.7, talentdash_score: 73.0 },
  { name: "Atlassian", slug: "atlassian", normalized_name: "atlassian", industry: "SaaS", headquarters: "Bengaluru", founded_year: 2002, headcount_range: "3,000+", website: "https://atlassian.com", funding_stage: "Public", description: "Atlassian is an Australian software company with a major engineering hub in Bengaluru.", glassdoor_rating: 4.3, ambitionbox_rating: 4.2, talentdash_score: 88.0 },
  { name: "Dunzo", slug: "dunzo", normalized_name: "dunzo", industry: "E-commerce", headquarters: "Bengaluru", founded_year: 2015, headcount_range: "1,000+", website: "https://dunzo.com", funding_stage: "Series D", description: "Dunzo is an Indian quick-commerce and delivery startup.", glassdoor_rating: 3.4, ambitionbox_rating: 3.5, talentdash_score: 66.0 },
  { name: "Zomato", slug: "zomato", normalized_name: "zomato", industry: "E-commerce", headquarters: "Gurugram", founded_year: 2008, headcount_range: "5,000+", website: "https://zomato.com", funding_stage: "Public", description: "Zomato is an Indian multinational food delivery and restaurant aggregator company.", glassdoor_rating: 3.9, ambitionbox_rating: 4.0, talentdash_score: 79.0 },
  { name: "Uber", slug: "uber", normalized_name: "uber", industry: "Technology", headquarters: "Bengaluru", founded_year: 2009, headcount_range: "3,000+", website: "https://uber.com", funding_stage: "Public", description: "Uber is a global ride-hailing and delivery platform with a major engineering hub in Bengaluru.", glassdoor_rating: 4.1, ambitionbox_rating: 4.0, talentdash_score: 85.0 },
  { name: "Salesforce", slug: "salesforce", normalized_name: "salesforce", industry: "SaaS", headquarters: "Hyderabad", founded_year: 1999, headcount_range: "5,000+", website: "https://salesforce.com", funding_stage: "Public", description: "Salesforce is an American cloud-based software company with a large engineering centre in Hyderabad.", glassdoor_rating: 4.3, ambitionbox_rating: 4.2, talentdash_score: 87.0 },
  { name: "Adobe", slug: "adobe", normalized_name: "adobe", industry: "SaaS", headquarters: "Noida", founded_year: 1982, headcount_range: "4,000+", website: "https://adobe.com", funding_stage: "Public", description: "Adobe is an American multinational software company with one of the largest R&D centres in Noida.", glassdoor_rating: 4.3, ambitionbox_rating: 4.2, talentdash_score: 88.0 },
  { name: "Groww", slug: "groww", normalized_name: "groww", industry: "Fintech", headquarters: "Bengaluru", founded_year: 2016, headcount_range: "2,000+", website: "https://groww.in", funding_stage: "Series E", description: "Groww is an Indian fintech startup offering stock trading, mutual funds, and investment services.", glassdoor_rating: 4.0, ambitionbox_rating: 4.1, talentdash_score: 81.0 },
  { name: "CRED", slug: "cred", normalized_name: "cred", industry: "Fintech", headquarters: "Bengaluru", founded_year: 2018, headcount_range: "1,500+", website: "https://cred.club", funding_stage: "Series F", description: "CRED is an Indian fintech startup rewarding creditworthy individuals.", glassdoor_rating: 4.1, ambitionbox_rating: 4.0, talentdash_score: 82.0 },
  { name: "HCL Technologies", slug: "hcl", normalized_name: "hcl", industry: "Consulting", headquarters: "Noida", founded_year: 1976, headcount_range: "200,000+", website: "https://hcltech.com", funding_stage: "Public", description: "HCL Technologies is an Indian multinational IT services company.", glassdoor_rating: 3.7, ambitionbox_rating: 3.8, talentdash_score: 69.0 },
];

const salaryData = [
  // Google
  { company: "google", role: "Software Engineer", level: "L3", location: "Bengaluru", currency: "INR", exp: 2, base: 2200000, bonus: 400000, stock: 800000 },
  { company: "google", role: "Software Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 3500000, bonus: 700000, stock: 2000000 },
  { company: "google", role: "Software Engineer", level: "L5", location: "Bengaluru", currency: "INR", exp: 8, base: 5500000, bonus: 1200000, stock: 4000000 },
  { company: "google", role: "Software Engineer", level: "L6", location: "Bengaluru", currency: "INR", exp: 12, base: 8000000, bonus: 2000000, stock: 8000000 },
  { company: "google", role: "Product Manager", level: "L5", location: "Bengaluru", currency: "INR", exp: 7, base: 5000000, bonus: 1500000, stock: 3500000 },
  { company: "google", role: "Data Scientist", level: "L4", location: "Hyderabad", currency: "INR", exp: 4, base: 3200000, bonus: 600000, stock: 1500000 },
  { company: "google", role: "Software Engineer", level: "L5", location: "San Francisco", currency: "USD", exp: 9, base: 250000, bonus: 50000, stock: 120000 },
  { company: "google", role: "Staff Engineer", level: "STAFF", location: "Bengaluru", currency: "INR", exp: 15, base: 12000000, bonus: 3000000, stock: 12000000 },
  // Amazon
  { company: "amazon", role: "Software Development Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1800000, bonus: 200000, stock: 600000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 3000000, bonus: 400000, stock: 1800000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 8, base: 4800000, bonus: 800000, stock: 3500000 },
  { company: "amazon", role: "Senior SDE", level: "L6", location: "Bengaluru", currency: "INR", exp: 11, base: 7500000, bonus: 1500000, stock: 6000000 },
  { company: "amazon", role: "Product Manager", level: "L5", location: "Bengaluru", currency: "INR", exp: 6, base: 4500000, bonus: 1000000, stock: 2500000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE_II", location: "Hyderabad", currency: "INR", exp: 5, base: 2800000, bonus: 350000, stock: 1600000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE_I", location: "Seattle", currency: "USD", exp: 2, base: 165000, bonus: 20000, stock: 40000 },
  { company: "amazon", role: "Principal Engineer", level: "PRINCIPAL", location: "Bengaluru", currency: "INR", exp: 18, base: 15000000, bonus: 4000000, stock: 15000000 },
  // Meta
  { company: "meta", role: "Software Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 3, base: 3200000, bonus: 700000, stock: 2200000 },
  { company: "meta", role: "Software Engineer", level: "L5", location: "Bengaluru", currency: "INR", exp: 7, base: 5800000, bonus: 1400000, stock: 5000000 },
  { company: "meta", role: "Software Engineer", level: "L6", location: "Bengaluru", currency: "INR", exp: 11, base: 9000000, bonus: 2500000, stock: 10000000 },
  { company: "meta", role: "Data Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 4, base: 3500000, bonus: 800000, stock: 2500000 },
  // Microsoft
  { company: "microsoft", role: "Software Engineer", level: "L4", location: "Hyderabad", currency: "INR", exp: 3, base: 2800000, bonus: 500000, stock: 1200000 },
  { company: "microsoft", role: "Software Engineer", level: "L5", location: "Hyderabad", currency: "INR", exp: 7, base: 4500000, bonus: 1000000, stock: 2800000 },
  { company: "microsoft", role: "Senior Software Engineer", level: "L6", location: "Hyderabad", currency: "INR", exp: 10, base: 7000000, bonus: 1800000, stock: 6000000 },
  { company: "microsoft", role: "Product Manager", level: "L4", location: "Hyderabad", currency: "INR", exp: 4, base: 3000000, bonus: 600000, stock: 1000000 },
  // Flipkart
  { company: "flipkart", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1600000, bonus: 150000, stock: 400000 },
  { company: "flipkart", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 2600000, bonus: 300000, stock: 1000000 },
  { company: "flipkart", role: "Software Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 8, base: 4000000, bonus: 600000, stock: 2500000 },
  { company: "flipkart", role: "Data Scientist", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 2800000, bonus: 400000, stock: 1200000 },
  // Meesho
  { company: "meesho", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 3, base: 2400000, bonus: 250000, stock: 800000 },
  { company: "meesho", role: "Product Manager", level: "L4", location: "Bengaluru", currency: "INR", exp: 4, base: 2800000, bonus: 400000, stock: 1000000 },
  { company: "meesho", role: "Data Analyst", level: "L3", location: "Bengaluru", currency: "INR", exp: 2, base: 1400000, bonus: 100000, stock: 200000 },
  // NVIDIA
  { company: "nvidia", role: "Software Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 4, base: 4000000, bonus: 1000000, stock: 4000000 },
  { company: "nvidia", role: "Software Engineer", level: "L5", location: "Bengaluru", currency: "INR", exp: 8, base: 6500000, bonus: 1800000, stock: 8000000 },
  { company: "nvidia", role: "Senior Research Scientist", level: "L6", location: "Bengaluru", currency: "INR", exp: 10, base: 9500000, bonus: 2500000, stock: 12000000 },
  // TCS
  { company: "tcs", role: "Software Engineer", level: "L3", location: "Mumbai", currency: "INR", exp: 1, base: 700000, bonus: 50000, stock: 0 },
  { company: "tcs", role: "Senior Software Engineer", level: "L4", location: "Mumbai", currency: "INR", exp: 5, base: 1200000, bonus: 100000, stock: 0 },
  { company: "tcs", role: "Tech Lead", level: "L5", location: "Bengaluru", currency: "INR", exp: 8, base: 1800000, bonus: 150000, stock: 0 },
  // Infosys
  { company: "infosys", role: "Systems Engineer", level: "L3", location: "Bengaluru", currency: "INR", exp: 1, base: 650000, bonus: 40000, stock: 0 },
  { company: "infosys", role: "Senior Systems Engineer", level: "L4", location: "Pune", currency: "INR", exp: 4, base: 1100000, bonus: 80000, stock: 0 },
  { company: "infosys", role: "Technology Analyst", level: "L5", location: "Hyderabad", currency: "INR", exp: 7, base: 1600000, bonus: 120000, stock: 0 },
  // Wipro
  { company: "wipro", role: "Software Engineer", level: "L3", location: "Bengaluru", currency: "INR", exp: 1, base: 600000, bonus: 30000, stock: 0 },
  { company: "wipro", role: "Senior Software Engineer", level: "L4", location: "Chennai", currency: "INR", exp: 5, base: 1000000, bonus: 70000, stock: 0 },
  // Razorpay
  { company: "razorpay", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1500000, bonus: 150000, stock: 500000 },
  { company: "razorpay", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 2800000, bonus: 350000, stock: 1200000 },
  { company: "razorpay", role: "Staff Engineer", level: "STAFF", location: "Bengaluru", currency: "INR", exp: 10, base: 6000000, bonus: 1200000, stock: 4000000 },
  // Zepto
  { company: "zepto", role: "Software Engineer", level: "SDE_II", location: "Mumbai", currency: "INR", exp: 3, base: 2200000, bonus: 200000, stock: 600000 },
  { company: "zepto", role: "Product Manager", level: "L4", location: "Mumbai", currency: "INR", exp: 4, base: 2600000, bonus: 300000, stock: 800000 },
  { company: "zepto", role: "Data Analyst", level: "L3", location: "Mumbai", currency: "INR", exp: 2, base: 1200000, bonus: 80000, stock: 100000 },
  // Swiggy
  { company: "swiggy", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1500000, bonus: 120000, stock: 400000 },
  { company: "swiggy", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 2600000, bonus: 280000, stock: 1000000 },
  { company: "swiggy", role: "Senior Software Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 7, base: 3800000, bonus: 500000, stock: 2000000 },
  { company: "swiggy", role: "Product Manager", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 3000000, bonus: 450000, stock: 1200000 },
  { company: "swiggy", role: "Data Scientist", level: "L4", location: "Bengaluru", currency: "INR", exp: 3, base: 2400000, bonus: 300000, stock: 800000 },
  // Ola
  { company: "ola", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1400000, bonus: 100000, stock: 300000 },
  { company: "ola", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 2400000, bonus: 250000, stock: 800000 },
  { company: "ola", role: "Staff Engineer", level: "STAFF", location: "Bengaluru", currency: "INR", exp: 10, base: 5000000, bonus: 900000, stock: 3000000 },
  { company: "ola", role: "Product Manager", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 2800000, bonus: 400000, stock: 1000000 },
  // PhonePe
  { company: "phonepe", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1600000, bonus: 150000, stock: 500000 },
  { company: "phonepe", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 2900000, bonus: 380000, stock: 1400000 },
  { company: "phonepe", role: "Senior Software Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 7, base: 4500000, bonus: 700000, stock: 2800000 },
  { company: "phonepe", role: "Data Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 3, base: 2600000, bonus: 300000, stock: 1000000 },
  // Paytm
  { company: "paytm", role: "Software Engineer", level: "SDE_I", location: "Noida", currency: "INR", exp: 1, base: 1200000, bonus: 80000, stock: 200000 },
  { company: "paytm", role: "Software Engineer", level: "SDE_II", location: "Noida", currency: "INR", exp: 4, base: 2200000, bonus: 200000, stock: 600000 },
  { company: "paytm", role: "Senior Software Engineer", level: "SDE_III", location: "Noida", currency: "INR", exp: 7, base: 3500000, bonus: 400000, stock: 1500000 },
  { company: "paytm", role: "Product Manager", level: "L4", location: "Noida", currency: "INR", exp: 5, base: 2500000, bonus: 300000, stock: 700000 },
  // Atlassian
  { company: "atlassian", role: "Software Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 3, base: 3000000, bonus: 600000, stock: 2000000 },
  { company: "atlassian", role: "Software Engineer", level: "L5", location: "Bengaluru", currency: "INR", exp: 7, base: 5000000, bonus: 1200000, stock: 5000000 },
  { company: "atlassian", role: "Senior Software Engineer", level: "L6", location: "Bengaluru", currency: "INR", exp: 11, base: 8000000, bonus: 2000000, stock: 9000000 },
  { company: "atlassian", role: "Staff Engineer", level: "STAFF", location: "Bengaluru", currency: "INR", exp: 14, base: 11000000, bonus: 3000000, stock: 14000000 },
  // Dunzo
  { company: "dunzo", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1100000, bonus: 60000, stock: 150000 },
  { company: "dunzo", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 3, base: 1900000, bonus: 150000, stock: 400000 },
  // Zomato
  { company: "zomato", role: "Software Engineer", level: "SDE_I", location: "Gurugram", currency: "INR", exp: 1, base: 1400000, bonus: 100000, stock: 350000 },
  { company: "zomato", role: "Software Engineer", level: "SDE_II", location: "Gurugram", currency: "INR", exp: 4, base: 2600000, bonus: 280000, stock: 1000000 },
  { company: "zomato", role: "Senior Software Engineer", level: "SDE_III", location: "Gurugram", currency: "INR", exp: 7, base: 4000000, bonus: 550000, stock: 2200000 },
  { company: "zomato", role: "Product Manager", level: "L4", location: "Gurugram", currency: "INR", exp: 5, base: 3200000, bonus: 500000, stock: 1500000 },
  { company: "zomato", role: "Data Scientist", level: "L4", location: "Gurugram", currency: "INR", exp: 3, base: 2400000, bonus: 300000, stock: 800000 },
  // Uber
  { company: "uber", role: "Software Engineer", level: "L4", location: "Bengaluru", currency: "INR", exp: 3, base: 3200000, bonus: 700000, stock: 2500000 },
  { company: "uber", role: "Software Engineer", level: "L5", location: "Bengaluru", currency: "INR", exp: 7, base: 5500000, bonus: 1300000, stock: 5500000 },
  { company: "uber", role: "Staff Engineer", level: "STAFF", location: "Bengaluru", currency: "INR", exp: 13, base: 10000000, bonus: 2500000, stock: 12000000 },
  { company: "uber", role: "Data Scientist", level: "L4", location: "Bengaluru", currency: "INR", exp: 4, base: 3500000, bonus: 800000, stock: 3000000 },
  // Salesforce
  { company: "salesforce", role: "Software Engineer", level: "L4", location: "Hyderabad", currency: "INR", exp: 3, base: 3000000, bonus: 600000, stock: 2000000 },
  { company: "salesforce", role: "Software Engineer", level: "L5", location: "Hyderabad", currency: "INR", exp: 7, base: 5000000, bonus: 1200000, stock: 5000000 },
  { company: "salesforce", role: "Senior Software Engineer", level: "L6", location: "Hyderabad", currency: "INR", exp: 11, base: 8000000, bonus: 2000000, stock: 9000000 },
  { company: "salesforce", role: "Product Manager", level: "L5", location: "Hyderabad", currency: "INR", exp: 6, base: 4800000, bonus: 1100000, stock: 4000000 },
  // Adobe
  { company: "adobe", role: "Software Engineer", level: "L4", location: "Noida", currency: "INR", exp: 3, base: 2800000, bonus: 550000, stock: 1800000 },
  { company: "adobe", role: "Software Engineer", level: "L5", location: "Noida", currency: "INR", exp: 7, base: 4800000, bonus: 1100000, stock: 4500000 },
  { company: "adobe", role: "Senior Software Engineer", level: "L6", location: "Noida", currency: "INR", exp: 11, base: 7500000, bonus: 1800000, stock: 8000000 },
  { company: "adobe", role: "Data Scientist", level: "L4", location: "Bengaluru", currency: "INR", exp: 4, base: 3200000, bonus: 700000, stock: 2200000 },
  // Groww
  { company: "groww", role: "Software Engineer", level: "SDE_I", location: "Bengaluru", currency: "INR", exp: 1, base: 1600000, bonus: 150000, stock: 500000 },
  { company: "groww", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 4, base: 3000000, bonus: 400000, stock: 1500000 },
  { company: "groww", role: "Senior Software Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 7, base: 4800000, bonus: 700000, stock: 3000000 },
  { company: "groww", role: "Product Manager", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 3500000, bonus: 600000, stock: 2000000 },
  // CRED
  { company: "cred", role: "Software Engineer", level: "SDE_II", location: "Bengaluru", currency: "INR", exp: 3, base: 2800000, bonus: 400000, stock: 1500000 },
  { company: "cred", role: "Senior Software Engineer", level: "SDE_III", location: "Bengaluru", currency: "INR", exp: 7, base: 4500000, bonus: 700000, stock: 3000000 },
  { company: "cred", role: "Product Manager", level: "L4", location: "Bengaluru", currency: "INR", exp: 5, base: 3800000, bonus: 700000, stock: 2500000 },
  { company: "cred", role: "Data Scientist", level: "L4", location: "Bengaluru", currency: "INR", exp: 3, base: 2600000, bonus: 350000, stock: 1000000 },
  // HCL
  { company: "hcl", role: "Software Engineer", level: "L3", location: "Noida", currency: "INR", exp: 1, base: 650000, bonus: 40000, stock: 0 },
  { company: "hcl", role: "Senior Software Engineer", level: "L4", location: "Noida", currency: "INR", exp: 5, base: 1150000, bonus: 90000, stock: 0 },
  { company: "hcl", role: "Tech Lead", level: "L5", location: "Chennai", currency: "INR", exp: 9, base: 1800000, bonus: 150000, stock: 0 },
  // Edge cases
  { company: "amazon", role: "Software Development Engineer", level: "SDE_I", location: "Pune", currency: "INR", exp: 1, base: 1700000, bonus: 0, stock: 0 },
  { company: "nvidia", role: "Principal Research Engineer", level: "PRINCIPAL", location: "Bengaluru", currency: "INR", exp: 16, base: 18000000, bonus: 5000000, stock: 40000000 },
  { company: "google", role: "Software Engineer", level: "IC4", location: "London", currency: "GBP", exp: 7, base: 120000, bonus: 25000, stock: 60000 },
  { company: "microsoft", role: "Software Engineer", level: "L3", location: "New York", currency: "USD", exp: 2, base: 145000, bonus: 15000, stock: 25000 },
];

const reviewData = [
  { company: "google", role: "Software Engineer", level: "L5", location: "Bengaluru", overall: 4.5, wlb: 4.0, growth: 4.5, mgmt: 4.2, culture: 4.8, comp: 4.7, title: "Best engineering culture in India", pros: "Brilliant colleagues, great learning, free food", cons: "Slow promotion cycles, bureaucratic at L5+", recommend: true },
  { company: "amazon", role: "SDE-II", level: "SDE_II", location: "Bengaluru", overall: 3.5, wlb: 2.8, growth: 4.0, mgmt: 3.2, culture: 3.4, comp: 4.0, title: "High pay but brutal WLB", pros: "Excellent pay, leadership principles drive clarity", cons: "On-call every 3 weeks, high attrition, pressure culture", recommend: true },
  { company: "microsoft", role: "SDE", level: "L4", location: "Hyderabad", overall: 4.2, wlb: 4.5, growth: 4.0, mgmt: 4.1, culture: 4.3, comp: 3.9, title: "Great WLB, slightly lower comp than FAANG", pros: "Excellent work-life balance, good manager culture", cons: "Pay is 15-20% below Google/Meta", recommend: true },
  { company: "flipkart", role: "SDE-II", level: "SDE_II", location: "Bengaluru", overall: 3.8, wlb: 3.5, growth: 3.9, mgmt: 3.6, culture: 3.8, comp: 3.5, title: "Good Indian startup experience", pros: "Scale problems are interesting, good exposure", cons: "Pay hasn't kept up with inflation", recommend: true },
  { company: "tcs", role: "Software Engineer", level: "L3", location: "Mumbai", overall: 3.2, wlb: 3.8, growth: 2.8, mgmt: 3.0, culture: 3.2, comp: 2.5, title: "Good for freshers, switch after 2 years", pros: "Job security, diverse projects, good training", cons: "Very low pay, slow growth, micromanagement", recommend: false },
  { company: "razorpay", role: "SDE-I", level: "SDE_I", location: "Bengaluru", overall: 4.1, wlb: 3.7, growth: 4.3, mgmt: 4.0, culture: 4.2, comp: 4.0, title: "Best fintech startup in India to work at", pros: "Ownership from day 1, fast growth, good pay", cons: "Work-life balance can suffer during sprints", recommend: true },
  { company: "swiggy", role: "SDE-II", level: "SDE_II", location: "Bengaluru", overall: 3.8, wlb: 3.4, growth: 4.0, mgmt: 3.7, culture: 3.9, comp: 3.6, title: "Fast-paced and exciting, but demanding", pros: "Challenging scale problems, good comp for startups, strong tech team", cons: "Long hours during product launches, high pressure", recommend: true },
  { company: "phonepe", role: "SDE-II", level: "SDE_II", location: "Bengaluru", overall: 4.0, wlb: 3.8, growth: 4.2, mgmt: 3.9, culture: 4.0, comp: 4.1, title: "Solid fintech with real ownership", pros: "Great product exposure, competitive pay, collaborative culture", cons: "On-call duties can be intense, growing pains at scale", recommend: true },
  { company: "atlassian", role: "Software Engineer L5", level: "L5", location: "Bengaluru", overall: 4.3, wlb: 4.6, growth: 4.1, mgmt: 4.4, culture: 4.5, comp: 4.2, title: "Best WLB in tech, genuinely remote-first", pros: "TEAM Anywhere policy, excellent manager culture, great comp", cons: "Growth can feel slow compared to hyper-growth startups", recommend: true },
  { company: "paytm", role: "SDE-II", level: "SDE_II", location: "Noida", overall: 3.3, wlb: 3.4, growth: 3.2, mgmt: 3.0, culture: 3.2, comp: 3.1, title: "Good brand name, but organisation is chaotic", pros: "Brand recognition, varied work, large scale", cons: "Frequent reorgs, below-market pay, uncertain future", recommend: false },
  { company: "ola", role: "SDE-I", level: "SDE_I", location: "Bengaluru", overall: 3.4, wlb: 3.2, growth: 3.5, mgmt: 3.1, culture: 3.3, comp: 3.2, title: "Exciting problems but volatile environment", pros: "Interesting mobility and EV tech problems, young team", cons: "High attrition, frequent layoffs, poor management", recommend: false },
  { company: "zomato", role: "SDE-II", level: "SDE_II", location: "Gurugram", overall: 3.9, wlb: 3.5, growth: 4.1, mgmt: 3.7, culture: 3.9, comp: 3.7, title: "Fast growth, real ownership at early stage", pros: "High ownership, interesting scale problems, decent pay", cons: "Hectic during peak sale seasons, some teams under-resourced", recommend: true },
  { company: "uber", role: "SDE L4", level: "L4", location: "Bengaluru", overall: 4.2, wlb: 4.0, growth: 4.1, mgmt: 4.2, culture: 4.3, comp: 4.4, title: "FAANG-level pay with startup energy", pros: "Excellent compensation, strong engineering culture, global exposure", cons: "On-call burden for infra teams, US timezone overlap sometimes needed", recommend: true },
  { company: "salesforce", role: "Software Engineer L5", level: "L5", location: "Hyderabad", overall: 4.3, wlb: 4.4, growth: 4.0, mgmt: 4.3, culture: 4.4, comp: 4.2, title: "Great culture and work-life balance", pros: "Ohana culture is real, excellent manager training, good WLB", cons: "Growth can be slow in some orgs, large company bureaucracy", recommend: true },
  { company: "adobe", role: "SDE L5", level: "L5", location: "Noida", overall: 4.3, wlb: 4.5, growth: 3.9, mgmt: 4.2, culture: 4.3, comp: 4.1, title: "Underrated gem in Noida tech scene", pros: "Best WLB in the region, creative work, stable company", cons: "Not as fast-paced as startups, some legacy codebases", recommend: true },
  { company: "groww", role: "SDE-II", level: "SDE_II", location: "Bengaluru", overall: 4.0, wlb: 3.8, growth: 4.3, mgmt: 3.9, culture: 4.1, comp: 4.0, title: "Best fintech to join post-Series D", pros: "Huge ownership, profitable startup, strong eng culture", cons: "Scaling pains, processes still maturing", recommend: true },
  { company: "cred", role: "SDE-III", level: "SDE_III", location: "Bengaluru", overall: 4.1, wlb: 3.9, growth: 4.2, mgmt: 4.0, culture: 4.3, comp: 4.1, title: "Premium product with premium eng culture", pros: "High bar for engineering quality, great pay, excellent design culture", cons: "Niche product limits some problem domains", recommend: true },
  { company: "hcl", role: "Software Engineer", level: "L3", location: "Noida", overall: 3.3, wlb: 3.7, growth: 2.9, mgmt: 3.1, culture: 3.2, comp: 2.6, title: "Safe but slow — good for freshers only", pros: "Job security, training programs, large project variety", cons: "Low pay, slow career progression, service company mindset", recommend: false },
];

const interviewData = [
  { company: "google", role: "Software Engineer", level: "L4", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "Phone Screen", description: "45 min DSA — reverse linked list + BFS" }, { round: 2, type: "Technical", description: "LC Hard — DP problem, trees" }, { round: 3, type: "Technical", description: "System Design — Design YouTube" }, { round: 4, type: "Behavioural", description: "Googliness + leadership" }], tips: "Practice LC Hard daily for 3 months. System design is key at L4+." },
  { company: "amazon", role: "SDE-II", level: "SDE_II", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "OA", description: "2 LC mediums, 90 mins" }, { round: 2, type: "Technical", description: "DSA — graphs, DP" }, { round: 3, type: "System Design", description: "Design URL shortener" }, { round: 4, type: "Bar Raiser", description: "Leadership Principles — STAR format, 60 mins" }], tips: "LP stories are non-negotiable. Prepare 10 STAR stories mapped to Amazon LPs." },
  { company: "microsoft", role: "SDE", level: "L4", location: "Hyderabad", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "DSA + coding — trees, arrays" }, { round: 2, type: "Technical", description: "System Design — Design a cache" }, { round: 3, type: "Hiring Manager", description: "Past projects, collaboration" }], tips: "Microsoft values collaboration. Show teamwork in behavioral rounds." },
  { company: "flipkart", role: "SDE-II", level: "SDE_II", location: "Bengaluru", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "DSA", description: "2 LC mediums" }, { round: 2, type: "System Design", description: "Design Flipkart search" }, { round: 3, type: "HM Round", description: "Culture fit, past work" }], tips: "Focus on scale — Flipkart handles massive traffic." },
  { company: "razorpay", role: "SDE-I", level: "SDE_I", location: "Bengaluru", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "DSA basics + coding" }, { round: 2, type: "System Design", description: "Design payment gateway" }, { round: 3, type: "Culture Fit", description: "Values alignment" }], tips: "Know payments domain — UPI, card flows, reconciliation basics." },
  { company: "swiggy", role: "SDE-II", level: "SDE_II", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "OA", description: "2 LC mediums on arrays and graphs" }, { round: 2, type: "Technical", description: "DSA — dynamic programming, heaps" }, { round: 3, type: "System Design", description: "Design a real-time order tracking system" }, { round: 4, type: "Hiring Manager", description: "Past projects and ownership stories" }], tips: "Focus on distributed systems and real-time data. Know Kafka basics." },
  { company: "phonepe", role: "SDE-II", level: "SDE_II", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "LC medium — sliding window and hashmaps" }, { round: 2, type: "Technical", description: "DSA — graphs and backtracking" }, { round: 3, type: "System Design", description: "Design UPI payment flow" }, { round: 4, type: "Behavioural", description: "Ownership and conflict resolution" }], tips: "Understand payment flows deeply — UPI, PG, settlement. Read NPCI guidelines." },
  { company: "atlassian", role: "Software Engineer L5", level: "L5", location: "Bengaluru", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "DSA — trees and recursion" }, { round: 2, type: "System Design", description: "Design Jira's notification system" }, { round: 3, type: "Values", description: "Atlassian values alignment — open company, no BS" }], tips: "Read Atlassian's TEAM playbook. They deeply value autonomy and trust." },
  { company: "ola", role: "SDE-I", level: "SDE_I", location: "Bengaluru", difficulty: "MEDIUM", outcome: "REJECT", rounds: [{ round: 1, type: "Technical", description: "LC easy/medium — arrays, strings" }, { round: 2, type: "Technical", description: "System Design basics — design a cab booking system" }, { round: 3, type: "HR", description: "General HR discussion" }], tips: "Prepare cab-matching and location-based system design. Know basics of geo-indexing." },
  { company: "zomato", role: "SDE-II", level: "SDE_II", location: "Gurugram", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "OA", description: "2 LC mediums — arrays, strings" }, { round: 2, type: "Technical", description: "DSA — graphs, sliding window" }, { round: 3, type: "System Design", description: "Design a food delivery tracking system" }, { round: 4, type: "Hiring Manager", description: "Culture and ownership discussion" }], tips: "Know geolocation and pub-sub systems. Show ownership mindset." },
  { company: "uber", role: "SDE L4", level: "L4", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "LC medium/hard — heaps, graphs" }, { round: 2, type: "Technical", description: "Distributed systems fundamentals" }, { round: 3, type: "System Design", description: "Design surge pricing system" }, { round: 4, type: "Behavioural", description: "Leadership and impact stories" }], tips: "Uber focuses heavily on distributed systems. Know CAP theorem, Kafka, and rate limiting." },
  { company: "salesforce", role: "Software Engineer L5", level: "L5", location: "Hyderabad", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "DSA — trees, recursion" }, { round: 2, type: "System Design", description: "Design a multi-tenant SaaS CRM" }, { round: 3, type: "Values", description: "Salesforce Ohana values alignment" }], tips: "Understand multi-tenancy deeply. Salesforce values empathy and collaboration strongly." },
  { company: "adobe", role: "SDE L5", level: "L5", location: "Noida", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "DSA — DP, graphs" }, { round: 2, type: "System Design", description: "Design a document collaboration system" }, { round: 3, type: "Hiring Manager", description: "Past projects and innovation discussion" }], tips: "Adobe values creativity and problem-solving. Brush up on collaboration and concurrency patterns." },
  { company: "groww", role: "SDE-II", level: "SDE_II", location: "Bengaluru", difficulty: "MEDIUM", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "LC mediums — hashmaps, arrays" }, { round: 2, type: "System Design", description: "Design a stock portfolio tracker" }, { round: 3, type: "Culture Fit", description: "Ownership and first-principles thinking" }], tips: "Know stock trading basics — order books, SEBI regulations at high level, real-time data feeds." },
  { company: "cred", role: "SDE-III", level: "SDE_III", location: "Bengaluru", difficulty: "HARD", outcome: "OFFER", rounds: [{ round: 1, type: "Technical", description: "LC hard — DP and graphs" }, { round: 2, type: "Technical", description: "Low-level design — design a parking lot system" }, { round: 3, type: "System Design", description: "Design CRED's rewards platform" }, { round: 4, type: "Bar Raiser", description: "Engineering excellence and quality bar discussion" }], tips: "CRED has a very high engineering bar. Focus on clean code, LLD, and elegant system design." },
];

const workplaceScoreData = [
  { company: "google", comp: 95, wlb: 82, growth: 90, culture: 93, dei: 88, remote: 75 },
  { company: "amazon", comp: 88, wlb: 55, growth: 82, culture: 65, dei: 72, remote: 50 },
  { company: "meta", comp: 92, wlb: 70, growth: 85, culture: 80, dei: 82, remote: 78 },
  { company: "microsoft", comp: 82, wlb: 88, growth: 80, culture: 85, dei: 86, remote: 82 },
  { company: "flipkart", comp: 72, wlb: 68, growth: 75, culture: 72, dei: 70, remote: 60 },
  { company: "razorpay", comp: 80, wlb: 72, growth: 85, culture: 82, dei: 75, remote: 70 },
  { company: "nvidia", comp: 95, wlb: 78, growth: 88, culture: 85, dei: 80, remote: 65 },
  { company: "tcs", comp: 45, wlb: 75, growth: 55, culture: 60, dei: 65, remote: 55 },
  { company: "infosys", comp: 42, wlb: 72, growth: 52, culture: 58, dei: 63, remote: 52 },
  { company: "zepto", comp: 75, wlb: 60, growth: 80, culture: 70, dei: 68, remote: 40 },
  { company: "swiggy", comp: 74, wlb: 62, growth: 78, culture: 72, dei: 70, remote: 45 },
  { company: "ola", comp: 65, wlb: 58, growth: 70, culture: 62, dei: 60, remote: 38 },
  { company: "phonepe", comp: 80, wlb: 70, growth: 82, culture: 78, dei: 72, remote: 55 },
  { company: "paytm", comp: 60, wlb: 62, growth: 65, culture: 60, dei: 58, remote: 45 },
  { company: "atlassian", comp: 88, wlb: 92, growth: 82, culture: 88, dei: 85, remote: 95 },
  { company: "dunzo", comp: 55, wlb: 55, growth: 60, culture: 58, dei: 55, remote: 40 },
  { company: "zomato", comp: 72, wlb: 63, growth: 80, culture: 74, dei: 70, remote: 42 },
  { company: "uber", comp: 88, wlb: 78, growth: 83, culture: 84, dei: 82, remote: 72 },
  { company: "salesforce", comp: 85, wlb: 88, growth: 80, culture: 88, dei: 87, remote: 85 },
  { company: "adobe", comp: 84, wlb: 90, growth: 78, culture: 86, dei: 84, remote: 80 },
  { company: "groww", comp: 78, wlb: 70, growth: 84, culture: 78, dei: 72, remote: 48 },
  { company: "cred", comp: 80, wlb: 72, growth: 82, culture: 82, dei: 74, remote: 55 },
  { company: "hcl", comp: 40, wlb: 72, growth: 50, culture: 56, dei: 62, remote: 50 },
];

async function main() {
  console.log("Seeding database...");

  await prisma.workplaceScore.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.review.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.company.deleteMany();

  const companyMap: Record<string, string> = {};

  for (const c of companies) {
    const company = await prisma.company.create({
      data: {
        name: c.name, slug: c.slug, normalized_name: c.normalized_name,
        industry: c.industry, headquarters: c.headquarters, founded_year: c.founded_year,
        headcount_range: c.headcount_range, website: c.website, funding_stage: c.funding_stage,
        description: c.description,
        glassdoor_rating: c.glassdoor_rating, ambitionbox_rating: c.ambitionbox_rating,
        talentdash_score: c.talentdash_score,
      },
    });
    companyMap[c.slug] = company.id;
  }

  for (const s of salaryData) {
    const companyId = companyMap[s.company];
    if (!companyId) continue;
    const tc = s.base + (s.bonus ?? 0) + (s.stock ?? 0);
    await prisma.salary.create({
      data: {
        company_id: companyId, role: s.role, level: s.level as never,
        location: s.location, currency: s.currency as never,
        experience_years: s.exp, base_salary: s.base, bonus: s.bonus ?? 0,
        stock: s.stock ?? 0, total_compensation: tc,
        source: "CONTRIBUTOR", confidence_score: 0.9, is_verified: true,
      },
    });
  }

  for (const r of reviewData) {
    const companyId = companyMap[r.company];
    if (!companyId) continue;
    await prisma.review.create({
      data: {
        company_id: companyId, role: r.role, level: r.level as never,
        location: r.location, rating_overall: r.overall, rating_wlb: r.wlb,
        rating_growth: r.growth, rating_mgmt: r.mgmt, rating_culture: r.culture,
        rating_compensation: r.comp, title: r.title, pros: r.pros, cons: r.cons,
        would_recommend: r.recommend, is_anonymous: true, is_verified: true,
      },
    });
  }

  for (const i of interviewData) {
    const companyId = companyMap[i.company];
    if (!companyId) continue;
    await prisma.interview.create({
      data: {
        company_id: companyId, role: i.role, level: i.level as never,
        location: i.location, difficulty: i.difficulty as never,
        outcome: i.outcome as never, rounds: i.rounds, tips: i.tips,
        is_verified: true,
      },
    });
  }

  for (const w of workplaceScoreData) {
    const companyId = companyMap[w.company];
    if (!companyId) continue;
    const composite = (w.comp * 0.3 + w.wlb * 0.2 + w.growth * 0.25 + w.culture * 0.15 + w.dei * 0.05 + w.remote * 0.05) / 100 * 100;
    await prisma.workplaceScore.create({
      data: {
        company_id: companyId, score_compensation: w.comp, score_wlb: w.wlb,
        score_growth: w.growth, score_culture: w.culture, score_dei: w.dei,
        score_remote: w.remote, composite_score: Math.round(composite * 10) / 10,
      },
    });
  }

  console.log("Seed complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
