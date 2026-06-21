const LEGAL_SUFFIXES = [
  "pvt ltd", "private limited", "pvt. ltd.", "pvt. ltd",
  "ltd.", "ltd", "llc", "inc.", "inc", "corp.", "corp",
  "technologies", "technology", "tech", "solutions", "services",
  "india", "global", "worldwide", "international", "group",
  "bpo", "software", ".com",
];

// Loaded from aliases map
const ALIASES: Record<string, string> = {
  "tata consultancy": "tcs",
  "tata consultancy services": "tcs",
  "tcs ltd": "tcs",
  "amazon web services": "aws",
  "amazon.com": "amazon",
  "meta platforms": "meta",
  "facebook": "meta",
  "alphabet": "google",
  "google india": "google",
  "microsoft india": "microsoft",
  "infosys bpo": "infosys",
  "wipro technologies": "wipro",
  "wipro ltd": "wipro",
  "flipkart internet": "flipkart",
  "hcl technologies": "hcl",
  "hcl tech": "hcl",
  "tech mahindra": "techmahindra",
  "accenture india": "accenture",
  "ibm india": "ibm",
  "cognizant technology": "cognizant",
  "cognizant technology solutions": "cognizant",
  "swiggy": "swiggy",
  "zomato": "zomato",
  "paytm": "paytm",
  "one97 communications": "paytm",
  "phonepe": "phonepe",
};

export function normalizeCompanyName(raw: string): string {
  let name = raw.toLowerCase().trim();
  name = name.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

  for (const suffix of LEGAL_SUFFIXES) {
    const pattern = new RegExp(`\\b${suffix.replace(/\./g, "\\.")}\\b`, "gi");
    name = name.replace(pattern, "").trim();
  }
  name = name.replace(/\s+/g, " ").trim();

  if (ALIASES[name]) return ALIASES[name];

  // partial alias match
  for (const [alias, canonical] of Object.entries(ALIASES)) {
    if (name.startsWith(alias) || alias.startsWith(name)) return canonical;
  }

  return name.replace(/\s+/g, "-");
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function formatCompanyName(slug: string): string {
  const DISPLAY_NAMES: Record<string, string> = {
    google: "Google", amazon: "Amazon", meta: "Meta", microsoft: "Microsoft",
    flipkart: "Flipkart", meesho: "Meesho", nvidia: "NVIDIA", tcs: "TCS",
    infosys: "Infosys", wipro: "Wipro", razorpay: "Razorpay", zepto: "Zepto",
    swiggy: "Swiggy", zomato: "Zomato", paytm: "Paytm", phonepe: "PhonePe",
    accenture: "Accenture", ibm: "IBM", cognizant: "Cognizant", hcl: "HCL",
    techmahindra: "Tech Mahindra", aws: "AWS", byju: "BYJU'S",
    ola: "Ola", uber: "Uber", atlassian: "Atlassian", adobe: "Adobe",
    salesforce: "Salesforce", oracle: "Oracle", sap: "SAP",
  };
  return DISPLAY_NAMES[slug] ?? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
