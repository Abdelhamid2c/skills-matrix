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

/**
 * Échelle d'évaluation standard (0-4) - Technical Skills
 */
export const scoreScale = [
  { value: 0, label: '0 - No knowledge', color: 'bg-gray-100 text-gray-800', description: 'No knowledge or experience' },
  { value: 1, label: '1 - Basic knowledge', color: 'bg-red-100 text-red-800', description: 'Limited theoretical knowledge' },
  { value: 2, label: '2 - Intermediate knowledge', color: 'bg-orange-100 text-orange-800', description: 'Can execute with supervision' },
  { value: 3, label: '3 - Good mastery', color: 'bg-yellow-100 text-yellow-800', description: 'Autonomous in most situations' },
  { value: 4, label: '4 - Expert', color: 'bg-green-100 text-green-800', description: 'Complete mastery, able to train others' }
];

/**
 * Échelle d'évaluation pour Behavioral Traits et Communication Skills (0-10)
 */
export const behavioralScoreScale = [
  { value: 0, label: '0 - Not at all', color: 'bg-red-100 text-red-800', description: 'No demonstration of this skill' },
  { value: 1, label: '1 - Very weak', color: 'bg-red-100 text-red-800', description: 'Rarely observed' },
  { value: 2, label: '2 - Weak', color: 'bg-red-100 text-red-800', description: 'Underdeveloped' },
  { value: 3, label: '3 - Insufficient', color: 'bg-orange-100 text-orange-800', description: 'Below expectations' },
  { value: 4, label: '4 - Below average', color: 'bg-orange-100 text-orange-800', description: 'Starting to develop' },
  { value: 5, label: '5 - Average', color: 'bg-yellow-100 text-yellow-800', description: 'Acceptable level' },
  { value: 6, label: '6 - Above average', color: 'bg-yellow-100 text-yellow-800', description: 'Above average performance' },
  { value: 7, label: '7 - Good', color: 'bg-green-100 text-green-800', description: 'Well developed' },
  { value: 8, label: '8 - Very good', color: 'bg-green-100 text-green-800', description: 'High performance' },
  { value: 9, label: '9 - Excellent', color: 'bg-blue-100 text-blue-800', description: 'Demonstrated excellence' },
  { value: 10, label: '10 - Outstanding', color: 'bg-purple-100 text-purple-800', description: 'Reference model' }
];

/**
 * Catégories qui utilisent l'échelle comportementale (0-10)
 */
export const behavioralCategories = [
  // 'Communication Skills',
  'Behavioral Traits',

];

/**
 * Fonction pour obtenir l'échelle appropriée selon la catégorie
 */
export const getScaleForCategory = (categoryPath) => {
  // Vérifier si c'est une catégorie comportementale
  const isBehavioral = categoryPath.some(path =>
    behavioralCategories.includes(path)
  );

  return isBehavioral ? behavioralScoreScale : scoreScale;
};

/**
 * Fonction pour obtenir le label du score selon l'échelle
 */
export const getScoreLabel = (score, scale) => {
  const scoreInfo = scale.find(s => s.value === score);
  return scoreInfo ? scoreInfo.label : 'Not evaluated';
};

/**
 * Fonction pour obtenir la couleur du score selon l'échelle
 */
export const getScoreColor = (score, scale) => {
  const scoreInfo = scale.find(s => s.value === score);
  return scoreInfo ? scoreInfo.color : 'bg-gray-100 text-gray-800';
};

// Fonction utilitaire pour générer les étapes du questionnaire
export const generateQuestionnaireSteps = (data = skillsData) => {
  const steps = [];

  const processCategory = (categoryName, categoryData, parentPath = []) => {
    if (Array.isArray(categoryData)) {
      // C'est une liste de compétences
      const fullPath = [...parentPath, categoryName];

      // Générer un titre lisible
      let title = '';
      if (fullPath.length === 1) {
        // Catégorie principale seule (ex: "Soft Skills", "Management Skills")
        title = categoryName;
      } else if (fullPath.length === 2) {
        // Sous-catégorie (ex: "Technical Skills > Generic")
        title = categoryName;
      } else if (fullPath.length === 3) {
        // Sous-sous-catégorie (ex: "Process Design > Manufacturing Process Design")
        title = categoryName;
      }

      steps.push({
        category: parentPath[0] || categoryName,
        subCategory: parentPath.length > 0 ? categoryName : '',
        skills: categoryData,
        path: fullPath,
        title: title, // Titre affiché
        fullTitle: fullPath.join(' > ') // Titre complet pour référence
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
