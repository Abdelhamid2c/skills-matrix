/**
 * Structure hiérarchique complète des compétences
 * Utilisée pour l'affichage de l'organigramme
 */

export const skillsHierarchy = {
  level_0: {
    name: "Compétences Globales",
    description: "Ensemble des compétences requises"
  },

  level_1: [
    {
      id: "technical_skills",
      name: "Technical Skills",
      has_children: true,
      color: "from-purple-500 to-purple-600",
      icon: "⚙️"
    },
    {
      id: "soft_skills",
      name: "Soft Skills",
      has_children: false,
      color: "from-blue-500 to-blue-600",
      icon: "🌟"
    },
    {
      id: "management_skills",
      name: "Management Skills",
      has_children: false,
      color: "from-orange-500 to-orange-600",
      icon: "👔"
    },
    {
      id: "behavioral_traits",
      name: "Behavioral Traits",
      has_children: false,
      color: "from-green-500 to-green-600",
      icon: "💚"
    },
    {
      id: "communication_skills",
      name: "Communication Skills",
      has_children: false,
      color: "from-teal-500 to-teal-600",
      icon: "💬"
    }
  ],

  level_2: [
    {
      parent_id: "technical_skills",
      id: "generic",
      name: "Generic",
      has_children: false,
      description: "Compétences techniques génériques"
    },
    {
      parent_id: "technical_skills",
      id: "pcc_rfq",
      name: "PCC & RFQ",
      has_children: false,
      description: "Préparation et mise à jour PCC"
    },
    {
      parent_id: "technical_skills",
      id: "product_process_assurance",
      name: "Product & Process Assurance",
      has_children: false,
      description: "Assurance produit et processus"
    },
    {
      parent_id: "technical_skills",
      id: "process_design",
      name: "Process Design",
      has_children: true,
      description: "Conception de processus"
    },
    {
      parent_id: "technical_skills",
      id: "mpso_rfmea",
      name: "MPSO & RFMEA",
      has_children: false,
      description: "Analyse FMEA et MPSO"
    }
  ],

  level_3: [
    {
      parent_id: "process_design",
      id: "manufacturing_process_design",
      name: "Manufacturing Process Design",
      has_children: false,
      description: "Conception du processus de fabrication"
    },
    {
      parent_id: "process_design",
      id: "technical_process_design",
      name: "Technical Process Design",
      has_children: false,
      description: "Conception technique du processus"
    },
    {
      parent_id: "process_design",
      id: "manufacturing_process_capability",
      name: "Manufacturing Process Capability",
      has_children: false,
      description: "Capacité du processus de fabrication"
    }
  ],

  metadata: {
    max_depth: 3,
    total_categories: 13,
    structure_type: "hierarchical_tree",
    created_at: "2026-01-11",
    version: "1.0"
  }
};

/**
 * Fonction pour obtenir les enfants d'un nœud
 */
export const getChildrenByParentId = (parentId) => {
  if (parentId === "root") {
    return skillsHierarchy.level_1;
  }

  const level2Children = skillsHierarchy.level_2.filter(item => item.parent_id === parentId);
  const level3Children = skillsHierarchy.level_3.filter(item => item.parent_id === parentId);

  return [...level2Children, ...level3Children];
};

/**
 * Fonction pour obtenir le chemin complet d'un nœud
 */
export const getNodePath = (nodeId) => {
  const path = [];

  // Chercher dans level_1
  const level1Node = skillsHierarchy.level_1.find(n => n.id === nodeId);
  if (level1Node) {
    path.push({ level: 1, ...level1Node });
    return path;
  }

  // Chercher dans level_2
  const level2Node = skillsHierarchy.level_2.find(n => n.id === nodeId);
  if (level2Node) {
    const parent = skillsHierarchy.level_1.find(n => n.id === level2Node.parent_id);
    path.push({ level: 1, ...parent });
    path.push({ level: 2, ...level2Node });
    return path;
  }

  // Chercher dans level_3
  const level3Node = skillsHierarchy.level_3.find(n => n.id === nodeId);
  if (level3Node) {
    const parent2 = skillsHierarchy.level_2.find(n => n.id === level3Node.parent_id);
    const parent1 = skillsHierarchy.level_1.find(n => n.id === parent2.parent_id);
    path.push({ level: 1, ...parent1 });
    path.push({ level: 2, ...parent2 });
    path.push({ level: 3, ...level3Node });
    return path;
  }

  return path;
};

/**
 * Fonction pour obtenir la profondeur d'un nœud
 */
export const getNodeDepth = (nodeId) => {
  if (skillsHierarchy.level_1.find(n => n.id === nodeId)) return 1;
  if (skillsHierarchy.level_2.find(n => n.id === nodeId)) return 2;
  if (skillsHierarchy.level_3.find(n => n.id === nodeId)) return 3;
  return 0;
};

export default skillsHierarchy;
