/**
 * Questions et structure du questionnaire de compétences
 */

export const skillsData = {
  "Technical Skills": {
    "Generic": [
      "PP Obeya",
      "KSK",
      "Office Tools (Excel, Word…)",
      "TIGD",
      "GPMS",
      "Harness XC, CapitalH/M",
      "APD Tool",
      "ProdMon",
      "CAD Software (AutoCad, Catia…)"
    ],
    "PCC & RFQ": [
      "PCC Preparation and Update",
      "Target Costing Activity",
      "Tooling Capacity and Concept Definition",
      "Equipment List and Spending Plan preparation",
      "Budget Forecast Preparation and Monitoring",
      "Ramp-Up Cost Evaluation and Follow-Up"
    ],
    "Product & Process Assurance": [
      "SAP & data management",
      "Prototype data management",
      "Spare Parts data management",
      "PM creation",
      "Key Product Caracteristics",
      "Drawing Analysis (Complexity & synergy)",
      "Eng Change Management",
      "ECM (ECR Feasibility)",
      "ECM (ECR cost Evaluation)",
      "ECR Follow-Up and Implementation",
      "Wire tuning Activity",
      "Tube unification Activity",
      "BOM Verification",
      "Matching Data Preparation",
      "DFM Execution",
      "DIS Execution",
      "Similar component analysis",
      "Handling Manual analysis",
      "NTI Management"
    ],
    "Process Design": {
      "Manufacturing Process Design": [
        "Capacity Study",
        "Process design KPIs calculation",
        "WPO design",
        "REFA basics",
        "Plausibility",
        "CPC gum claims creation",
        "Kakotora / Must item list",
        "Production module time affectation",
        "IE ECR Tracking",
        "IE ECR Evaluation & 4M impact",
        "Subassembly decision matrix",
        "coiling method definition",
        "Process \"Line\" Concept",
        "Process flow chart",
        "Sub-assemblies Definition",
        "Work Subdivision",
        "Splice Decision Matrix",
        "Definition of off-line processes",
        "Operators Skills Matrix",
        "Theoretical Time Evaluation SWT",
        "Fluctuation Definition and Analysis",
        "Missing Operations definition",
        "Equipment List Definition",
        "Density and Interferance analysis",
        "Work Area Map definition",
        "Work Instruction",
        "Operation Normes",
        "TIGD Exception List"
      ],
      "Technical Process Design": [
        "Theoretical Ergonomics assessment",
        "Practical Ergonomics assessment",
        "Assembly Jig Board Design Evaluation",
        "Connection Tools definition",
        "Assembly jig parts/forks review",
        "Equipment/tool specification & confirmation"
      ],
      "Manufacturing Process Capability": [
        "Time Measurement",
        "Videos shooting",
        "Videos Analysis",
        "Balancing Scenarios and Plan",
        "Work Combination Table",
        "Work Balance Chart Preparation",
        "YAMAZUMI Chart Preparation",
        "Run Activities Execution",
        "Off line Equipment Stress tests",
        "Ramp-Up Per station and Line Ramp-Up"
      ]
    },
    "MPSO & RFMEA": [
      "Product FMEA Execution",
      "RFMEA by workstation Execution",
      "Advanced MPSO Execution",
      "Official MPSO Execution"
    ]
  },

  "Soft Skills": [
    "Emotional intelligence",
    "Problem-solving",
    "Adaptability",
    "Conflict resolution"
  ],

  "Management Skills": [
    "Project planning & execution",
    "Process Design KPI monitoring",
    "Budgeting & resource allocation",
    "Risk management",
    "Strategic thinking",
    "Team leadership & delegation"
  ],

  "Behavioral Traits": [
    "Accountability",
    "Initiative",
    "Reliability",
    "Collaboration",
    "Self Satisfaction",
    "Motivation",
    "Pride to be part of PP",
    "Growth mindset"
  ],

  "Communication Skills": [
    "Presentations Preparation",
    "Presentations Delivery",
    "English Language Speaking",
    "English Language Writing",
    "Outcomes and Meeting Minutes"
  ]
};

export const scoreScale = [
  {
    value: 0,
    label: '0 - No Knowledge',
    shortLabel: '0',
    description: 'Aucune connaissance',
    color: 'bg-gray-200 text-gray-700',
    hoverColor: 'hover:bg-gray-300'
  },
  {
    value: 1,
    label: '1 - Basic (Theoretical)',
    shortLabel: '1',
    description: 'Compréhension théorique de base',
    color: 'bg-blue-200 text-blue-700',
    hoverColor: 'hover:bg-blue-300'
  },
  {
    value: 2,
    label: '2 - Working (Practical)',
    shortLabel: '2',
    description: 'Capacité pratique de travail',
    color: 'bg-green-200 text-green-700',
    hoverColor: 'hover:bg-green-300'
  },
  {
    value: 3,
    label: '3 - Strong Expertise',
    shortLabel: '3',
    description: 'Expertise solide',
    color: 'bg-yellow-200 text-yellow-700',
    hoverColor: 'hover:bg-yellow-300'
  },
  {
    value: 4,
    label: '4 - Expert (Can Teach)',
    shortLabel: '4',
    description: 'Expert - Peut former les autres',
    color: 'bg-red-200 text-red-700',
    hoverColor: 'hover:bg-red-300'
  }
];

// Fonction utilitaire pour générer les étapes du questionnaire
export const generateQuestionnaireSteps = (data = skillsData) => {
  const steps = [];

  const processCategory = (categoryName, categoryData, parentPath = []) => {
    if (Array.isArray(categoryData)) {
      // C'est une liste de compétences
      steps.push({
        category: parentPath[0] || categoryName,
        subCategory: parentPath.length > 0 ? categoryName : '',
        skills: categoryData,
        path: [...parentPath, categoryName]
      });
    } else if (typeof categoryData === 'object') {
      // C'est un objet avec des sous-catégories
      Object.entries(categoryData).forEach(([subCatName, subCatData]) => {
        processCategory(subCatName, subCatData, [...parentPath, categoryName]);
      });
    }
  };

  Object.entries(data).forEach(([categoryName, categoryData]) => {
    processCategory(categoryName, categoryData);
  });

  return steps;
};

// Fonction utilitaire pour compter le nombre total de compétences
export const getTotalSkillsCount = (data = skillsData) => {
  let count = 0;

  const countSkills = (categoryData) => {
    if (Array.isArray(categoryData)) {
      count += categoryData.length;
    } else if (typeof categoryData === 'object') {
      Object.values(categoryData).forEach(subCatData => {
        countSkills(subCatData);
      });
    }
  };

  Object.values(data).forEach(categoryData => {
    countSkills(categoryData);
  });

  return count;
};

// Fonction utilitaire pour obtenir les statistiques du questionnaire
export const getQuestionnaireStats = (data = skillsData) => {
  const steps = generateQuestionnaireSteps(data);
  const totalSkills = getTotalSkillsCount(data);
  const categories = Object.keys(data);

  return {
    totalSteps: steps.length,
    totalSkills,
    totalCategories: categories.length,
    categories,
    steps
  };
};

export default {
  skillsData,
  scoreScale,
  generateQuestionnaireSteps,
  getTotalSkillsCount,
  getQuestionnaireStats
};
