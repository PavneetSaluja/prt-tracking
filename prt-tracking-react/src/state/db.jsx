import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

// ── Initial Seed Data ──────────────────────────────────────────────────

const INITIAL_PEOPLE = [
  { id: "sarah", empId: "EMP-1001", name: "Sarah Jenkins", dept: "Delivery", designation: "Delivery Lead", role: "PM", status: "Active", joined: "12 Jan 2024", manager: "Head of Delivery", email: "sarah.j@pulseorganizer.io", skills: ["Agile", "Scrum", "Project Planning"], capacity: 40, phone: "+91 98100 22334", ctc: 1800000, leaveBalance: 12, leavesTaken: 4, performanceRating: 4.8, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "david_pm", empId: "EMP-1002", name: "David Okoye", dept: "Delivery", designation: "Senior PM", role: "PM", status: "Active", joined: "03 Mar 2024", manager: "Head of Delivery", email: "david.o@pulseorganizer.io", skills: ["Budgeting", "Risk Management"], capacity: 40, phone: "+91 98100 22335", ctc: 1600000, leaveBalance: 14, leavesTaken: 2, performanceRating: 4.5, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "pavneet", empId: "EMP-1003", name: "Pavneet Kaur", dept: "Product Design", designation: "UI/UX Designer", role: "Resource", status: "Active", joined: "18 May 2024", manager: "Sarah Jenkins", email: "pavneet.k@pulseorganizer.io", skills: ["Figma", "UX Research", "Prototyping"], capacity: 40, phone: "+91 98100 22336", ctc: 1200000, leaveBalance: 10, leavesTaken: 6, performanceRating: 4.9, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "rahul", empId: "EMP-1004", name: "Rahul Nair", dept: "Engineering", designation: "React Developer", role: "Resource", status: "Active", joined: "02 Feb 2024", manager: "David Okoye", email: "rahul.n@pulseorganizer.io", skills: ["React", "TypeScript", "Node.js"], capacity: 40, phone: "+91 98100 22337", ctc: 1000000, leaveBalance: 11, leavesTaken: 5, performanceRating: 4.2, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "marcus", empId: "EMP-1005", name: "Marcus Vance", dept: "Product Design", designation: "Senior UI/UX Designer", role: "Resource", status: "Active", joined: "20 May 2024", manager: "Sarah Jenkins", email: "marcus.v@pulseorganizer.io", skills: ["Figma", "Prototyping", "Design Systems", "Illustrator", "React"], capacity: 40, phone: "+91 98100 22338", ctc: 1400000, leaveBalance: 15, leavesTaken: 1, performanceRating: 4.7, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "linda", empId: "EMP-1006", name: "Linda Wu", dept: "Engineering", designation: "Backend Engineer", role: "Resource", status: "Active", joined: "11 Nov 2023", manager: "David Okoye", email: "linda.w@pulseorganizer.io", skills: ["Node.js", "PostgreSQL", "AWS"], capacity: 40, phone: "+91 98100 22339", ctc: 1100000, leaveBalance: 12, leavesTaken: 3, performanceRating: 4.6, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "david", empId: "EMP-1007", name: "David Chen", dept: "Quality", designation: "QA Engineer", role: "Resource", status: "Active", joined: "09 Sep 2024", manager: "David Okoye", email: "david.c@pulseorganizer.io", skills: ["QA Testing", "Cypress", "Selenium"], capacity: 40, phone: "+91 98100 22340", ctc: 900000, leaveBalance: 13, leavesTaken: 2, performanceRating: 4.4, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "sophia", empId: "EMP-1008", name: "Sophia Martinez", dept: "Product Design", designation: "Product Designer", role: "Resource", status: "Active", joined: "14 Jun 2024", manager: "Sarah Jenkins", email: "sophia.m@pulseorganizer.io", skills: ["Figma", "Illustration"], capacity: 40, phone: "+91 98100 22341", ctc: 950000, leaveBalance: 10, leavesTaken: 4, performanceRating: 4.5, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "liam", empId: "EMP-1009", name: "Liam Robinson", dept: "Product Design", designation: "Motion Designer", role: "Resource", status: "Active", joined: "22 Jul 2024", manager: "Sarah Jenkins", email: "liam.r@pulseorganizer.io", skills: ["After Effects", "Lottie"], capacity: 40, phone: "+91 98100 22342", ctc: 920000, leaveBalance: 14, leavesTaken: 0, performanceRating: 4.3, onboardingStatus: "In Progress", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: false } },
  { id: "rahul_sales", empId: "EMP-1010", name: "Rahul Sharma", dept: "Sales", designation: "Sales Manager", role: "Sales", status: "Active", joined: "05 Jan 2023", manager: "VP Sales", email: "rahul.s@pulseorganizer.io", skills: ["Enterprise Sales", "Negotiation"], capacity: 40, phone: "+91 98100 22343", ctc: 1300000, leaveBalance: 12, leavesTaken: 4, performanceRating: 4.6, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "priya", empId: "EMP-1011", name: "Priya Menon", dept: "Sales", designation: "Account Executive", role: "Sales", status: "Active", joined: "19 Apr 2024", manager: "Rahul Sharma", email: "priya.m@pulseorganizer.io", skills: ["Direct Sales", "Lead Gen"], capacity: 40, phone: "+91 98100 22344", ctc: 1050000, leaveBalance: 11, leavesTaken: 3, performanceRating: 4.4, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "aman", empId: "EMP-1012", name: "Aman Gupta", dept: "Sales", designation: "Sales Executive", role: "Sales", status: "Active", joined: "10 Oct 2024", manager: "Rahul Sharma", email: "aman.g@pulseorganizer.io", skills: ["Cold Calling", "Lead Nurturing"], capacity: 40, phone: "+91 98100 22345", ctc: 800000, leaveBalance: 15, leavesTaken: 0, performanceRating: 4.0, onboardingStatus: "In Progress", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: false, bankDetailsAdded: false } },
  { id: "neha", empId: "EMP-1013", name: "Neha Kapoor", dept: "Executive", designation: "Chief Operating Officer", role: "COO", status: "Active", joined: "15 Aug 2022", manager: "CEO", email: "neha.k@pulseorganizer.io", skills: ["Ops Strategy", "Management"], capacity: 40, phone: "+91 98100 22346", ctc: 2400000, leaveBalance: 16, leavesTaken: 2, performanceRating: 4.8, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "arjun", empId: "EMP-1014", name: "Arjun Mehta", dept: "Operations", designation: "Operations Admin", role: "Admin", status: "Active", joined: "01 Dec 2022", manager: "CEO", email: "arjun.m@pulseorganizer.io", skills: ["Office Management", "System Admin"], capacity: 40, phone: "+91 98100 22347", ctc: 850000, leaveBalance: 12, leavesTaken: 4, performanceRating: 4.3, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "fiona", empId: "EMP-1020", name: "Fiona Vance", dept: "Finance", designation: "Finance Lead", role: "Finance", status: "Active", joined: "10 Jan 2024", manager: "COO", email: "finance@pulseorganizer.io", skills: ["Accounting", "Excel"], capacity: 40, phone: "+91 98100 22348", ctc: 1500000, leaveBalance: 13, leavesTaken: 3, performanceRating: 4.7, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "harriet", empId: "EMP-1021", name: "Harriet Reed", dept: "HR", designation: "HR Generalist", role: "HR", status: "Active", joined: "15 Feb 2024", manager: "COO", email: "hr@pulseorganizer.io", skills: ["Recruiting", "Onboarding"], capacity: 40, phone: "+91 98100 22349", ctc: 1100000, leaveBalance: 14, leavesTaken: 2, performanceRating: 4.5, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } },
  { id: "karan", empId: "EMP-1015", name: "Karan Shah", dept: "Engineering", designation: "Developer", role: "Resource", status: "Inactive", joined: "08 Mar 2023", manager: "David Okoye", email: "karan.s@pulseorganizer.io", skills: ["React", "CSS"], capacity: 40, phone: "+91 98100 22350", ctc: 950000, leaveBalance: 12, leavesTaken: 5, performanceRating: 4.1, onboardingStatus: "Complete", onboardingChecklist: { bgCheck: true, contractSigned: true, hardwareIssued: true, bankDetailsAdded: true } }
];

const INITIAL_CLIENTS = [
  { id: "cl_meridian", name: "Meridian Capital", industry: "Financial Services", primaryName: "Anita Rao", primaryEmail: "anita.rao@meridian.com", primaryPhone: "+91 98100 11223", secondaryName: "Rohan Sen", secondaryEmail: "rohan.sen@meridian.com", secondaryPhone: "+91 98100 11224", website: "meridiancap.com", country: "India", address: "BKC, Mumbai", notes: "Key account — IPO platform engagement.", status: "Active" },
  { id: "cl_astra", name: "Astra Retail Group", industry: "Retail", primaryName: "James Okafor", primaryEmail: "james@astraretail.com", primaryPhone: "+44 20 7946 0000", secondaryName: "Sarah Finch", secondaryEmail: "s.finch@astraretail.com", secondaryPhone: "+44 20 7946 0001", website: "astraretail.com", country: "United Kingdom", address: "London", notes: "Commerce re-platforming.", status: "Active" },
  { id: "cl_habile", name: "HabileLabs", industry: "IT Services", primaryName: "Dinesh Chaudhary", primaryEmail: "dinesh@habilelabs.io", primaryPhone: "+91 141 222 3344", secondaryName: "Kapil Kumar", secondaryEmail: "kapil.k@habilelabs.io", secondaryPhone: "+91 141 222 3345", website: "habilelabs.io", country: "India", address: "Jaipur", notes: "Internal product work.", status: "Active" },
  { id: "cl_internal", name: "Internal Platform", industry: "Internal", primaryName: "Platform Lead", primaryEmail: "platform@pulseorganizer.io", primaryPhone: "+91 99887 76655", secondaryName: "System Administrator", secondaryEmail: "sysadmin@pulseorganizer.io", secondaryPhone: "+91 99887 76656", website: "—", country: "India", address: "—", notes: "Internal design-system initiative.", status: "Active" },
  { id: "cl_helios", name: "Helios Logistics", industry: "Logistics", primaryName: "Sandeep Verma", primaryEmail: "sandeep@helios.co", primaryPhone: "+91 99000 22110", secondaryName: "Vikram Malhotra", secondaryEmail: "vikram@helios.co", secondaryPhone: "+91 99000 22111", website: "helioslogistics.co", country: "India", address: "Pune", notes: "New mobile app — pre-kickoff.", status: "Active" },
  { id: "cl_infosys", name: "Infosys", industry: "IT Services", primaryName: "Meera Iyer", primaryEmail: "meera@infosys.com", primaryPhone: "+91 80 2852 0261", secondaryName: "Nikhil Joshi", secondaryEmail: "nikhil.j@infosys.com", secondaryPhone: "+91 80 2852 0262", website: "infosys.com", country: "India", address: "Bengaluru", notes: "Prospect — no active projects.", status: "Active" },
  { id: "cl_infoedge", name: "Info Edge", industry: "Internet", primaryName: "Rohit Sethi", primaryEmail: "rohit@infoedge.com", primaryPhone: "+91 120 333 0000", secondaryName: "Amit Bhatia", secondaryEmail: "amit.b@infoedge.com", secondaryPhone: "+91 120 333 0001", website: "infoedge.com", country: "India", address: "Noida", notes: "Prospect.", status: "Active" },
  { id: "cl_mumbai", name: "Mumbai client", industry: "Consulting", primaryName: "Rohan Sharma", primaryEmail: "rohan@mumbaiclient.com", primaryPhone: "+91 99999 88888", secondaryName: "Preeti Singh", secondaryEmail: "preeti@mumbaiclient.com", secondaryPhone: "+91 99999 88889", website: "mumbaiclient.com", country: "India", address: "Nariman Point, Mumbai", notes: "Partner with outsourced resource pool.", status: "Active" },
  { id: "cl_infobeans", name: "InfoBeans", industry: "IT Services", primaryName: "Kavya Nair", primaryEmail: "kavya@infobeans.com", primaryPhone: "+91 731 471 1100", secondaryName: "Manish Gupta", secondaryEmail: "manish@infobeans.com", secondaryPhone: "+91 731 471 1101", website: "infobeans.com", country: "India", address: "Indore", notes: "Prospect.", status: "Inactive" },
  { id: "cl_tcs", name: "Tata Consultancy Services (TCS)", industry: "IT Services", primaryName: "Rajesh Gopinathan", primaryEmail: "rajesh@tcs.com", primaryPhone: "+91 22 6778 9999", secondaryName: "Vikas Mehta", secondaryEmail: "vikas.m@tcs.com", secondaryPhone: "+91 22 6778 9998", website: "tcs.com", country: "India", address: "Mumbai", notes: "Major enterprise lead.", status: "Active" },
  { id: "cl_wipro", name: "Wipro Technologies", industry: "IT Services", primaryName: "Thierry Delaporte", primaryEmail: "thierry@wipro.com", primaryPhone: "+91 80 2844 0011", secondaryName: "Anand Sen", secondaryEmail: "anand.s@wipro.com", secondaryPhone: "+91 80 2844 0012", website: "wipro.com", country: "India", address: "Bengaluru", notes: "Prospect.", status: "Active" },
  { id: "cl_cognizant", name: "Cognizant", primaryName: "Brian Humphries", primaryEmail: "brian@cognizant.com", primaryPhone: "+1 201 801 0233", secondaryName: "David Miller", secondaryEmail: "david.m@cognizant.com", secondaryPhone: "+1 201 801 0234", website: "cognizant.com", country: "USA", address: "Teaneck, USA", notes: "Exploratory talks on cloud ops.", status: "Active" }
];

const INITIAL_OUTSOURCED = [
  { id: "out_1", name: "Jyot", clientId: "cl_mumbai", status: "Active", start: "15-Dec-25", end: "", profile: "QA", source: "Habilelabs", input: "20,000 + GST", billing: "28,000 + GST", margin: "8,000", note: "0 paid leaves", projId: "ipo", skills: "Selenium, Java, Cypress", duration: "6 Months", allocation: "100%" },
  { id: "out_2", name: "Kapil Saxena", clientId: "cl_mumbai", status: "Active", start: "19-Dec-25", end: "", profile: "QA", source: "Habilelabs", input: "20,000 + GST", billing: "28,000 + GST", margin: "8,000", note: "1 paid leaves", projId: "lms", skills: "Manual Testing, Postman, JIRA", duration: "6 Months", allocation: "100%" },
  { id: "out_3", name: "Alvin", clientId: "cl_mumbai", status: "Active", start: "15-Dec-25", end: "", profile: "Solution Architect", source: "Geek2Connect", input: "85,000 + GST", billing: "1,10,000 + GST", margin: "25,000", note: "2 paid leaves", projId: "astra", skills: "AWS, Kubernetes, Java, Spring Boot", duration: "12 Months", allocation: "50%" },
  { id: "out_4", name: "Janabai Shinde", clientId: "cl_mumbai", status: "Active", start: "07-Jan-26", end: "", profile: "Frontend Mobile Developer", source: "Teknikoz", input: "35,000 + GST", billing: "45,000 + GST", margin: "10,000", note: "3 paid leaves", projId: "helios", skills: "React Native, Flutter, Swift", duration: "3 Months", allocation: "100%" },
  { id: "out_5", name: "Arshad Qadri", clientId: "cl_mumbai", status: "Active", start: "07-Jan-26", end: "", profile: "Frontend Web Developer", source: "Modern Agile Technologies", input: "30,000 + GST", billing: "40,000 + GST", margin: "10,000", note: "4 paid leaves", projId: "ipo", skills: "React, Next.js, TypeScript", duration: "6 Months", allocation: "100%" }
];

const INITIAL_PROJECTS = [
  {
    id: "ipo",
    name: "IPO Platform",
    client: "Meridian Capital",
    clientId: "cl_meridian",
    type: "Client",
    status: "On Track",
    start: "01 May 2026",
    tentativeEnd: "31 Jul 2026",
    actualCompletion: "—",
    priority: "High",
    estimated: 600,
    logged: 410,
    pmId: "sarah",
    sales: "Rahul Sharma",
    resources: [
      { id: "pavneet", pct: 50, planned: 20, actual: 18 },
      { id: "rahul", pct: 25, planned: 10, actual: 4 },
      { id: "liam", pct: 70, planned: 28, actual: 30 }
    ],
    pending: 2,
    files: [
      { name: "SOW_Meridian_IPO.pdf", type: "PDF", by: "Sarah Jenkins", date: "02 May 2026", version: "v1" },
      { name: "Wireframes_Dashboard_Final.png", type: "PNG", by: "Pavneet Kaur", date: "24 May 2026", version: "v2" }
    ],
    desc: "End-to-end investment portal and public listing platform for Meridian Capital retail investors."
  },
  {
    id: "lms",
    name: "Learnify LMS",
    client: "HabileLabs",
    clientId: "cl_habile",
    type: "Internal",
    status: "On Hold",
    start: "15 Apr 2026",
    tentativeEnd: "30 Sep 2026",
    actualCompletion: "—",
    priority: "Medium",
    estimated: 400,
    logged: 180,
    pmId: "sarah",
    sales: "—",
    resources: [
      { id: "pavneet", pct: 20, planned: 8, actual: 8 },
      { id: "liam", pct: 50, planned: 20, actual: 18 }
    ],
    pending: 0,
    files: [],
    desc: "Internal learning management system refactor incorporating interactive testing tools and async evaluation."
  },
  {
    id: "phoenix",
    name: "Phoenix Design System 2.0",
    client: "Internal Platform",
    clientId: "cl_internal",
    type: "Internal",
    status: "Delayed",
    start: "01 Mar 2026",
    tentativeEnd: "31 Aug 2026",
    actualCompletion: "—",
    priority: "Medium",
    estimated: 520,
    logged: 300,
    pmId: "sarah",
    sales: "—",
    resources: [
      { id: "marcus", pct: 50, planned: 20, actual: 22 },
      { id: "sophia", pct: 30, planned: 12, actual: 10 }
    ],
    pending: 1,
    files: [],
    desc: "Cross-platform design token engine and components library implementation based on WCAG AA accessibility specs."
  },
  {
    id: "astra",
    name: "Astra Commerce Engine",
    client: "Astra Retail Group",
    clientId: "cl_astra",
    type: "Client",
    status: "Completed",
    start: "10 Feb 2026",
    tentativeEnd: "30 Jun 2026",
    actualCompletion: "30 Jun 2026",
    priority: "High",
    estimated: 720,
    logged: 540,
    pmId: "sarah",
    sales: "Priya Menon",
    resources: [
      { id: "marcus", pct: 25, planned: 10, actual: 12 },
      { id: "linda", pct: 100, planned: 40, actual: 38 },
      { id: "david", pct: 40, planned: 16, actual: 14 }
    ],
    pending: 0,
    files: [],
    desc: "Headless commerce APIs and checkout workflow integration with secure multi-tenant payment endpoints."
  },
  {
    id: "helios",
    name: "Helios Mobile App",
    client: "Helios Logistics",
    clientId: "cl_helios",
    type: "Client",
    status: "On Hold",
    start: "01 Jul 2026",
    tentativeEnd: "30 Sep 2026",
    actualCompletion: "—",
    priority: "Medium",
    estimated: 500,
    logged: 0,
    pmId: "david_pm",
    sales: "Rahul Sharma",
    resources: [],
    pending: 0,
    files: [],
    desc: "Driver dispatch and delivery routing mobile app for iOS and Android platforms."
  }
];

const INITIAL_FINANCE = [
  { id: "f1", type: "Income", proj: "ipo", cat: "Project Billing", date: "30 May 2026", amt: 800000, desc: "Milestone 2 delivery billing" },
  { id: "f2", type: "Income", proj: "ipo", cat: "Retainer", date: "01 May 2026", amt: 400000, desc: "Monthly retainer" },
  { id: "f3", type: "Expense", proj: "ipo", cat: "Salary Cost", date: "31 May 2026", amt: 600000, desc: "Delivery team salaries" },
  { id: "f4", type: "Expense", proj: "ipo", cat: "Software Cost", date: "15 May 2026", amt: 180000, desc: "Infra & licenses" },
  { id: "f5", type: "Income", proj: "astra", cat: "Project Billing", date: "28 May 2026", amt: 1200000, desc: "Phase 1 acceptance" },
  { id: "f6", type: "Income", proj: "astra", cat: "Consulting", date: "10 May 2026", amt: 400000, desc: "Architecture advisory" },
  { id: "f7", type: "Expense", proj: "astra", cat: "Salary Cost", date: "31 May 2026", amt: 850000, desc: "Engineering salaries" },
  { id: "f8", type: "Expense", proj: "astra", cat: "Vendor Cost", date: "20 May 2026", amt: 250000, desc: "Payment gateway vendor" },
  { id: "f9", type: "Income", proj: "lms", cat: "Project Billing", date: "22 May 2026", amt: 400000, desc: "Internal cross-charge" },
  { id: "f10", type: "Expense", proj: "lms", cat: "Salary Cost", date: "31 May 2026", amt: 520000, desc: "Design & content team" },
  { id: "f11", type: "Expense", proj: "phoenix", cat: "Salary Cost", date: "31 May 2026", amt: 380000, desc: "Design systems team" },
  { id: "f12", type: "Income", proj: "helios", cat: "Retainer", date: "05 Jun 2026", amt: 900000, desc: "Pre-kickoff retainer" },
  { id: "f13", type: "Expense", proj: "helios", cat: "Marketing", date: "03 Jun 2026", amt: 200000, desc: "Discovery & pitch costs" },
  { id: "f14", type: "Expense", proj: null, cat: "Infrastructure", date: "01 Jun 2026", amt: 120000, desc: "Org-wide cloud & tooling" }
];

const INITIAL_SALES = [
  { name: "Rahul Sharma", target: 500000, achieved: 320000, incentive: 4500, period: "Q2 FY26", closed: 6, revenue: 1200000, opps: 4, trend: [18, 22, 26, 24, 30, 32] },
  { name: "Priya Menon", target: 400000, achieved: 380000, incentive: 6000, period: "Q2 FY26", closed: 5, revenue: 950000, opps: 3, trend: [20, 24, 28, 30, 34, 38] },
  { name: "Aman Gupta", target: 300000, achieved: 120000, incentive: 1000, period: "Q2 FY26", closed: 2, revenue: 300000, opps: 5, trend: [6, 8, 7, 10, 11, 12] }
];

const INITIAL_TIMESHEETS = [
  // Pavneet Kaur (EMP-1003) - Draft
  {
    id: "ts_pavneet_0",
    employeeId: "pavneet",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Draft",
    comment: "",
    entries: {
      ipo: [
        { h: 5, d: "Built dashboard wireframes and reviewed client feedback on layout." },
        { h: 4, d: "Updated typography styles and refined responsive breakpoints." },
        { h: 4, d: "Finalized responsive layouts and prepared handoff specs." },
        { h: 3, d: "Component states and hover/focus interactions." },
        { h: 2, d: "Async review notes and backlog grooming." },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ],
      lms: [
        { h: 2, d: "Drafted the course-catalog screens and primary navigation flow." },
        { h: 2, d: "Iterated on the quiz UI based on stakeholder feedback." },
        { h: 2, d: "Built empty and loading states for the lesson player." },
        { h: 2, d: "Accessibility pass — fixed contrast issues on the course cards." },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  },
  // Liam Robinson (EMP-1009) - Draft
  {
    id: "ts_liam_0",
    employeeId: "liam",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Draft",
    comment: "",
    entries: {
      ipo: [
        { h: 8, d: "Animated dashboard load sequence and chart transitions." },
        { h: 7, d: "Lottie export pipeline and performance tuning." },
        { h: 6, d: "Microinteractions for the filter controls." },
        { h: 5, d: "Reduced-motion variants and QA fixes." },
        { h: 4, d: "Handoff notes and timing documentation." },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ],
      lms: [
        { h: 5, d: "Created video content for lesson player onboarding screens." },
        { h: 5, d: "Edited promotional audio and synchronized timelines." },
        { h: 4, d: "Designed custom vector icons and exported Lottie JSON." },
        { h: 4, d: "Stakeholder presentation for animation standards review." },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  },
  // Marcus Vance (EMP-1005) - Draft
  {
    id: "ts_marcus_0",
    employeeId: "marcus",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Draft",
    comment: "",
    entries: {
      phoenix: [
        { h: 5, d: "Token contrast audit across the component set." },
        { h: 5, d: "Refactored spacing scale and documented usage." },
        { h: 4, d: "Accessibility pass on form components." },
        { h: 4, d: "Updated Figma library and published changes." },
        { h: 4, d: "Design crit prep and reviewer feedback." },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ],
      astra: [
        { h: 3, d: "Checkout flow redlines and spacing corrections." },
        { h: 3, d: "Figma library alignments with backend parameters." },
        { h: 3, d: "Responsive test reviews for checkout layout." },
        { h: 3, d: "SOW design tasks and client assets coordination." },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  },
  // Linda Wu (EMP-1006) - Approved
  {
    id: "ts_linda_0",
    employeeId: "linda",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Approved",
    comment: "Good work on checking out APIs.",
    entries: {
      astra: [
        { h: 8, d: "Checkout service refactor and unit tests." },
        { h: 8, d: "Payment gateway integration." },
        { h: 8, d: "DB migration scripts and review." },
        { h: 8, d: "Load testing and bug fixes." },
        { h: 6, d: "Deployment and monitoring setup." },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  },
  // David Chen (EMP-1007) - Approved
  {
    id: "ts_david_0",
    employeeId: "david",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Approved",
    comment: "Excellent QA results.",
    entries: {
      astra: [
        { h: 3, d: "Regression suite for checkout flow." },
        { h: 3, d: "Cross-browser test coverage." },
        { h: 3, d: "Bug triage and reporting." },
        { h: 3, d: "Automation script maintenance." },
        { h: 2, d: "Test plan documentation." },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  },
  // Rahul Nair (EMP-1004) - Rejected
  {
    id: "ts_rahul_0",
    employeeId: "rahul",
    weekIdx: 0,
    weekLabel: "24 – 30 June 2026",
    status: "Rejected",
    comment: "Only 4h logged against 10h allocated — please complete the week.",
    entries: {
      ipo: [
        { h: 2, d: "Set up the project scaffold and routing." },
        { h: 2, d: "Initial API client and types." },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" },
        { h: 0, d: "" }
      ]
    }
  }
];

const INITIAL_NOTIFS = [
  { id: "n1", t: "Priya Menon hit 95% of her Q2 sales target", time: "1h ago", tone: "#3F7A52" },
  { id: "n2", t: "Revenue added — ₹90 L retainer on Helios Logistics", time: "3h ago", tone: "#38618C" },
  { id: "n3", t: "New employee added — Aman Gupta (Sales)", time: "Yesterday", tone: "#9A9AA1" },
  { id: "n4", t: "Expense added — ₹12 L infrastructure", time: "Yesterday", tone: "#9A9AA1" }
];

const INITIAL_LEAVES = [
  { id: "lv_1", employeeId: "rahul", name: "Rahul Nair", start: "2026-07-02", end: "2026-07-05", days: 3, type: "Privilege Leave", reason: "Family wedding", status: "Pending" },
  { id: "lv_2", employeeId: "pavneet", name: "Pavneet Kaur", start: "2026-07-10", end: "2026-07-11", days: 1.5, type: "Sick Leave", reason: "Dental procedure", status: "Pending" },
  { id: "lv_3", employeeId: "marcus", name: "Marcus Vance", start: "2026-06-15", end: "2026-06-16", days: 2, type: "Casual Leave", reason: "Personal travel", status: "Approved" }
];

const createEmptyEntries = (projects, empId) => {
  const empProjects = projects.filter(p => p.resources.some(r => r.id === empId));
  const entries = {};
  empProjects.forEach(p => {
    entries[p.id] = Array(7).fill(null).map(() => ({ h: 0, d: "" }));
  });
  return entries;
};

// ── Context Provider ────────────────────────────────────────────────────

export function DatabaseProvider({ children }) {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('pulse_people');
    return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('pulse_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('pulse_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [outsourced, setOutsourced] = useState(() => {
    const saved = localStorage.getItem('pulse_outsourced');
    return saved ? JSON.parse(saved) : INITIAL_OUTSOURCED;
  });

  const [finance, setFinance] = useState(() => {
    const saved = localStorage.getItem('pulse_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('pulse_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [timesheets, setTimesheets] = useState(() => {
    const saved = localStorage.getItem('pulse_timesheets');
    return saved ? JSON.parse(saved) : INITIAL_TIMESHEETS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('pulse_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFS;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('pulse_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pulse_user');
    if (saved) return JSON.parse(saved);
    return INITIAL_PEOPLE.find(p => p.id === "marcus");
  });

  useEffect(() => { localStorage.setItem('pulse_people', JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem('pulse_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('pulse_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('pulse_outsourced', JSON.stringify(outsourced)); }, [outsourced]);
  useEffect(() => { localStorage.setItem('pulse_finance', JSON.stringify(finance)); }, [finance]);
  useEffect(() => { localStorage.setItem('pulse_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('pulse_timesheets', JSON.stringify(timesheets)); }, [timesheets]);
  useEffect(() => { localStorage.setItem('pulse_notifs', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('pulse_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('pulse_user', JSON.stringify(currentUser));
    else localStorage.removeItem('pulse_user');
  }, [currentUser]);

  const loginAs = (userId) => {
    const user = people.find(p => p.id === userId || p.email === userId);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addNotification = (t, tone = "#38618C") => {
    const newNotif = { id: "n_" + Date.now(), t, time: "Just now", tone };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  const getWeekLabel = (weekIdx) => {
    const startBase = new Date("2026-06-24");
    const endBase = new Date("2026-06-30");
    startBase.setDate(startBase.getDate() + weekIdx * 7);
    endBase.setDate(endBase.getDate() + weekIdx * 7);

    const fmt = (d) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    };
    return `${fmt(startBase)} – ${fmt(endBase)} 2026`;
  };

  const getTimesheet = (employeeId, weekIdx) => {
    const existing = timesheets.find(ts => ts.employeeId === employeeId && ts.weekIdx === weekIdx);
    if (existing) return existing;

    const weekLabel = getWeekLabel(weekIdx);
    const emptyEntries = createEmptyEntries(projects, employeeId);
    return {
      id: `ts_${employeeId}_${weekIdx}_${Date.now()}`,
      employeeId,
      weekIdx,
      weekLabel,
      status: "Draft",
      comment: "",
      entries: emptyEntries
    };
  };

  const saveTimesheetDraft = (employeeId, weekIdx, entries) => {
    setTimesheets(prev => {
      const idx = prev.findIndex(ts => ts.employeeId === employeeId && ts.weekIdx === weekIdx);
      const updated = {
        id: idx >= 0 ? prev[idx].id : `ts_${employeeId}_${weekIdx}_${Date.now()}`,
        employeeId,
        weekIdx,
        weekLabel: getWeekLabel(weekIdx),
        status: "Draft",
        comment: "",
        entries
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      } else {
        return [...prev, updated];
      }
    });
  };

  const submitTimesheet = (employeeId, weekIdx, entries) => {
    setTimesheets(prev => {
      const idx = prev.findIndex(ts => ts.employeeId === employeeId && ts.weekIdx === weekIdx);
      const updated = {
        id: idx >= 0 ? prev[idx].id : `ts_${employeeId}_${weekIdx}_${Date.now()}`,
        employeeId,
        weekIdx,
        weekLabel: getWeekLabel(weekIdx),
        status: "Submitted",
        comment: "",
        entries
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      } else {
        return [...prev, updated];
      }
    });

    const empName = people.find(p => p.id === employeeId)?.name || employeeId;
    addNotification(`${empName} submitted a timesheet for week ${getWeekLabel(weekIdx)}`, "#38618C");
  };

  const approveTimesheet = (timesheetId) => {
    setTimesheets(prev => {
      const ts = prev.find(t => t.id === timesheetId);
      if (!ts) return prev;

      setProjects(currProjects => {
        return currProjects.map(proj => {
          const hoursLoggedForProj = ts.entries[proj.id];
          if (!hoursLoggedForProj) return proj;

          const totalLogged = hoursLoggedForProj.reduce((sum, d) => sum + (d.h || 0), 0);
          const hasResource = proj.resources.some(r => r.id === ts.employeeId);
          let updatedResources;
          if (hasResource) {
            updatedResources = proj.resources.map(r => 
              r.id === ts.employeeId ? { ...r, actual: totalLogged } : r
            );
          } else {
            updatedResources = [...proj.resources, { id: ts.employeeId, pct: 0, planned: 0, actual: totalLogged }];
          }

          const projectTotalLogged = updatedResources.reduce((sum, r) => sum + r.actual, 0);

          return {
            ...proj,
            resources: updatedResources,
            logged: Math.max(proj.logged, projectTotalLogged)
          };
        });
      });

      const employeeId = ts.employeeId;
      const empName = people.find(p => p.id === employeeId)?.name || employeeId;
      addNotification(`Approved timesheet for ${empName}`, "#3F7A52");

      return prev.map(t => t.id === timesheetId ? { ...t, status: "Approved", comment: "" } : t);
    });
  };

  const rejectTimesheet = (timesheetId, comment) => {
    setTimesheets(prev => {
      const ts = prev.find(t => t.id === timesheetId);
      if (!ts) return prev;

      const empName = people.find(p => p.id === ts.employeeId)?.name || ts.employeeId;
      addNotification(`Changes requested on timesheet for ${empName}`, "#A23B3B");

      return prev.map(t => t.id === timesheetId ? { ...t, status: "Rejected", comment: comment || "Changes requested." } : t);
    });
  };

  const createProject = (projData, pickedResources, filesData = []) => {
    const resources = Object.keys(pickedResources).map(id => ({
      id,
      pct: pickedResources[id].pct,
      planned: pickedResources[id].hours,
      actual: 0,
      billable: pickedResources[id].billable,
      billing: pickedResources[id].billing
    }));

    const newProj = {
      id: projData.id || "proj_" + Date.now(),
      name: projData.name,
      client: projData.client,
      clientId: projData.clientId,
      type: projData.type || "Client",
      status: projData.status || "On Track",
      start: projData.start || "Today",
      tentativeEnd: projData.tentativeEnd || projData.end || "Ongoing",
      actualCompletion: projData.actualCompletion || "—",
      priority: projData.priority || "Medium",
      estimated: parseInt(projData.estimated) || 100,
      logged: 0,
      pmId: currentUser ? currentUser.id : "sarah",
      sales: projData.sales || "—",
      resources,
      pending: 0,
      files: filesData,
      desc: projData.desc || ""
    };

    setProjects(prev => [...prev, newProj]);
    addNotification(`Project created: ${newProj.name}`, "#38618C");
  };

  const updateProject = (projId, fields, resourcesData) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p;
      return {
        ...p,
        ...fields,
        tentativeEnd: fields.tentativeEnd || fields.end || p.tentativeEnd || p.end || "Ongoing",
        actualCompletion: fields.actualCompletion || p.actualCompletion || "—",
        resources: resourcesData || p.resources
      };
    }));
    addNotification(`Project updated: ${fields.name || projId}`, "#38618C");
  };

  const deleteProject = (projId) => {
    const proj = projects.find(p => p.id === projId);
    setProjects(prev => prev.filter(p => p.id !== projId));
    if (proj) {
      addNotification(`Project deleted: ${proj.name}`, "#9A9AA1");
    }
  };

  const removeResourceFromProject = (projId, resId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p;
      return {
        ...p,
        resources: p.resources.filter(r => r.id !== resId)
      };
    }));
  };

  const createClient = (clientData) => {
    const newClient = {
      id: clientData.id || "cl_" + Date.now(),
      status: "Active",
      ...clientData
    };
    setClients(prev => [...prev, newClient]);
    addNotification(`Client created: ${newClient.name}`, "#3F7A52");
    return newClient;
  };

  const updateClient = (clientId, fields) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...fields } : c));
    addNotification(`Updated client: ${fields.name || clientId}`, "#38618C");
  };

  const toggleClientStatus = (clientId) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const nextStatus = c.status === "Active" ? "Inactive" : "Active";
      addNotification(`Client ${c.name} is now ${nextStatus}`, nextStatus === "Active" ? "#3F7A52" : "#9A9AA1");
      return { ...c, status: nextStatus };
    }));
  };

  const addOutsourced = (resource) => {
    const newRes = {
      id: "out_" + Date.now(),
      status: "Active",
      ...resource
    };
    setOutsourced(prev => [...prev, newRes]);
    addNotification(`Added outsourced resource: ${newRes.name}`, "#3F7A52");
  };

  const updateOutsourced = (id, fields) => {
    setOutsourced(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
    addNotification(`Updated outsourced resource: ${fields.name || id}`, "#38618C");
  };

  const deleteOutsourced = (id) => {
    const res = outsourced.find(r => r.id === id);
    setOutsourced(prev => prev.filter(r => r.id !== id));
    if (res) {
      addNotification(`Deleted outsourced resource: ${res.name}`, "#9A9AA1");
    }
  };

  const addEmployee = (empData) => {
    const newEmp = {
      id: empData.id || "emp_" + Date.now(),
      status: "Active",
      project: "—",
      last: "—",
      util: 0,
      skills: empData.skills || [],
      ...empData
    };
    setPeople(prev => [...prev, newEmp]);
    addNotification(`Added employee: ${newEmp.name}`, "#3F7A52");
  };

  const updateEmployee = (empId, fields) => {
    setPeople(prev => prev.map(p => p.id === empId ? { ...p, ...fields } : p));
    if (currentUser && currentUser.id === empId) {
      setCurrentUser(prev => ({ ...prev, ...fields }));
    }
  };

  const updateSkills = (empId, skillsList) => {
    setPeople(prev => prev.map(p => p.id === empId ? { ...p, skills: skillsList } : p));
    if (currentUser && currentUser.id === empId) {
      setCurrentUser(prev => ({ ...prev, skills: skillsList }));
    }
  };

  const addFinanceEntry = (entryData) => {
    const newEntry = {
      id: "f_" + Date.now(),
      ...entryData
    };
    setFinance(prev => [newEntry, ...prev]);
    const typeLabel = newEntry.type === "Income" ? "Revenue" : "Expense";
    const symbol = newEntry.type === "Income" ? "+" : "−";
    addNotification(`${typeLabel} added: ${symbol}₹${newEntry.amt.toLocaleString("en-IN")}`, newEntry.type === "Income" ? "#3F7A52" : "#A23B3B");
  };

  const applyLeave = (leaveData) => {
    const newLeave = {
      id: "lv_" + Date.now(),
      status: "Pending",
      ...leaveData
    };
    setLeaves(prev => [...prev, newLeave]);
    addNotification(`Leave request submitted by ${leaveData.name}`, "#38618C");
  };

  const approveLeave = (leaveId) => {
    setLeaves(prev => {
      const match = prev.find(l => l.id === leaveId);
      if (!match) return prev;
      
      setPeople(currPeople => currPeople.map(p => {
        if (p.id === match.employeeId) {
          const leavesTaken = (p.leavesTaken || 0) + match.days;
          const leaveBalance = Math.max(0, (p.leaveBalance || 12) - match.days);
          return { ...p, leavesTaken, leaveBalance };
        }
        return p;
      }));

      addNotification(`Approved leave for ${match.name}`, "#3F7A52");
      return prev.map(l => l.id === leaveId ? { ...l, status: "Approved" } : l);
    });
  };

  const rejectLeave = (leaveId, comment) => {
    setLeaves(prev => {
      const match = prev.find(l => l.id === leaveId);
      if (!match) return prev;
      addNotification(`Rejected leave for ${match.name}`, "#A23B3B");
      return prev.map(l => l.id === leaveId ? { ...l, status: "Rejected", comment } : l);
    });
  };

  const updateOnboardingChecklist = (empId, checklist) => {
    setPeople(prev => prev.map(p => {
      if (p.id === empId) {
        const allDone = Object.values(checklist).every(Boolean);
        return {
          ...p,
          onboardingChecklist: checklist,
          onboardingStatus: allDone ? "Complete" : "In Progress"
        };
      }
      return p;
    }));
  };

  const updatePerformanceRating = (empId, performanceRating) => {
    setPeople(prev => prev.map(p => p.id === empId ? { ...p, performanceRating: parseFloat(performanceRating) || 0 } : p));
  };

  const updateEmployeeHRDetails = (empId, fields) => {
    setPeople(prev => prev.map(p => p.id === empId ? { ...p, ...fields } : p));
  };

  const value = {
    currentUser,
    loginAs,
    logout,
    people,
    projects,
    clients,
    outsourced,
    finance,
    sales,
    timesheets,
    notifications,
    leaves,
    getTimesheet,
    saveTimesheetDraft,
    submitTimesheet,
    approveTimesheet,
    rejectTimesheet,
    createProject,
    updateProject,
    deleteProject,
    removeResourceFromProject,
    createClient,
    updateClient,
    toggleClientStatus,
    addOutsourced,
    updateOutsourced,
    deleteOutsourced,
    addEmployee,
    updateEmployee,
    updateSkills,
    addFinanceEntry,
    applyLeave,
    approveLeave,
    rejectLeave,
    updateOnboardingChecklist,
    updatePerformanceRating,
    updateEmployeeHRDetails,
    getWeekLabel
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
